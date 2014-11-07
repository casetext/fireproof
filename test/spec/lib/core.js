
'use strict';

describe('Fireproof', function() {

  var fireproof;

  beforeEach(function() {
    fireproof = new Fireproof(root);
  });


  describe('#then', function() {

    before(function() {
      fireproof = new Fireproof(root);
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


  describe('#toFirebase', function() {

    it('hands back the original Firebase reference', function() {
      expect(fireproof.toFirebase().constructor.name).to.equal('M');
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

  describe('#key', function() {

    it('returns null for a top-level reference', function() {
      expect(fireproof.key()).to.equal(null);
    });

    it('returns the last part of the name of a reference', function() {
      expect(fireproof.child('foo').child('bar').key())
      .to.equal('bar');
    });

  });

});
