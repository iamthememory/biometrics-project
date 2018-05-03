#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""This module does stuff.
"""

from __future__ import (
    print_function,
)

import argparse
import base64
import contextlib
import json
import random
import requests
import speech_recognition as sr
import tempfile
import os
import sys


phrases = [
    'Remember to wash your hands before eating',
]


@contextlib.contextmanager
def silence_err():
    devnull = os.open(os.devnull, os.O_WRONLY)
    savederr = os.dup(2)
    sys.stderr.flush()
    os.dup2(devnull, 2)
    os.close(devnull)

    yield

    os.dup2(savederr, 2)
    os.close(savederr)


def headers(
        apikey = 'key_f48f8e6901864de4af75a6f8ae0ed6e6',
        apitoken = 'tok_c86f43891f704b6a8ed57b412852015b',
    ):

    authtok = base64.b64encode(('%s:%s' % (apikey, apitoken)).encode())

    headers = {
        'Authorization': 'Basic %s' % authtok.decode(),
    }

    return headers


def make_argparser():
    parser = argparse.ArgumentParser(
        add_help=True,
        description='Do biometrics things',
    )

    parser.add_argument(
        '-c',
        '--create-user',
        type=str,
        metavar='USER',
        help='Create a new user',
    )

    parser.add_argument(
        '-e',
        '--enroll-user',
        type=str,
        metavar='USER',
        help="Enroll the user's face and voice",
    )

    parser.add_argument(
        '-V',
        '--verify-user',
        type=str,
        metavar='USER',
        help="Verify the user's face and voice",
    )

    # I don't have a working webcam on my laptop at the moment, so let's just
    # accept a file.
    parser.add_argument(
        '-f',
        '--video-file',
        type=argparse.FileType('rb'),
        metavar='VIDEO',
        help="A <5 second mp4 video of the user's face",
    )

    return parser


def getusers():
    r = requests.get(
        'https://api.voiceit.io/users',
        headers=headers(),
    )

    return json.loads(r.text)['users']


def createuser():
    d = requests.post(
        'https://api.voiceit.io/users',
        headers=headers(),
    ).json()

    if d['responseCode'] != 'SUCC':
        raise ValueError('Failed to create user')

    return d['userId']


def loaddata():
    try:
        return json.load(open('data.json', 'r'))
    except:
        return {}

def savedata(data):
    json.dump(data, open('data.json', 'w'))


def verifyface(
        userid,
        video,
    ):

    r = requests.post(
        'https://api.voiceit.io/verification/face',
        headers=headers(),
        data={
            'userId': userid,
            'doBlinkDetection': True,
        },
        files={
            'video': video,
        }
    ).json()

    success = r['responseCode'] == 'SUCC'

    print(' - Blinks: %s' % r['blinksCount'])

    if success:
        print('Verified face with confidence', r['faceConfidence'])
    else:
        print('Failed face with confidence', r['faceConfidence'])

    return success


def verifyvoice(
        userid,
        recording,
    ):

    r = requests.post(
        'https://api.voiceit.io/verification',
        headers=headers(),
        data={
            'userId': userid,
            'contentLanguage': 'en-US',
        },
        files={
            'recording': recording,
        }
    ).json()

    success = r['responseCode'] == 'SUCC'

    if success:
        print('Verified voice with confidence', r['confidence'])
    else:
        print('Failed voice with confidence', r['confidence'])

    return success


def enrollface(
        userid,
        video,
    ):

    r = requests.post(
        'https://api.voiceit.io/enrollments/face',
        headers=headers(),
        data={
            'userId': userid,
            'doBlinkDetection': True,
        },
        files={
            'video': video,
        },
    ).json()

    if r['responseCode'] != 'SUCC':
        print(r)
        raise ValueError('Failed to enroll user: %s' % r['message'])
    else:
        print('Successfully enrolled face!')
        print(' - Blinks: "%s"' % r['blinksCount'])


def enrollvoice(
        userid,
        recording,
    ):

    r = requests.post(
        'https://api.voiceit.io/enrollments',
        headers=headers(),
        data={
            'userId': userid,
            'contentLanguage': 'en-US',
        },
        files={
            'recording': recording,
        },
    ).json()

    if r['responseCode'] != 'SUCC':
        print(r)
        raise ValueError('Failed to enroll user: %s' % r['message'])
    else:
        print('Successfully enrolled voice!')
        print(' - Text: "%s"' % r['text'])
        print(' - Confidence: "%s"' % r['textConfidence'])


def recordphrase(f, phrase):
    print('Say "%s"' % phrase)

    r = sr.Recognizer()

    with silence_err():
        with sr.Microphone() as source:
            audio = r.listen(source)

    try:
        print()
        print(' - Heard:', r.recognize_sphinx(audio))
        print()
    except:
        pass

    f.write(audio.get_wav_data())
    f.seek(0)

def enrollphrase(uid, phrase):
    with tempfile.NamedTemporaryFile(mode='w+b') as f:
        recordphrase(f, phrase)
        enrollvoice(uid, f)


def main():
    """Do stuff.
    """

    # Load our junky database.
    data = loaddata()

    if data.get('users', None) is None:
        data['users'] = {}

    # Parse arguments.
    args = make_argparser().parse_args()

    # First, create users.
    if args.create_user:
        uname = args.create_user

        if data['users'].get(uname, None) is not None:
            raise ValueError('Username already exists')

        newid = createuser()

        data['users'][uname] = newid

        print('Created user %s with ID %s' % (uname, newid))

    if args.enroll_user:

        if not args.video_file:
            sys.exit('No video file specified')

        uname = args.enroll_user
        uid = data['users'].get(uname, None)

        if uid is None:
            raise ValueError('No such username')

        # Enroll voice.
        for phrase in phrases:
            for x in range(3):
                enrollphrase(uid, phrase)

        # Enroll face.
        enrollface(uid, args.video_file)
        args.video_file.seek(0)

    if args.verify_user:

        if not args.video_file:
            sys.exit('No video file specified')

        uname = args.verify_user
        uid = data['users'].get(uname, None)

        if uid is None:
            raise ValueError('No such username')

        # Verify voice.
        with tempfile.NamedTemporaryFile(mode='w+b') as f:
            recordphrase(f, phrases[0])

            if not verifyvoice(uid, f):
                sys.exit('Failed to verify user!')

        # Verify face.
        if not verifyface(uid, args.video_file):
            sys.exit('Failed to verify user!')

    savedata(data)


if __name__ == '__main__':
    main()
