
'use strict';

var Fireproof = require('../../index');

describe('Fireproof', function() {

  var fireproof;

  beforeEach(function() {
    fireproof = new Fireproof(firebase);
  });

  describe('#auth', function() {

    it('promises to call Firebase#auth', function() {

      expect(fireproof.auth('foo')).to.be.a('function');

    });

    it('resolves on successful Firebase#auth', function() {

      return expect(fireproof.auth(firebaseAuthSecret)).to.be.fulfilled;

    });

    it('rejects with error on unsuccessful Firebase#auth', function() {

      return expect(fireproof.auth('invalid')).to.be.rejected;

    });

  });

  // #unauth is untestable -- it just calls out to Firebase

  describe('#then', function() {

    before(function() {
      return fireproof.child('thentest').set(true);
    });

    it('hands back a snapshot of the ref by default', function(done) {
      fireproof.child('thentest').then(function(snap) {
        console.log('got the result!');
        expect(snap.val()).to.equal(true);
        done();
      }, function() {
        console.log('got an error!');
        done();
      });
    });

  });

  describe('#child', function() {

    it('returns a Fireproof to the named child of the parent', function() {
      expect(fireproof.child('foo')).to.be.an.instanceof(Fireproof);
      expect(fireproof.child('foo').toString()).to.match(/foo$/);
    });

  });

  describe('#parent', function() {

    it('returns null for a top-level reference', function() {
      expect(fireproof.parent()).to.equal(null);
    });

    it('returns a Fireproof to the parent of the ref', function() {
      expect(fireproof.child('foo').parent().toString())
      .to.equal(fireproof.toString());
    });

  });

  describe('#root', function() {

    it('returns a reference to the root of the associated Firebase', function() {
      expect(fireproof.child('foo').child('bar').root().toString())
      .to.equal(fireproof.toString());
    });

  });

  describe('#name', function() {

    it('returns null for a top-level reference', function() {
      expect(fireproof.name()).to.equal(null);
    });

    it('returns the last part of the name of a reference', function() {
      expect(fireproof.child('foo').child('bar').name())
      .to.equal('bar');
    });

  });

  // toString is untestable, as above

  describe('#set', function() {

    it('promises to set the object to the given value', function() {

      var didSet;
      return expect(fireproof.child('test').set(true, function(err) {
        didSet = (err === null);
      })
      .then(function() {
        expect(didSet).to.equal(true);
      })).to.be.fulfilled;

    });

  });

  describe('#update', function() {

    it('promises to update the object to the given value', function() {

      var didUpdate;
      return expect(fireproof.child('thing').update({ 'foo': 'bar' }, function(err) {
        console.log('update!!!');
        didUpdate = (err === null);
      })
      .then(function() {
        expect(didUpdate).to.equal(true);
      })).to.be.fulfilled;

    });

  });

  describe('#remove', function() {

    it('promises to remove the object', function() {

      var didRemove;
      return expect(fireproof.remove(function(err) {
        didRemove = (err === null);
      })
      .then(function() {
        expect(didRemove).to.equal(true);
      })).to.be.fulfilled;

    });

  });

  describe('#push', function() {

    it('returns a Fireproof that promises to add the new child', function() {

      var didPush;
      var newProof = fireproof.child('list').push({
        'foo': 'bar'
      }, function(err) {
        didPush = (err === null);
      });

      expect(newProof.constructor.name).to.equal('Fireproof');

      return expect(newProof.then(function() {
        expect(didPush).to.equal(true);
      })).to.be.fulfilled;

    });

  });

  describe('#setWithPriority', function() {

    it('promises to set the ref to the given value and priority', function() {

      var didSet;
      return expect(fireproof.child('test').setWithPriority(true, 0, function(err) {
        didSet = (err === null);
      })
      .then(function() {
        expect(didSet).to.equal(true);
      })).to.be.fulfilled;

    });

  });

  describe('#setPriority', function() {

    it('promises to set the ref to the given priority', function() {

      var didSet;

      return expect(fireproof.child('test').setPriority(1, function(err) {
        didSet = (err === null);
      })
      .then(function() {
        expect(didSet).to.equal(true);
      })).to.be.fulfilled;

    });

  });

  describe('#transaction', function() {

    it('promises to run the transaction', function() {



    });

  });

  describe('#on', function() {

    before(function() {

      return fireproof.child('onTest/foo')
      .setWithPriority('bar', 3)
      .then(function() {
        return fireproof.child('onTest/baz')
        .setWithPriority('quux', 5);
      });

    });

    it('promises to attach a listener to events on the ref', function() {

      var seenCount = 0;
      return expect(
        fireproof.child('onTest')
        .on('child_added', function() {
          seenCount++;
        })
        .then(function() {
          expect(seenCount).not.to.equal(0);
        })
      ).to.be.fulfilled;

    });

    it('rejects if access is denied to the given ref', function() {



    });

  });

  // # off is untestable, as above

  describe('#once', function() {

    before(function() {

      return fireproof.child('onceTest/foo')
      .setWithPriority('bar', 3)
      .then(function() {
        return fireproof.child('onceTest/baz')
        .setWithPriority('quux', 5);
      });

    });

    it('promises to listen for exactly one event of the given type', function() {

      var name, value;
      return expect(
        fireproof.child('onceTest').once('child_added', function(snap) {
          name = snap.name();
          value = snap.val();
        })
        .then(function(snap) {
          return {
            name: snap.name(),
            value: snap.val()
          };
        })
      )
      .to.eventually.deep.equal({
        name: 'foo',
        value: 'bar'
      });

    });

  });

  // #limit is untestable, as above

  // #startAt is untestable, as above

  // #endAt is untestable, as above

  // #equalTo is untestable, as above

  // #ref is untestable, as above

});
