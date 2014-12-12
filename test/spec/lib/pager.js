
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
    pager = new Fireproof.Pager(root.child('pagertest'), 10);
  });


  describe('#next', function() {

    it('gets the next set of children from the reference', function() {

      var seenValues = {},
        prevPriority;

      return pager.then(function(children) {

        expect(pager.hasPrevious).to.be.true;
        expect(pager.hasNext).to.be.true;
        expect(children.length).to.equal(10);
        children.forEach(function(child) {

          if (prevPriority) {
            expect(child.getPriority()).to.be.gte(prevPriority);
          }

          expect(seenValues).not.to.contain.key(child.val());
          seenValues[child.val()] = true;

          prevPriority = child.getPriority();

        });

        return pager.next(4);

      })
      .then(function(children) {

        expect(children.length).to.equal(4);
        expect(pager.hasPrevious).to.be.true;
        expect(pager.hasNext).to.be.true;

        children.forEach(function(child) {

          expect(child.getPriority()).to.be.gte(prevPriority);
          expect(seenValues).not.to.contain.key(child.val());
          seenValues[child.val()] = true;

          prevPriority = child.getPriority();

        });

        return pager.next(20);

      })
      .then(function(children) {

        expect(children.length).to.equal(6);
        expect(pager.hasPrevious).to.be.true;
        expect(pager.hasNext).to.be.false;

        children.forEach(function(child) {

          expect(child.getPriority()).to.be.gte(prevPriority);
          expect(seenValues).not.to.contain.key(child.val());
          seenValues[child.val()] = true;

          prevPriority = child.getPriority();

        });

      });

    });

  });


  describe('#previous', function() {

    it('gets the last set of children from the reference', function() {

      var i;
      return pager.then(function() {
        return pager.next(4);
      })
      .then(function() {
        return pager.previous(6);
      })
      .then(function(results) {

        expect(pager.hasPrevious).to.be.true;
        expect(pager.hasNext).to.be.true;
        expect(results.length).to.equal(6);
        i = 7;
        results.forEach(function(result) {
          expect(result.getPriority()).to.equal(i++);
        });

        return pager.previous(20);

      })
      .then(function(results) {

        expect(pager.hasPrevious).to.be.false;
        expect(pager.hasNext).to.be.true;
        expect(results.length).to.equal(7);
        i = 0;
        results.forEach(function(result) {
          expect(result.getPriority()).to.equal(i++);
        });

      });

    });

  });


});
