#!/usr/bin/env node

var program = require('commander');
var voiceit = require('VoiceIt');
var prompt = require('prompt');
var fs = require('fs');
var record = require('node-record-lpcm16');
var tmp = require('tmp');
var path = require('path');
var play = require('audio-play');
var load = require('audio-loader');
var crypto = require('crypto');

program
  .version('0.0.1')
  .option('-e, --enroll <userid>', 'Enroll user')
  .option('-a, --authenticate <userid>', 'Authenticate user')
  .parse(process.argv);

voiceit.initialize('e99d90d2807044a9b0eb08c53422ebfd')

var tmpdir = tmp.dirSync({prefix: 'biomet-'});

//------------------------Program-------------------------------

function record_audio(msg, fname, func) {
  console.log(msg);

  var file = fs.createWriteStream(fname, {encoding: 'binary'});

  record.start({
    sampleRate: 44100,
    verbose: true
  }).pipe(file);

  file.on('finish', func);
}

function record_phrase(func) {
  var phrase = 'Never forget tomorrow is a new day';
  var msg = 'Say "' + phrase + '"';

  var fname = tmp.tmpNameSync({
    template: path.join(tmpdir.name, 'XXXXXXX.wav')
  });

  record_audio(msg, fname, func.bind({fname: fname}));
}

function playfile(fname) {
  if (typeof(fname) === 'undefined') {
    fname = this.fname;
  }

  console.log("Playing ", fname);
  load(fname).then(play);
}

function getpassword(func) {
  //get user password
  var schema = {
    properties: {
      password: {
        hidden: true,
        description: 'Enter your password',
        replace: '*'
      }
    }
  };

  prompt.start()
  prompt.get(schema, function (err, result) {
    var hash = crypto.createHash('sha256');
    hash.update(result.password);
    var passhash = hash.digest('hex');
    func(result.password, passhash);
  });
}

record_phrase(playfile);

init();

//------------------------Custom Functions-----------------------

function init(){
  if (program.enroll !== undefined) {
    // node index.js -e <userid>
    createEnrollment(program.enroll)
  }
  else if (program.authenticate) {
    //  authenticate
  }
  else if (program.delete) {
    //delete
  }
  else if (program.getUser) {
    //get User
  }
  else if (program.getEnrollment) {

  }
  else if (program.getEnrollments) {

  }
  else if (program.deleteEnroll) {

  }
  else {
      // inform options
  }
}


//------------------------Voiceit functions----------------------
function createUser(userid, password) {
  myVoiceIt.createUser({
    userId: userid,
    password: password,
    callback: function(response) {
      // FIXME: Add stuff
      console.log("Created user: ", response);
    }
  });
}

function removeUser(userid, password) {
  myVoiceIt.deleteUser({
    userId: userid,
    password: password,
    callback: function(response) {
      // FIXME: Add stuff
      console.log("Deleted user: ", response);
    }
  });
}

function getUser(userid, password) {
  myVoiceIt.getUser({
    userId: userid,
    password: password,
    callback: function(response) {
      // FIXME: Add stuff
      console.log("Got user: ", response);
    }
  });
}

function createEnrollment(userid, password, wavpath) {
  myVoiceIt.createEnrollment({
    userId: userid,
    password: password,
    pathToEnrollmentWav: wavpath,
    contentLanguage: 'en-US',
    callback: function(response) {
      // FIXME: Add stuff
      console.log("Created enrollment ", response);
    }
  });

}

function createEnrollmentByWavURL(userid, password, wavurl) {
  myVoiceIt.createEnrollmentByWavURL({
    userId: userid,
    password: password,
    urlToEnrollmentWav: wavurl,
    contentLanguage: 'en-US',
    callback: function(response) {
      // FIXME: Add stuff
      console.log("Created enrollment ", response);
    }
  });
}

function deleteEnrollment(userid, password, enrollmentid) {
  myVoiceIt.deleteEnrollment({
    userId: userid,
    password: password,
    enrollmentId: enrollmentid,
    callback: function(response){
      // FIXME: Add stuff
      console.log("Deleted enrollment: ", response);
    }
  });
}


function getEnrollments(userid, password) {
  myVoiceIt.getEnrollments({
    userId: userid,
    password: password,
    callback: function(response) {
      // FIXME: Add stuff
      console.log("Got enrollments: ",response);
    }
  });

}

//-----------------------Authentication rest api calls---------------------
function authentication(userid, password, wavpath) {
  myVoiceIt.authentication({
    userId: userid,
    password: password,
    pathToAuthenticationWav: wavpath,
    contentLanguage: 'en-US',
    callback: function(response) {
      console.log("Authentication result: ", response);
    }
  });
}

function authenticationByWavURL(userid, password, wavurl) {
  myVoiceIt.authenticationByWavURL({
    userId: userid,
    password: password,
    urlToAuthenticationWav: wavurl,
    contentLanguage: 'en-US',
    callback: function(response) {
      console.log("Authentication result: ", response);
    }
  });
}
