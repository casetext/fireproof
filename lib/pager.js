
/**
 * A helper object for paging over Firebase objects.
 * @constructor Fireproof.Pager
 * @static
 * @param {Fireproof} ref a Firebase ref whose children you wish to page over.
 * @param {Number} [initialCount] The number of objects in the first page.
 * @property {Boolean} hasPrevious True if there are more objects before the current page.
 * @property {Boolean} hasNext True if there are more objects after the current page.
 */
function Pager(ref, initialCount) {

  if (arguments.length < 1) {
    throw new Error('Not enough arguments to Pager');
  }

  this._mainRef = ref.ref();
  this._resetCurrentOperation();

  this.hasNext = true;
  this.hasPrevious = false;

  if (initialCount) {
    var promise = this.next(initialCount);
    this.then = promise.then.bind(promise);
  } else {
    var deferred = Fireproof.defer();
    this.then = deferred.promise;
    deferred.resolve([]);
  }

}


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
    var requestedCount;

  if (self.hasNext) {

    return self._currentOperation
    .then(function() {

      self._direction = 'next';
      var ref = self._mainRef;
      if (self._page) {

        requestedCount = count + 1;
        ref = ref.orderByPriority().startAt(self._page.priority, self._page.key)
        .limitToFirst(count + 2);

      } else {
        requestedCount = count;
        ref = ref.startAt().limitToFirst(count + 1);
      }

      return ref.once('value');
    })
    .then(function(snap) {
      return self._handleResults(snap, requestedCount);
    });

  } else {

    var deferred = Fireproof.defer();
    deferred.resolve([]);
    return deferred.promise;

  }

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

  if (self.hasPrevious) {

    return self._currentOperation
    .then(function() {

      self._direction = 'previous';

      var ref = self._mainRef;
      if (self._page) {

        ref = ref.orderByPriority().endAt(self._page.priority, self._page.key)
        .limitToLast(count + 2);

      } else {
        throw new Error('Cannot call #previous on a Pager without calling #next first');
      }

      return ref.once('value');

    })
    .then(function(snap) {
      return self._handleResults(snap, count+1);
    });

  } else {

    var deferred = Fireproof.defer();
    deferred.resolve([]);
    return deferred.promise;

  }

};


Pager.prototype._handleResults = function(snap, requestedCount) {

  var self = this,
    objects = [];

  snap.forEach(function(child) {
    objects.push(child);
  });

  // remove any dead weight from the list
  if (self._direction === 'next') {

    if (self._page) {
      objects = objects.slice(1, requestedCount);
    } else {
      objects = objects.slice(0, requestedCount);
    }

  } else {
    if (snap.numChildren() <= requestedCount) {
      objects = objects.slice(0, snap.numChildren() - 1);
    } else {
      objects = objects.slice(1, requestedCount);
    }
  }

  if (self._direction === 'next') {

    this.hasNext = snap.numChildren() === requestedCount+1;
    this.hasPrevious = true;

  } else {

    this.hasPrevious = snap.numChildren() === requestedCount+1;
    this.hasNext = true;

  }

  if (objects.length > 0) {

    // set page positions
    if (self._direction === 'next') {

      self._page = {
        priority: objects[objects.length-1].getPriority(),
        key: objects[objects.length-1].key()
      };

    } else {

      self._page = {
        priority: objects[0].getPriority(),
        key: objects[0].key()
      };

    }

  }

  self._currentOperationCount--;

  if (self._currentOperationCount === 0) {
    self._resetCurrentOperation();
  }

  return objects;

};


Pager.prototype._resetCurrentOperation = function() {

  var deferred = Fireproof.defer();
  deferred.resolve(null);
  this._currentOperation = deferred.promise;
  this._currentOperationCount = 0;

};

Fireproof.Pager = Pager;
