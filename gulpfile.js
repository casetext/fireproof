
'use strict';

var rmdir = require('rimraf'),
  gulp = require('gulp-help')(require('gulp')),
  rename = require('gulp-rename'),
  mocha = require('gulp-mocha'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  bump = require('gulp-bump'),
  wrap = require('gulp-wrap'),
  jsdoc2md = require('gulp-jsdoc-to-markdown'),
  filter = require('gulp-filter'),
  git = require('gulp-git'),
  tagVersion = require('gulp-tag-version'),
  pkg = require('./package.json');


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
        done(err);
      } else {
        npmPublish(done);
      }

    });

  });

}


gulp.task('clean', 'Remove all build files', function(done) {
  rmdir('./dist', done);
});


gulp.task('build', 'Builds the Javascript for distribution.', ['clean'], function() {

  return gulp.src(['index.js', 'lib/*.js'])
  .pipe(concat('fireproof.js'))
  .pipe(wrap({ src: 'umd.template' }, { pkg: pkg, year: new Date().getFullYear() }))
  .pipe(gulp.dest('./dist'))
  .pipe(rename('fireproof.min.js'))
  .pipe(uglify({preserveComments: 'some'}))
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

  var Firebase = require('firebase'),
    chai = require('chai');

  chai.use(require('chai-as-promised'));
  global.expect = require('chai').expect;

  global.Firebase = Firebase;
  global.Fireproof = require('./dist/fireproof');
  global.Fireproof.bless(require('kew'));

  if (!process.env.FIREBASE_TEST_URL) {
    throw new Error('You must set FIREBASE_TEST_URL and FIREBASE_TEST_SECRET in your environment to run the tests.');
  }

  global.firebase = new Firebase(process.env.FIREBASE_TEST_URL);

});

gulp.task('test', 'Runs tests and exits.', ['test:setup'], function(done) {

  var src;
  if (process.env.ONLY) {
    src = './test/spec/' + process.env.ONLY + '.js';
  } else {
    src = './test/spec/**/*.js';
  }

  gulp.src(src, { read: false })
  .pipe(mocha({ timeout: 5000 }))
  .once('error', function(e) {
    done(e);
    process.exit(1);
  })
  .once('end', function() {
    done();
    process.exit(0);
  });

});

gulp.task('bump', 'Publishes a new bugfix version.', ['build'], function(done) {
  inc('patch', done);
});


gulp.task('bump:minor', 'Publishes a new minor version.', ['build'], function(done) {
  inc('minor', done);
});


gulp.task('bump:major', 'Publishes a new major version.', ['build'], function(done) {
  inc('major', done);
});

