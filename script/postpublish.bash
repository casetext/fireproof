#!/usr/bin/env bash

git checkout gh-pages
git merge master
./node_modules/.bin/jsdoc -t ./node_modules/ink-docstrap/template -d . -c .jsdocrc *.js README.md
git add *.html styles scripts img
git commit -am 'Update docs'
git push hub gh-pages
git checkout @{-1}
