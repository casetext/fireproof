
'use strict';

var rmdir = require('rimraf'),
  gulp = require('gulp-help')(require('gulp')),
  rename = require('gulp-rename'),
  mocha = require('gulp-mocha'),
  concat = require('gulp-concat'),
  bump = require('gulp-bump'),
  wrap = require('gulp-wrap'),
  jsdoc2md = require('gulp-jsdoc-to-markdown'),
  version = require('./package.json').version;


gulp.task('clean', 'Remove all build files', function(done) {
  rmdir('./dist', done);
});


gulp.task('build', 'Builds the Javascript for distribution.', function() {

  return gulp.src(['index.js', 'lib/*.js'])
  .pipe(concat('fireproof.js'))
  .pipe(wrap({ src: 'umd.template' }, { version: version }))
  .pipe(gulp.dest('./dist'));

});


gulp.task('test:setup', 'Set up tests.', function() {

  if (!process.env.FIREBASE_ADMIN_TOKEN) {
    throw new Error('Please set FIREBASE_ADMIN_TOKEN to run the tests!');
  }

  var Firebase = require('firebase'),
    chai = require('chai');

  chai.use(require('chai-as-promised'));
  global.expect = require('chai').expect;

  return require('firebase-admin')
  .bootstrapInstance(process.env.FIREBASE_ADMIN_TOKEN)
  .delay(1000)
  .then(function(instance) {

    global.__bootstrappedFirebase = instance;
    console.log('Bootstrapped instance', instance.toString(), 'for tests');
    global.firebase = new Firebase(instance.toString());
    return instance.getAuthTokens();

  })
  .then(function(tokens) {
    global.firebaseAuthSecret = tokens[0];
  });

});

gulp.task('test', 'Runs tests and exits.', ['test:setup'], function(done) {

  var tearingDown = false;
  function teardown(e) {

    if (!tearingDown) {
      tearingDown = true;

      console.log('Tearing down Firebase', global.__bootstrappedFirebase.toString());
      return global.__bootstrappedFirebase.tearDown()
      .then(function() {
        console.log('Done!');
        process.exit(e ? 1 : 0);
      });
    }

  }

  gulp.src('./test/**/*.js', { read: false })
  .pipe(mocha())
  .on('error', teardown)
  .on('end', teardown);

});


gulp.task('publish:npm', 'Runs "npm publish".', function(done) {

  var spawn = require('child_process').spawn;

  spawn('npm', ['publish'], { stdio: 'inherit' })
  .on('error', done)
  .on('close', done);

});


gulp.task('bump:patch', 'Publishes a new bugfix version.', function() {

  return gulp.src('./package.json')
  .pipe(bump())
  .pipe(gulp.dest('./'));

});


gulp.task('bump:minor', 'Publishes a new bugfix version.', function() {

  return gulp.src('./package.json')
  .pipe(bump({ type: 'minor' }))
  .pipe(gulp.dest('./'));

});


gulp.task('bump:major', 'Publishes a new bugfix version.', function() {

  return gulp.src('./package.json')
  .pipe(bump({ type: 'major' }))
  .pipe(gulp.dest('./'));

});


gulp.task('docs', 'Generates a new version of the docs.', ['build'], function() {

  return gulp.src(['dist/fireproof.js'])
  .pipe(jsdoc2md())
  .pipe(rename(function(path) {
    path.basename = 'api';
    path.extname = '.md';
  }))
  .pipe(gulp.dest('./'));

});
