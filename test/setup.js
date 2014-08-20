
'use strict';

var FirebaseAccount = require('firebase-admin'),
  Firebase = require('firebase');

global.expect = require('chai').expect;

before(function(done) {

  this.timeout(10000);

  if (process.env.FIREBASE_TEST_URL && process.env.FIREBASE_TEST_SECRET) {

    console.log('using instance at', process.env.FIREBASE_TEST_URL);
    global.firebase = new Firebase(process.env.FIREBASE_TEST_URL);
    firebase.auth(process.env.FIREBASE_TEST_SECRET, done);

  } else {

    return require('firebase-admin').bootstrapInstance(
      process.env.FIREBASE_USER,
      process.env.FIREBASE_PASS
    ).then(function(instance) {
      global.__bootstrappedFirebase = instance;
      console.log('bootstrapped instance', instance.toString(), 'for tests');
      global.firebase = new Firebase(instance.toString());
    }).done(done);

  }

});

after(function() {

  this.timeout(10000);

  // tear down the Firebase, if we created it
  if (global.__bootstrappedFirebase) {
    return global.__bootstrappedFirebase.tearDown();
  }

});
