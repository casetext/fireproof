
/**
 * A helper object for paging over Firebase objects.
 * @constructor Fireproof.Pager
 * @static
 * @param {Fireproof} ref a Firebase ref whose children you wish to page over.
 */
function Pager(ref) {

  this._positions = [];
  this._mainRef = ref.ref();

  this._resetCurrentOperation();

}


/**
 * Set the starting position for the ref.
 * @method Fireproof.Pager#startAt
 * @param {*} priority The new priority for the startAt.
 * @param {String} [key] The new key for the startAt.
 * @returns {Pager} The pager is returned.
 */
Pager.prototype.startAt = function(priority, key) {

  if (arguments.length === 0) {
    throw new Error('Not enough arguments to startAt');
  }

  this._lastPosition = { priority: priority };

  if (typeof key === 'string') {
    this._lastPosition.key = key;
  }

  return this;

};


/**
 * Get the next page of children from the ref.
 * @method Fireproof.Pager#next
 * @param {Number} count The size of the page.
 * @returns {Promise} A promise that resolves with an array of the next children.
 */
Pager.prototype.next = function(count) {

  if (arguments.length === 0) {
    throw new Error('Not enough arguments to next');
  }

  var self = this;

  return self._currentOperation
  .then(function() {

    var ref = self._mainRef;
    if (self._lastPosition) {

      ref = ref.startAt(self._lastPosition.priority, self._lastPosition.key)
      .limit(count + 1);

    } else {
      ref = ref.startAt().limit(count);
    }

    return ref.once('value');
  })
  .then(self._handleResults.bind(self))
  .then(function(results) {

    if (self._lastPosition) {
      self._positions.push(self._lastPosition);
    }

    return results;

  });

};


/**
 * Get the previous page of children from the ref.
 * @method Fireproof.Pager#previous
 * @param {Number} count The size of the page.
 * @returns {Promise} A promise that resolves with an array of the next children.
 */
Pager.prototype.previous = function(count) {

  if (arguments.length === 0) {
    throw new Error('Not enough arguments to previous');
  }

  var self = this;

  return self._currentOperation
  .then(function() {

    var ref = self._mainRef;
    if (self._positions.length > 0) {

      var position = self._positions.pop();
      ref = ref.endAt(position.priority, position.key);

    }

    ref = ref.limit(self._positions.length > 0 ? count + 1 : count);

    return ref.once('value');
  })
  .then(self._handleResults.bind(self))
  .then(function(results) {

    if (self._lastPosition) {
      self._positions.push(self._lastPosition);
    }

    return results;

  });

};


Pager.prototype._handleResults = function(snap) {

  var self = this,
    objects = [];

  var childIndex = 0;
  snap.forEach(function(child) {

    // if this child is the "catch" object, don't include it in the results
    if (self._positions.length === 0 || childIndex > 0) {

      objects.push(child);
      self._lastPosition = { priority: child.getPriority(), key: child.name() };

    }

    childIndex++;

  });

  self._currentOperationCount--;

  if (self._currentOperationCount === 0) {
    self._resetCurrentOperation();
  }

  return objects;

};


Pager.prototype._resetCurrentOperation = function() {

  var deferred = Fireproof._checkQ().defer();
  deferred.resolve(null);
  this._currentOperation = deferred.promise;
  this._currentOperationCount = 0;

};

Fireproof.Pager = Pager;
