
/**
 * A live array that keeps its members in sync with a Firebase location's children.
 * The three array references, `keys`, `values`, and `priorities`, are guaranteed
 * to persist for the lifetime of the array. In other words, the arrays themselves
 * are constant; only their contents are mutable. This is highly useful behavior
 * for dirty-checking environments like Angular.js.
 * @constructor Fireproof.LiveArray
 * @static
 * @param {Function} [errorHandler] a function to be called if a Firebase error occurs.
 * @property {Array} keys A live array of the keys at the Firebase ref.
 * @property {Array} values A live array of the values at the Firebase ref.
 * @property {Array} priorities A live array of the priorities at the Firebase ref.
 */
function LiveArray(errorHandler) {

  this._items = [];
  this.keys = [];
  this.values = [];
  this.priorities = [];

  if (errorHandler) {
    this.errorHandler = errorHandler;
  }

}


function firebaseKeySort(a, b) {

  var aInt = Number(a['.key']), bInt = Number(b['.key']);
  if (!isNaN(aInt) && !isNaN(bInt)) {
    return aInt - bInt;
  } else if (!isNaN(aInt)) {
    return -1;
  } else if (!isNaN(bInt)) {
    return 1;
  } else {
    return a['.key'].localeCompare(b['.key']);
  }

}
LiveArray.firebaseKeySort = firebaseKeySort;


function firebaseChildSort(childName) {

  return function(a, b) {

    var aVal = a['.value'], bVal = b['.value'],
      aChild, bChild;

    if (typeof aVal === 'object') {
      aChild = aVal[childName];
      if (aChild === undefined) {
        aChild = null;
      }
    } else {
      aChild = null;
    }

    if (typeof bVal === 'object') {
      bChild = bVal[childName];
      if (bChild === undefined) {
        bChild = null;
      }
    } else {
      bChild = null;
    }

    // 1. Children with a null value for the specified child key come first.
    if (aChild === null && bChild === null) {
      return firebaseKeySort(a, b);
    } else if (aChild === null) {
      return -1;
    } else if (bChild === null) {
      return 1;
    }

    // 2. Children with a value of false for the specified child key come next.
    // If multiple children have a value of false, they are sorted lexicographically by key.
    if (aChild === false && bChild === false) {
      return firebaseKeySort(a, b);
    } else if (aChild === false) {
      return -1;
    } else if (bChild === false) {
      return 1;
    }

    // 3. Children with a value of true for the specified child key come next.
    // If multiple children have a value of true, they are sorted lexicographically by key.
    if (aChild === true && bChild === true) {
      return firebaseKeySort(a, b);
    } else if (aChild === true) {
      return -1;
    } else if (bChild === true) {
      return 1;
    }

    // 4. Children with a numeric value come next, sorted in ascending order.
    // If multiple children have the same numerical value for the specified child node,
    // they are sorted by key.
    if (typeof aChild === 'number' && typeof bChild === 'number') {

      if (aChild - bChild !== 0) {
        return aChild - bChild;
      } else {
        return firebaseKeySort(a, b);
      }

    } else if (typeof aChild === 'number') {
      return -1;
    } else if (typeof bChild === 'number') {
      return 1;
    }

    // 5. Strings come after numbers, and are sorted lexicographically in ascending order.
    // If multiple children have the same value for the specified child node,
    // they are ordered lexicographically by key.
    if (typeof aChild === 'string' && typeof bChild === 'string') {

      if (aChild === bChild) {
        return firebaseKeySort(a, b);
      } else {
        return aChild.localeCompare(bChild);
      }

    } else if (typeof aChild === 'string') {
      return -1;
    } else if (typeof bChild === 'string') {
      return 1;
    }

    // 6. Objects come last, and are sorted lexicographically by key name in ascending order.
    return firebaseKeySort(a, b);

  };

}
LiveArray.firebaseChildSort = firebaseChildSort;


