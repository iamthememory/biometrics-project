#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""This module does stuff.
"""

from __future__ import (
    print_function,
)

import argparse
import base64
import json
import requests


def headers(
        apikey = 'key_f48f8e6901864de4af75a6f8ae0ed6e6',
        apitoken = 'tok_c86f43891f704b6a8ed57b412852015b',
    ):

    authtok = base64.b64encode('%s:%s' % (apikey, apitoken))

    headers = {
        'Authorization': 'Basic %s' % authtok,
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
    )

    return parser


def getusers():
    r = requests.get(
        'https://api.voiceit.io/users',
        headers=headers(),
    )

    return json.loads(r.text)['users']


def createuser():
    d = json.load(requests.post(
        'https://api.voiceit.io/users',
        headers=headers(),
    ).text)

    if d['responseCode'] != 'SUCC':
        raise ValueError('Failed to create user')

    print(d['message'])

    return d['userId']


def loaddata():
    try:
        return json.load(open('data.json', 'r'))
    except:
        return {}

def savedata(data):
    json.dump(data, open('data.json', 'w'))


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

        if data['users'].get(uname, None) is None:
            raise ValueError('Username already exists')

        newid = createuser()

        data['users'][uname] = newid

        print('Created user %s with ID %s' % (uname, newid))


if __name__ == '__main__':
    main()
