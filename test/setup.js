
'use strict';

var Firebase = require('firebase'),
  chai = require('chai');

chai.use(require('chai-as-promised'));
global.expect = require('chai').expect;

before(function(done) {

  this.timeout(10000);

  if (process.env.FIREBASE_TEST_URL && process.env.FIREBASE_TEST_SECRET) {

    console.log('using instance at', process.env.FIREBASE_TEST_URL);
    global.firebase = new Firebase(process.env.FIREBASE_TEST_URL);
    global.firebaseAuthSecret = process.env.FIREBASE_TEST_SECRET;
    done();

  } else if (process.env.FIREBASE_ADMIN_TOKEN) {

    require('firebase-admin')
    .bootstrapInstance(process.env.FIREBASE_ADMIN_TOKEN)
    .delay(1000)
    .then(function(instance) {

      global.__bootstrappedFirebase = instance;
      console.log('bootstrapped instance', instance.toString(), 'for tests');
      global.firebase = new Firebase(instance.toString());
      global.firebaseUrl = instance.toString();
      return instance.getAuthTokens();

    })
    .then(function(tokens) {
      global.firebaseAuthSecret = tokens[0];
    }).done(done);

  } else {
    throw new Error('no way to run tests');
  }

});

after(function() {

  this.timeout(10000);

  // tear down the Firebase, if we created it
  if (global.__bootstrappedFirebase) {
    console.log('Tearing down Firebase', global.__bootstrappedFirebase.toString());
    return global.__bootstrappedFirebase.tearDown()
    .then(function() {
      console.log('Done!');
    });
  }

});
