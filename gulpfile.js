
'use strict';

var rmdir = require('rimraf'),
  gulp = require('gulp-help')(require('gulp')),
  rename = require('gulp-rename'),
  mocha = require('gulp-mocha'),
  concat = require('gulp-concat'),
  bump = require('gulp-bump'),
  wrap = require('gulp-wrap'),
  jsdoc2md = require('gulp-jsdoc-to-markdown'),
  filter = require('gulp-filter'),
  git = require('gulp-git'),
  tagVersion = require('gulp-tag-version'),
  version = require('./package.json').version;


function npmPublish(done) {

  var spawn = require('child_process').spawn;

  spawn('npm', ['publish'], { stdio: 'inherit' })
  .on('error', done)
  .on('close', done);

}

function inc(importance, done) {

  return gulp.src(['./package.json'])
  .pipe(bump({type: importance}))
  .pipe(gulp.dest('./'))
  .pipe(git.commit('new release'))
  .pipe(filter('package.json'))
  .pipe(tagVersion())
  .on('end', function() {

    git.push('origin', 'master', function(err) {
      if (err) {
        throw err;
      }
      npmPublish(done);
    });

  });

}


gulp.task('clean', 'Remove all build files', function(done) {
  rmdir('./dist', done);
});


gulp.task('build', 'Builds the Javascript for distribution.', ['clean'], function() {

  return gulp.src(['index.js', 'lib/*.js'])
  .pipe(concat('fireproof.js'))
  .pipe(wrap({ src: 'umd.template' }, { version: version }))
  .pipe(gulp.dest('./dist'));

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


gulp.task('test:setup', 'Set up tests.', ['build'], function() {

  if (!process.env.FIREBASE_ADMIN_TOKEN) {
    throw new Error('Please set FIREBASE_ADMIN_TOKEN to run the tests!');
  }

  var Firebase = require('firebase'),
    chai = require('chai');

  chai.use(require('chai-as-promised'));
  global.expect = require('chai').expect;

  return require('firebase-admin')
  .bootstrapInstance(process.env.FIREBASE_ADMIN_TOKEN)
  .delay(3000)
  .then(function(instance) {
    global.__bootstrappedFirebase = instance;
    console.log('Bootstrapped instance', instance.toString(), 'for tests');
    global.firebase = new Firebase(instance.toString());
    return instance.getAuthTokens();

  })
  .then(function(tokens) {

    global.firebaseAuthSecret = tokens[0];

    // set up test environment.
    global.Fireproof = require('./dist/fireproof');
    global.Fireproof.bless(require('kew'));
    global.Firebase = require('firebase');

  });

});

gulp.task('test', 'Runs tests and exits.', ['test:setup'], function() {

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

  return gulp.src('./test/**/*.js', { read: false })
  .pipe(mocha())
  .on('error', teardown)
  .on('end', teardown);

});

var bumpDeps = ['test'];

gulp.task('bump', 'Publishes a new bugfix version.', bumpDeps, function(done) {
  inc('patch', done);
});


gulp.task('bump:minor', 'Publishes a new minor version.', bumpDeps, function(done) {
  inc('minor', done);
});


gulp.task('bump:major', 'Publishes a new major version.', bumpDeps, function(done) {
  inc('major', done);
});

