

'use strict';


var Fireproof = require('../../../index'),
  Q = require('kew'),
  url = require('url');

Fireproof.bless(Q);

describe('Stats', function() {

  var statsRef;

  beforeEach(function() {
    statsRef = new Fireproof(firebase).child('statsRef');
  });

  describe('#reset', function() {

    it('resets all captured statistics to 0', function() {

      Fireproof.stats.reset();
      expect(Fireproof.stats.events.read.length).to.equal(0);
      expect(Fireproof.stats.events.write.length).to.equal(0);
      expect(Fireproof.stats.events.update.length).to.equal(0);

    });

  });

  describe('given a set of operations', function() {

    before(function() {

      return Q.all([
        statsRef.child('a').set(true),
        statsRef.child('b').set(true),
        statsRef.child('b2').remove(),
        statsRef.child('c').update({ foo: 'bar '})
      ])
      .then(function() {
        return statsRef.child('a').once('value', function() {});
      });

    });

    describe('#getCounts', function() {

      it('correctly tallies the number of those operations', function() {

        var stats = Fireproof.stats.getCounts();
        expect(stats).to.deep.equal({
          read: 1,
          write: 3,
          update: 1
        });

      });

    });

    describe('#getPathCounts', function() {

      it('correctly tallies the number of operations per path', function() {

        var pathStats = Fireproof.stats.getPathCounts();
        var correctedPathStats = Object.keys(pathStats)
        .reduce(function(acc, kind) {

          acc[kind] = Object.keys(pathStats[kind])
          .reduce(function(kindAccumulator, path) {

            kindAccumulator[url.parse(path).pathname] = pathStats[kind][path];
            return kindAccumulator;

          }, {});
          return acc;

        }, {});

        expect(correctedPathStats).to.deep.equal({

          read: {
            '/statsRef/a': 1
          },
          write: {
            '/statsRef/a': 1,
            '/statsRef/b': 1,
            '/statsRef/b2': 1,
          },
          update: {
            '/statsRef/c': 1
          }

        });

      });

    });

  });

});
