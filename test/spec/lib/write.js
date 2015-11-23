
'use strict';

describe('write operation', function() {

  var fireproof;

  function delay(ms) {
    return function(val) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve(val);
        }, ms);
      });
    };
  }

  beforeEach(function() {
    fireproof = new Fireproof(firebase);
  });

  describe('#set', function() {

    it('promises to set the object to the given value', function(done) {

      var didSet;
      fireproof.child('test')
      .set(true, function(err) {
        didSet = (err === null);
      })
      .then(delay(50))
      .then(function() {
        expect(didSet).to.equal(true);
        done();
      });

    });

  });

  describe('#update', function() {

    it('promises to update the object to the given value', function(done) {

      var didUpdate;
      expect(fireproof.child('thing')
      .update({ 'foo': 'bar' }, function(err) {
        didUpdate = (err === null);
      })
      .then(delay(50))
      .then(function() {
        expect(didUpdate).to.equal(true);
        done();
      }));

    });

  });

  describe('#remove', function() {

    it('promises to remove the object', function(done) {

      var didRemove;
      fireproof.remove(function(err) {
        didRemove = (err === null);
      })
      .then(delay(50))
      .then(function() {
        expect(didRemove).to.equal(true);
        done();
      })

    });

  });

  describe('#push', function() {

    it('returns a Fireproof that promises to add the new child', function(done) {

      var didPush;

      fireproof.child('list')
      .push({
        'foo': 'bar'
      }, function(err) {
        didPush = (err === null);
      })
      .then(delay(50))
      .then(function() {
        expect(didPush).to.equal(true);
        done();
      });

    });

  });

  describe('#setWithPriority', function() {

    it('promises to set the ref to the given value and priority', function(done) {

      var didSet;
      fireproof.child('test')
      .setWithPriority(true, 0, function(err) {
        didSet = (err === null);
      })
      .then(delay(50))
      .then(function() {
        expect(didSet).to.equal(true);
        done();
      });

    });

  });

  describe('#setPriority', function() {

    it('promises to set the ref to the given priority', function(done) {

      var didSet;

      fireproof.child('test')
      .setPriority(1, function(err) {
        didSet = (err === null);
      })
      .then(delay(50))
      .then(function() {
        expect(didSet).to.equal(true);
        done();
      });

    });

  });

});
