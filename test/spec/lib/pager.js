
'use strict';

describe('Pager', function() {

  var root, pager;

  before(function() {

    root = new Fireproof(firebase);

    var children = {};
    for (var i = 0; i < 20; i++) {

      var key = Math.random().toString(36).slice(2);
      children[key] = {
        '.priority': i,
        '.value': key
      };

    }

    return root.child('pagertest')
    .set(children);

  });

  beforeEach(function() {
    pager = new Fireproof.Pager(root.child('pagertest'));
  });


  describe('#next', function() {

    it('gets the next set of children from the reference', function() {

      var seenValues = {};

      return pager.next(10)
      .then(function(children) {

        var prevPriority;
        expect(children.length).to.equal(10);
        children.forEach(function(child) {

          if (prevPriority) {
            expect(child.getPriority()).to.be.gte(prevPriority);
          }

          expect(seenValues).not.to.contain.key(child.val());
          seenValues[child.val()] = true;

          prevPriority = child.getPriority();

        });

        return pager.next(10);

      })
      .then(function(children) {

        var prevPriority;
        expect(children.length).to.equal(10);
        children.forEach(function(child) {

          if (prevPriority) {
            expect(child.getPriority()).to.be.gte(prevPriority);
          }

          expect(seenValues).not.to.contain.key(child.val());
          seenValues[child.val()] = true;

          prevPriority = child.getPriority();

        });

      });

    });

  });


  describe('#previous', function() {

    it('gets the last set of children from the reference', function() {

      return pager.next(8)
      .then(function() {
        return pager.previous(4);
      })
      .then(function(results) {

        var i = 3;
        expect(results.length).to.equal(4);
        results.forEach(function(result) {

          expect(result.getPriority()).to.equal(i);
          i++;

        });

      });

    });

  });


  describe('#setPosition', function() {

    it('sets the cursor position of the pager', function() {

      return pager.next(8)
      .then(function(snaps) {
        var snap = snaps[2];
        pager.setPosition(snap.getPriority(), snap.name());
        return pager.previous(1);
      })
      .then(function(results) {

        expect(results.length).to.equal(1);
        expect(results[0].getPriority()).to.equal(1);

      });

    });

  });


});
