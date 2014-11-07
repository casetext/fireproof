
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

  var Firebase = require('firebase'),
    chai = require('chai');

  chai.use(require('chai-as-promised'));
  global.expect = require('chai').expect;

  global.root = new Firebase('https://' + Math.random().toString(36).slice(2) + '.firebaseio-demo.com');

  console.log('Using Firebase', global.root.toString(), 'for tests');
  global.Fireproof = require('./dist/fireproof');
  global.Fireproof.bless(require('kew'));
  global.Firebase = require('firebase');

});

gulp.task('test', 'Runs tests and exits.', ['test:setup'], function() {

  return gulp.src('./test/**/*.js', { read: false })
  .pipe(mocha())
  .on('error', function() {
     process.exit(1);
  })
  .on('end', function() {
     process.exit(0);
  });

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

