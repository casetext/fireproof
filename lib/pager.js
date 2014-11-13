
/**
 * A helper object for paging over Firebase objects.
 * @constructor Fireproof.Pager
 * @static
 * @param {Fireproof} ref a Firebase ref whose children you wish to page over.
 */
function Pager(ref) {

  this._mainRef = ref.ref();
  this._resetCurrentOperation();

}


/**
 * Set the starting position for the ref.
 * @method Fireproof.Pager#setPosition
 * @param {*} priority The new priority.
 * @param {String} [key] The new key.
 * @returns {Pager} The pager is returned.
 */
Pager.prototype.setPosition = function(priority, key) {

  if (arguments.length === 0) {
    throw new Error('Not enough arguments to setPosition');
  }

  this._position = { priority: priority };

  if (typeof key === 'string') {
    this._position.key = key;
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

    self._direction = 'next';

    var ref = self._mainRef;
    if (self._position) {

      ref = ref.startAt(self._position.priority, self._position.key)
      .limit(count + 1);

    } else {
      ref = ref.startAt().limit(count);
    }

    return ref.once('value');
  })
  .then(self._handleResults.bind(self));

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

    self._direction = 'previous';

    var ref = self._mainRef;
    if (self._position) {

      ref = ref.endAt(self._position.priority, self._position.key)
      .limit(count + 1);

    } else {
      ref = ref.limit(count);
    }

    return ref.once('value');
  })
  .then(self._handleResults.bind(self));

};


Pager.prototype._handleResults = function(snap) {

  var self = this,
    objects = [];

  var childIndex = 0;
  var childCount = snap.numChildren();

  snap.forEach(function(child) {

    // if this child is the "catch" object, don't include it in the results
    var isCatchObject;
    if (self._direction === 'next') {
      isCatchObject = self._position && childIndex === 0;
    } else {
      isCatchObject = self._position && childIndex === childCount-1;
    }

    if (!isCatchObject) {

      objects.push(child);
      self._position = { priority: child.getPriority(), key: child.name() };

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
