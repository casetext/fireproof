

'use strict';


var url = require('url');

describe('Stats', function() {

  var statsRef;

  beforeEach(function(done) {
    statsRef = new Fireproof(firebase).child('statsRef');
    setTimeout(done, 1); // This is necessary to allow all stats events from past tests to clear the event queue before starting the next test.  Works around strange timing issues on Windows.
  });

  describe('#reset', function() {

    it('resets all captured statistics to 0', function() {

      Fireproof.stats.reset();
      Fireproof.stats.resetListeners();
      expect(Object.keys(Fireproof.stats.operationLog).length).to.equal(0);
    });

  });

  describe('when Firebase operations happen', function() {

    var startFn, finishFn;

    it('emits "start" and "finish" events for them', function(done) {

      startFn = Fireproof.stats.on('start', function(event) {
        expect(event.type).to.equal('write');
      });

      finishFn = Fireproof.stats.on('finish', function(event) {

        expect(event.start).to.be.defined;
        expect(event.finish).to.be.defined;
        expect(event.type).to.equal('write');

        done();
      });

      statsRef.child('a').set(true);

    });

    after(function() {
      Fireproof.stats.off('start', startFn);
      Fireproof.stats.off('finish', finishFn);
      Fireproof.stats.reset();
      Fireproof.stats.resetListeners();
    });

  });

  describe('given a set of operations', function() {

    before(function() {

      this.timeout(5000);

      return Promise.all([
        statsRef.child('a').set(true),
        statsRef.child('b').set(true),
        statsRef.child('b2').remove(),
        statsRef.child('c').update({ foo: 'bar '}),
        statsRef.child('x').on('value', function() {}).then(function() {}),
        statsRef.child('y').on('value', function() {}).then(function() {}),
        statsRef.child('z').on('value', function() {}).then(function() {})
      ]);

    });

    after(function() {
      statsRef.child('a').off('value');
      statsRef.child('b').off('value');
      statsRef.child('c').off('value');
    });

    describe('#getCounts', function() {

      it('correctly tallies the number of those operations', function() {

        var stats = Fireproof.stats.getCounts();
        expect(stats).to.deep.equal({
          read: 3,
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
            '/statsRef/x': 1,
            '/statsRef/y': 1,
            '/statsRef/z': 1
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

    describe('#getListeners', function() {

      it('returns an object counting the current listeners by path', function() {

        var listeners = Fireproof.stats.getListeners();
        var correctedPathListeners = Object.keys(listeners)
        .reduce(function(acc, path) {

          acc[url.parse(path).pathname] = listeners[path];
          return acc;

        }, {});

        expect(correctedPathListeners).to.deep.equal({
          '/statsRef/x': 1,
          '/statsRef/y': 1,
          '/statsRef/z': 1
        });

      });

    });

    describe('#getListenerCount', function() {

      it('returns the total number of current listeners', function() {
        expect(Fireproof.stats.getListenerCount()).to.equal(3);
      });

    });

  });

});
