#!/usr/bin/env node

var program = require('commander')
var voiceit = require('VoiceIt')
var prompt = require('prompt')

program
  .version('0.0.1')
  .option('-e, --enroll <userid>', 'Enroll user')
  .option('-a, --authenticate <userid>', 'Authenticate user')
  .parse(process.argv);

voiceit.initialize('e99d90d2807044a9b0eb08c53422ebfd')

//------------------------Program-------------------------------

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
  prompt.get(['password'], function (err, result) {
    console.log('Got password: ', result.password);
    func(result.password);
  });
}


init();

//------------------------Custom Functions-----------------------

function init(){
  if (program.enroll) {
    // node index.js -e <userid>
    createEnrollment()
  }
  else if (program.authenticate) {
    //  authenticate
  }
  else if (program.delete){
    //delete
  }
  else if (program.getUser){
    //get User
  }
  else if (program.getEnrollment){

  }
  else if (program.getEntrollments){

  }
  else if (program.deleteEnrol){

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
      console.log("Deleted enrollment: ", response);
    }
  });
}


function getEntrollments(userid, password) {
  myVoiceIt.getEnrollments({
    userId: userid,
    password: password,
    callback: function(response) {
      //ADD CUSTOM CODE HERE TO USE
      //DATA RECEIVED IN THE response VARIABLE
      console.log("The Server Responded with the JSON: ",response);
    }
  });

}

//-----------------------Authentication rest api calls---------------------
function authentication(userid, password) {
  myVoiceIt.authentication({
    userId: userid,
    password: password,
    pathToAuthenticationWav: '/home/users/username/voicePrint.wav',
    contentLanguage: 'en-US',
    callback: function(response){
      console.log("The Response Was ",response);
    }
  });
}

function authenticationByWavURL(userid, password) {
  myVoiceIt.authenticationByWavURL({
    userId: userid,
    password: password,
    urlToAuthenticationWav: 'https://voiceit.tech/voicePrint.wav',
    contentLanguage: 'en-US',
    callback: function(response) {
      console.log("The Response Was ", response);
    }
  });
}
