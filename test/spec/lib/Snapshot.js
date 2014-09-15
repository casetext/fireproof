
'use strict';

var Fireproof = require('../../../index'),
  Q = require('kew');

Fireproof.bless(Q);

// on Snapshot, only forEach and ref need to be tested, and just to make sure
// they hand back the correct kind of delegate object.

describe('FireproofSnapshot', function() {

  describe('#forEach', function() {

    var fireproof;

    before(function() {

      fireproof = new Fireproof(firebase);

      return fireproof.child('snapTest')
      .set({
        foo: 'bar',
        baz: 'quux',
        bells: 'whistles'
      });

    });

    it('iterates over the children of the snapshot', function() {

      return fireproof.child('snapTest')
      .then(function(snap) {

        snap.forEach(function(child) {
          expect(child.constructor.name).to.equal('FireproofSnapshot');
          expect(child.name()).to.match(/^(foo|baz|bells)$/);
          expect(child.val()).to.match(/^(bar|quux|whistles)$/);
        });

      });

    });

  });

  describe('#ref', function() {

    var fireproof;

    before(function() {

      fireproof = new Fireproof(firebase);

      return fireproof.child('snapTest')
      .set({
        foo: 'bar',
        baz: 'quux',
        bells: 'whistles'
      });

    });

    it('returns the Fireproof reference associated with the snap', function() {

      return fireproof.child('snapTest')
      .then(function(snap) {
        expect(snap.ref().constructor.name).to.equal('Fireproof');
        expect(snap.ref().transaction).to.be.a('function');
      });

    });

  });

});
