
'use strict';

describe.only('Fireproof.LiveArray', function() {

  function shuffle(o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) {}
    return o;
  }

  var root, liveArray, livingKeys;

  before(function() {
    root = new Fireproof(firebase);
    liveArray = new Fireproof.LiveArray();
    livingKeys = liveArray.keys;

    return root.child('test/liveArray')
    .set({
      'a': {
        '.value': false,
        '.priority': null
      },
      'b': {
        '.value': false,
        '.priority': null
      },
      'c': {
        '.value': true,
        '.priority': 0
      },
      'd': {
        '.value': true,
        '.priority': 0
      },
      'e': {
        '.value': 0,
        '.priority': 1
      },
      'f': {
        '.value': 1,
        '.priority': 2,
      },
      'g': {
        '.value': 'hello',
        '.priority': 'hello',
      },
      'h': {
        '.value': 'world',
        '.priority': 'world'
      }
    });

  });

  describe('firebaseKeySort', function() {

    it('sorts an array of objects by the Firebase key sort algorithm', function() {

      var testArray = shuffle([{
        '.key': '0',
        '.value': 0
      }, {
        '.key': '1',
        '.value': 1
      }, {
        '.key': '87',
        '.value': 2
      }, {
        '.key': '0fscks',
        '.value': 3
      }, {
        '.key': 'apple',
        '.value': 4
      }, {
        '.key': 'dell',
        '.value': 5
      }]);

      testArray.sort(Fireproof.LiveArray.firebaseKeySort);

      var result = testArray.map(function(obj) {
        return obj['.value'];
      });

      expect(result).to.deep.equal([0, 1, 2, 3, 4, 5]);

    });

  });

  describe('firebasePrioritySort', function() {

    it('sorts an array of objects by the Firebase priority sort algorithm', function() {

      var testArray = shuffle([{
        '.key': '0',
        '.priority': null,
        '.value': 0
      }, {
        '.key': '1',
        '.priority': null,
        '.value': 1
      }, {
        '.key': '0',
        '.priority': 0,
        '.value': 2
      }, {
        '.key': '0',
        '.priority': 1,
        '.value': 3
      }, {
        '.key': '1',
        '.priority': 1,
        '.value': 4
      }, {
        '.key': '0',
        '.priority': 'apple',
        '.value': 5
      }, {
        '.key': '0',
        '.priority': 'dell',
        '.value': 6
      }]);

      testArray.sort(Fireproof.LiveArray.firebasePrioritySort);

      var result = testArray.map(function(obj) {
        return obj['.value'];
      });

      expect(result).to.deep.equal([0, 1, 2, 3, 4, 5, 6]);

    });

  });

  describe('firebaseChildSort', function() {

    it('sorts an array of objects by the Firebase child sort algorithm', function() {

      var testArray = shuffle([{
        '.key': '0',
        '.value': 0,
        '.order': 0
      }, {
        '.key': '1',
        '.value': 'foo',
        '.order': 1
      }, {
        '.key': '2',
        '.value': {
          apples: 'oranges'
        },
        '.order': 2
      }, {
        '.key': '0',
        '.value': {
          cabbageCount: false
        },
        '.order': 3
      }, {
        '.key': '1',
        '.value': {
          cabbageCount: false
        },
        '.order': 4
      }, {
        '.key': '0',
        '.value': {
          cabbageCount: true
        },
        '.order': 5
      }, {
        '.key': '1',
        '.value': {
          cabbageCount: true
        },
        '.order': 6
      }, {
        '.key': '1',
        '.value': {
          cabbageCount: 10
        },
        '.order': 7
      }, {
        '.key': '0',
        '.value': {
          cabbageCount: 20
        },
        '.order': 8
      }, {
        '.key': '0',
        '.value': {
          cabbageCount: 'a few'
        },
        '.order': 9
      }, {
        '.key': '0',
        '.value': {
          cabbageCount: 'too many to count'
        },
        '.order': 10
      }, {
        '.key': '0',
        '.value': {
          cabbageCount: {
            volume: 'significant'
          }
        },
        '.order': 11
      }, {
        '.key': '1',
        '.value': {
          cabbageCount: {
            volume: 'significant'
          }
        },
        '.order': 12
      }]);

      testArray.sort(Fireproof.LiveArray.firebaseChildSort('cabbageCount'));

      var result = testArray.map(function(obj) {
        return obj['.order'];
      });

      expect(result).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

    });

  });

  describe('#connect', function() {

    it('listens to a given Firebase ref and automatically updates its arrays', function(done) {

      liveArray.connect(root.child('test/liveArray').orderByKey());
      setTimeout(function() {
        expect(liveArray.keys).to.deep.equal(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
        expect(liveArray.values).to.deep.equal([
          false,
          false,
          true,
          true,
          0,
          1,
          'hello',
          'world'
        ]);
        expect(liveArray.priorities).to.deep.equal([
          null,
          null,
          0,
          0,
          1,
          2,
          'hello',
          'world'
        ]);
        done();
      }, 150);

    });

    it('changes the contents of the arrays based on changes in the data', function() {
      return root.child('test/liveArray/c').remove()
      .then(function() {
        expect(livingKeys).to.equal(liveArray.keys);
        expect(liveArray.keys).to.deep.equal(['a', 'b', 'd', 'e', 'f', 'g', 'h']);
      });
    });

  });

  describe('#disconnect', function() {

    it('wipes out the arrays', function() {

      liveArray.disconnect();
      expect(liveArray.watchers).to.be.null;
      expect(liveArray.ref).to.be.null;
      expect(liveArray.keys.length).to.equal(0);
      expect(liveArray.priorities.length).to.equal(0);
      expect(liveArray.values.length).to.equal(0);

    });

  });

});