function firebasePrioritySort(a, b) {

  var aPriority = a['.priority'],
    bPriority = b['.priority'];

  // 1. Children with no priority (the default) come first.
  if (aPriority === null && bPriority === null) {
    return firebaseKeySort(a, b);
  } else if (aPriority === null) {
    return -1;
  } else if (bPriority === null) {
    return 1;
  }

  // 2. Children with a number as their priority come next.
  // They are sorted numerically by priority, small to large.
  if (typeof aPriority === 'number' && typeof bPriority === 'number') {

    if (aPriority - bPriority === 0) {
      return firebaseKeySort(a, b);
    } else {
      return aPriority - bPriority;
    }

  } else if (typeof aPriority === 'number') {
    return -1;
  } else if (typeof bPriority === 'number') {
    return 1;
  }

  // 3. Children with a string as their priority come last.
  // They are sorted lexicographically by priority.
  var stringCompareResult = aPriority.localeCompare(bPriority);
  if (stringCompareResult === 0) {
    return firebaseKeySort(a, b);
  } else {
    return stringCompareResult;
  }

}
LiveArray.firebasePrioritySort = firebasePrioritySort;


/**
 * Connect this LiveArray to a Firebase reference, instantiating listeners
 * for child events.
 * If an error is received from a Firebase listener, _all_ listeners are
 * disconnected, LiveArray#error is set, and your error handler is called if you
 * supplied one.
 * @method Fireproof.LiveArray#connect
 * @param {Fireproof} [ref] a Firebase ref whose children you wish to sync to.
 * @param {String} [sortMode] "key", "priority", or "child".
 * @param {String} [sortProperty] The name of the child property to sort on, if
 * sortMode is null.
 */
LiveArray.prototype.connect = function(ref, sortMode, sortProperty) {

  var self = this;

  self.ref = ref;
  if (self.ref.toFirebase) {
    self.ref = self.ref.toFirebase();
  }

  self.error = null;
  function handleError(err) {
    self.error = err;
    self.disconnect();
    if (self.errorHandler) {
      self.errorHandler.call(null, err);
    }
  }

  self.watchers = [

    ref.toFirebase()
    .on('child_added', function(snap) {

      var newVal = {
        '.key': snap.key(),
        '.value': snap.val(),
        '.priority': snap.getPriority()
      };

      self._items.push(newVal);
      self._sort(sortMode, sortProperty);

    }, handleError),
    ref.toFirebase()
    .on('child_removed', function(snap) {

      var indexOfItem = self.keys.indexOf(snap.key());
      self._items.splice(indexOfItem, 1);
      self._sort(sortMode, sortProperty);

    }, handleError),
    ref.toFirebase()
    .on('child_changed', function(snap) {

      // child_changed explicitly means a value change
      var indexOfItem = self.keys.indexOf(snap.key());
      self._items[indexOfItem]['.value'] = snap.val();
      self._sort(sortMode, sortProperty);

    }, handleError),
    ref.toFirebase()
    .on('child_moved', function(snap) {

      // child_moved explicitly means a priority change
      var indexOfItem = self.keys.indexOf(snap.key());
      self._items[indexOfItem]['.priority'] = snap.getPriority();
      self._sort(sortMode, sortProperty);

    }, handleError)

  ];

};


/**
 * Disconnect this LiveArray from a Firebase reference, removing all listeners.
 * Also clears the contents of the live array references.
 * @method Fireproof.LiveArray#disconnect
 */
LiveArray.prototype.disconnect = function() {

  if (this.ref && this.watchers) {

    this.ref.off('child_added', this.watchers[0]);
    this.ref.off('child_removed', this.watchers[1]);
    this.ref.off('child_changed', this.watchers[2]);
    this.ref.off('child_moved', this.watchers[3]);

    this.ref = null;
    this.watchers = null;

  }

  // empty the arrays
  this._items.length = 0;
  this.keys.length = 0;
  this.values.length = 0;
  this.priorities.length = 0;

};


LiveArray.prototype._sort = function(sortMode, sortProperty) {

  // empty the arrays
  this.keys.length = 0;
  this.values.length = 0;
  this.priorities.length = 0;

  // sort the items
  switch(sortMode) {
  case 'child':
    this._items.sort(firebaseChildSort(sortProperty));
    break;
  case 'key':
    this._items.sort(firebaseKeySort);
    break;
  default:
    this._items.sort(firebasePrioritySort);
    break;
  }

  // populate the arrays
  for (var i = 0; i < this._items.length; i++) {
    this.keys[i] = this._items[i]['.key'];
    this.values[i] = this._items[i]['.value'];
    this.priorities[i] = this._items[i]['.priority'];
  }

};


Fireproof.LiveArray = LiveArray;
