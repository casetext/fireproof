
/**
 * A helper object for retrieving sorted Firebase objects from multiple
 * locations.
 * @constructor Fireproof.Demux
 * @static
 * @param {Array} refs a list of Fireproof object references to draw from.
 * @param {boolean} [limitToFirst] Whether to use "limitToFirst" to restrict the length
 * of queries to Firebase. True by default. Set this to false if you want to
 * control the query more directly by setting it on the objects you pass to refs.
 */
function Demux(refs, limit) {

  if (!(this instanceof Fireproof.Demux)) {
    return new Fireproof.Demux(refs);
  } else if (arguments.length > 1 && !Array.isArray(refs)) {
    refs = Array.prototype.slice.call(arguments, 0);
  }

  this._limit = (limit !== undefined ? limit : true);
  this._refs = refs;
  this._positions = refs.reduce(function(positions, ref) {

    positions[ref.ref().toString()] = {
      name: undefined,
      priority: undefined
    };

    return positions;

  }, {});

  // we always want there to be a "previous" promise to hang operations from
  var previousDeferred = Fireproof.defer();
  previousDeferred.resolve([]);
  this._previousPromise = previousDeferred.promise;

  this._buffer = [];

}


/**
 * Get the next `count` items from the paths, ordered by priority.
 * @method Fireproof.Demux#get
 * @param {Number} count The number of items to get from the list.
 * @returns {Promise} A promise that resolves with the next `count` items, ordered by priority.
 */
Demux.prototype.get = function(count) {

  var self = this;

  self._previousPromise = self._previousPromise
  .then(function() {

    if (self._buffer.length >= count) {

      // If we have enough objects in the buffer to service the request, don't
      // call Firebase again.
      return self._buffer.splice(0, count);

    } else {

      // We need to retrieve more objects from Firebase to satisfy the request.

      return Fireproof._checkQ().all(self._refs.map(function(ref) {

        var priority = self._positions[ref.ref().toString()].priority,
          name = self._positions[ref.ref().toString()].name;

        var newRef;

        if (priority && name) {
          newRef = ref.startAt(priority, name);
        } else if (priority) {
          newRef = ref.startAt(priority);
        } else {
          newRef = ref.startAt();
        }

        if (self._limit) {
          return newRef.limitToFirst(count - self._buffer.length);
        } else {
          return newRef;
        }

      }))
      .then(self._concatenateResults.bind(self))
      .then(function() {
        return self._buffer.splice(0, count);
      });

    }

  });

  return self._previousPromise;

};


Demux.prototype._concatenateResults = function(resultLists) {

  var self = this;

  var allResults = resultLists.reduce(function(acc, resultList) {

    var listPath = resultList.ref().toString();

    resultList.forEach(function(child) {

      var position = self._positions[listPath];

      // don't include an overlapping child
      if (position.priority !== child.getPriority() || position.name !== child.key()) {
        acc.push(child);
        position.priority = child.getPriority();
        position.name = child.key();
      }

    });

    return acc;

  }, []);

  self._buffer = self._buffer.concat(allResults).sort(function(a, b) {

    // sort by priority and name if the priorities are identical.
    // See the Firebase docs for more information.
    var aPriority = a.getPriority(),
      bPriority = b.getPriority(),
      aName = a.key(),
      bName = b.key();

    if (typeof aPriority === typeof bPriority) {

      if (aPriority === null) {
        return aName.localeCompare(bName);
      } else if (typeof aPriority === 'number') {
        return (aPriority - bPriority) || aName.localeCompare(bName);
      } else if (typeof aPriority === 'string') {
        return aPriority.localeCompare(bPriority) || aName.localeCompare(bName);
      }

    } else {

      // different priority types
      if (aPriority === null) {
        return -1;
      } else if (bPriority === null) {
        return 1;
      } else if (typeof aPriority === 'number') {
        return -1;
      } else {
        return 1;
      }

    }

  });

};


Fireproof.Demux = Demux;
