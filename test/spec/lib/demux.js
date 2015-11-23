
'use strict';

describe('Demux', function() {

  var fireproof = new Fireproof(firebase);

  before(function() {

    return fireproof.child('demuxtest')
    .set({

      list1: {
        a: {
          '.value': 2,
          '.priority': -10000
        },
        b: {
          '.value': 4,
          '.priority': -10000 + 1
        },
        c: {
          '.value': 6,
          '.priority': -10000 + 3
        },
        d: {
          '.value': 5,
          '.priority': -10000 + 2
        }
      },
      list2: {
        a: {
          '.value': 3,
          '.priority': -10000 + 1
        },
        b: {
          '.value': 7,
          '.priority': -10000 + 4
        },
        c: {
          '.value': 8,
          '.priority': -10000 + 4
        },
        d: {
          '.value': 11,
          '.priority': 'brown'
        }
      },
      list3: {
        a: {
          '.value': 0,
          '.priority': null
        },
        b: {
          '.value': 1,
          '.priority': null
        },
        c: {
          '.value': 10,
          '.priority': 'brown',
        },
        d: {
          '.value': 9,
          '.priority': 'apple'
        }
      }

    });

  });

  describe('#get', function() {

    it('gets children from multiple keys in sorted priority order', function() {

      var demuxRoot = fireproof.child('demuxtest');

      var demux = new Fireproof.Demux([
        demuxRoot.child('list1'),
        demuxRoot.child('list2'),
        demuxRoot.child('list3')
      ]);

      return demux.get(12)
      .then(function(snaps) {

        snaps.forEach(function(snap, i) {
          expect(snap.val()).to.equal(i);
        });

      });

    });

    it('handles multiple calls in the right order', function() {

      var demuxRoot = fireproof.child('demuxtest');

      var demux = new Fireproof.Demux([
        demuxRoot.child('list1'),
        demuxRoot.child('list2'),
        demuxRoot.child('list3')
      ]);

      var firstDone = false;

      return Promise.all([

        demux.get(4)
        .then(function(snaps) {

          snaps.forEach(function(snap, i) {
            expect(snap.val()).to.equal(i);
          });
          firstDone = true;

        }),

        demux.get(4)
        .then(function(snaps) {

          expect(firstDone).to.be.true;

          snaps.forEach(function(snap, i) {
            expect(snap.val()).to.equal(i+4);
          });

        })

      ]);


    });

  });

});
