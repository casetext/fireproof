
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Fireproof = factory();
  }
}(this, function() {

  
'use strict';

/**
 * Fireproofs an existing Firebase reference, giving it magic promise powers.
 * @name Fireproof
 * @constructor
 * @global
 * @param {Firebase} firebaseRef A Firebase reference object.
 * @property then A promise shortcut for .once('value'),
 * except for references created by .push(), where it resolves on success
 * and rejects on failure of the property object.
 * @example
 * var fp = new Fireproof(new Firebase('https://test.firebaseio.com/something'));
 * fp.then(function(snap) { console.log(snap.val()); });
 */
function Fireproof(firebaseRef, promise) {

  this._ref = firebaseRef;
  if (promise && promise.then) {
    this.then = promise.then.bind(promise);
  } else {

    this.then = function(ok, fail) {

      return this.once('value', function() {})
      .then(ok || null, fail || null);

    };

  }

}


var Q;

Fireproof._checkQ = function() {

  if (Q === undefined) {
    throw new Error('You must supply a Defer-style promise library to Fireproof!');
  }

  return Q;

};

/**
 * Tell Fireproof to use a given function to set timeouts from now on.
 * NB: If you are using AMD/require.js, you MUST call this function!
 * @method Fireproof.setNextTick
 * @param {Function} nextTick a function that takes a function and
 * runs it in the immediate future.
 */
Fireproof.setNextTick = function(fn) {
  Fireproof.__nextTick = fn;
};


Fireproof._nextTick = function(fn) {

  if (Fireproof.__nextTick) {
    Fireproof.__nextTick(fn, 0);
  } else {
    setTimeout(fn, 0);
  }

};


Fireproof._handleError = function(onComplete) {

  var deferred = Fireproof._checkQ().defer();

  var rv = function(err, val) {

    var context = this,
      rvArgs = arguments;


    // finish stats event, if there is one.
    if (rv.id) {
      Fireproof.stats._finish(rv.id, err);
    }

    if (onComplete && typeof onComplete === 'function') {

      Fireproof._nextTick(function() {
        onComplete.apply(context, rvArgs);
      });

    }

    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(val);
    }

  };

  rv.promise = deferred.promise;

  return rv;

};


/**
 * Tell Fireproof to use a given promise library from now on.
 * @method Fireproof.bless
 * @param {Q} Q a Q-style promise constructor with at least defer().
 * @throws if you don't provide a valid Deferred-style promise library.
 */
Fireproof.bless = function(newQ) {

  if (newQ === undefined || newQ === null || typeof(newQ.defer) !== 'function') {
    throw new Error('You tried to give Fireproof an invalid Q library!');
  }

  var deferred = newQ.defer();

  if (deferred === undefined || deferred === null ||
    deferred.promise === undefined || deferred.promise === null ||
    typeof(deferred.reject) !== 'function' ||
    typeof(deferred.resolve) !== 'function' ||
    typeof(deferred.promise.then) !== 'function') {
    throw new Error('You tried to give Fireproof an invalid Q library!');
  }

  Q = newQ;

};


/* FIXME(goldibex): Find out the reason for this demonry.
 * For reasons completely incomprehensible to me, some type of race condition
 * is possible if multiple Fireproof references attempt authentication at the
 * same time, the result of which is one or more of the promises will never
 * resolve.
 * Accordingly, it is necessary that we wrap authentication actions in a
 * global lock. This is accomplished using setInterval. No, I don't like it
 * any more than you do.
 */
var authing = false;

/**
 * Delegates Firebase#auth.
 * @method Fireproof#auth
 * @param {string} authToken Firebase authentication token.
 * @param {function=} onComplete Callback on initial completion.
 * @param {function=} onCancel Callback if we ever get disconnected.
 * @returns {Promise} Resolves on success, rejects on failure.
 */
Fireproof.prototype.auth = function(authToken, onComplete, onCancel) {

  var deferred = Fireproof._checkQ().defer(),
    self = this;

  var authIntervalId = setInterval(function() {

    if (!authing) {

      authing = true;
      self._ref.auth(authToken, function(err, info) {

        authing = false;
        clearInterval(authIntervalId);
        if (err !== null) {
          deferred.reject(err);
        } else {
          deferred.resolve(info);
        }

        if (typeof onComplete === 'function') {
          Fireproof._nextTick(function() {
            onComplete(err, info);
          });
        }

      }, onCancel);

    }

  }, 1);

  return deferred.promise;

};


/**
 * Delegates Firebase#child, wrapping the child in fireproofing.
 * @method Fireproof#child
 * @param {string} childPath The subpath to refer to.
 * @returns {Fireproof} A reference to the child path.
 */
Fireproof.prototype.child = function(childPath) {
  return new Fireproof(this._ref.child(childPath));
};


/**
 * Delegates Firebase#parent, wrapping the child in fireproofing.
 * @method Fireproof#parent
 * @returns {Fireproof} A ref to the parent path, or null if there is none.
 */
Fireproof.prototype.parent = function() {

  if (this._ref.parent() === null) {
    return null;
  } else {
    return new Fireproof(this._ref.parent());
  }

};


/**
 * Delegates Firebase#root, wrapping the root in fireproofing.
 * @method Fireproof#root
 * @returns {Fireproof} A ref to the root.
 */
Fireproof.prototype.root = function() {
  return new Fireproof(this._ref.root());
};


/**
 * Hands back the original Firebase reference.
 * @method Fireproof#toFirebase
 * @returns {Firebase} The proxied Firebase reference.
 */
Fireproof.prototype.toFirebase = function() {
  return this._ref;
};


/**
 * Delegates Firebase#name.
 * @method Fireproof#name
 * @returns {string} The last component of this reference object's path.
 */
Fireproof.prototype.name = function() {
  return this._ref.name();
};


/**
 * Delegates Firebase#key.
 * @method Fireproof#key
 * @returns {string} The last component of this reference object's path.
 */
Fireproof.prototype.key = function() {
  return this._ref.key();
};


/**
 * Delegates Firebase#toString.
 * @method Fireproof#toString
 * @returns {string} The full URL of this reference object.
 */
Fireproof.prototype.toString = function() {
  return this._ref.toString();
};



function findOptions(onComplete, options) {

  if (typeof onComplete !== 'function' && typeof(options) === undefined) {
    return onComplete;
  } else {
    return options;
  }

}

/**
 * Delegates Firebase#authWithCustomToken.
 * @method Fireproof#authWithCustomToken
 * @param {String} authToken
 * @param {Function} [onComplete]
 * @param {Object} [options]
 * @returns {Promise} that resolves on auth success and rejects on auth failure.
 */
Fireproof.prototype.authWithCustomToken = function(authToken, onComplete, options) {

  var oc = Fireproof._handleError(onComplete);
  options = findOptions(onComplete, options);
  this._ref.authWithCustomToken(authToken, oc, options);

  return oc.promise;

};


/**
 * Delegates Firebase#authAnonymously.
 * @method Fireproof#authAnonymously
 * @param {Function} [onComplete]
 * @param {Object} [options]
 * @returns {Promise} that resolves on auth success and rejects on auth failure.
 */
Fireproof.prototype.authAnonymously = function(onComplete, options) {

  var oc = Fireproof._handleError(onComplete);
  options = findOptions(onComplete, options);
  this._ref.authAnonymously(oc, options);

  return oc.promise;

};


/**
 * Delegates Firebase#authWithPassword.
 * @method Fireproof#authWithPassword
 * @param {Object} credentials Should include `email` and `password`.
 * @param {Function} [onComplete]
 * @param {Object} [options]
 * @returns {Promise} that resolves on auth success and rejects on auth failure.
 */
Fireproof.prototype.authWithPassword = function(credentials, onComplete, options) {

  var oc = Fireproof._handleError(onComplete);
  options = findOptions(onComplete, options);
  this._ref.authWithPassword(credentials, oc, options);

  return oc.promise;

};


/**
 * Delegates Firebase#authWithOAuthPopup.
 * @method Fireproof#authWithOAuthPopup
 * @param {String} provider
 * @param {Function} [onComplete]
 * @param {Object} [options]
 * @returns {Promise} that resolves on auth success and rejects on auth failure.
 */
Fireproof.prototype.authWithOAuthPopup = function(provider, onComplete, options) {

  var oc = Fireproof._handleError(onComplete);
  options = findOptions(onComplete, options);
  this._ref.authWithOAuthPopup(provider, oc, options);

  return oc.promise;

};


/**
 * Delegates Firebase#authWithOAuthRedirect.
 * @method Fireproof#authWithOAuthRedirect
 * @param {String} provider
 * @param {Function} [onComplete]
 * @param {Object} [options]
 * @returns {Promise} that resolves on auth success and rejects on auth failure.
 */
Fireproof.prototype.authWithOAuthRedirect = function(provider, onComplete, options) {

  var oc = Fireproof._handleError(onComplete);
  options = findOptions(onComplete, options);
  this._ref.authWithOAuthRedirect(provider, oc, options);

  return oc.promise;

};


/**
 * Delegates Firebase#authWithOAuthPopup.
 * @method Fireproof#authWithOAuthPopup
 * @param {String} provider
 * @param {Object} credentials
 * @param {Function} [onComplete]
 * @param {Object} [options]
 * @returns {Promise} that resolves on auth success and rejects on auth failure.
 */
Fireproof.prototype.authWithOAuthToken = function(provider, credentials, onComplete, options) {

  var oc = Fireproof._handleError(onComplete);
  options = findOptions(onComplete, options);
  this._ref.authWithOAuthRedirect(provider, credentials, oc, options);

  return oc.promise;

};


/**
 * Delegates Firebase#getAuth.
 * @method Fireproof#getAuth
 * @returns {Object} user info object, or null otherwise.
 */
Fireproof.prototype.getAuth = function() {
  return this._ref.getAuth();
};


/**
 * Delegates Firebase#onAuth.
 * @method Fireproof#onAuth
 * @param {Function} onComplete Gets called on auth change.
 * @param {Object} [context]
 */
Fireproof.prototype.onAuth = function(onComplete, context) {
  return this._ref.onAuth(onComplete, context);
};


/**
 * Delegates Firebase#offAuth.
 * @method Fireproof#offAuth
 * @param {Function} onComplete The function previously passed to onAuth.
 * @param {Object} [context]
 */
Fireproof.prototype.offAuth = function(onComplete, context) {
  return this._ref.offAuth(onComplete, context);
};


/**
 * Delegates Firebase#unauth.
 * @method Fireproof#unauth
 */
Fireproof.prototype.unauth = function() {
  return this._ref.unauth();
};



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
  var previousDeferred = Fireproof._checkQ().defer();
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


function LiveArray() {

  this._items = [];
  this.keys = [];
  this.values = [];
  this.priorities = [];

  if (arguments.length > 0) {
    this.connect.apply(this, arguments);
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


function OnDisconnect(ref) {
  this._od = ref.onDisconnect();
}


/**
 * Delegates onDisconnect()#cancel.
 * @method Fireproof#onDisconnect#cancel
 * @param {function=} callback Firebase callback.
 * @returns {Promise}
 */
OnDisconnect.prototype.cancel = function(cb) {

  var handler = Fireproof._handleError(cb);
  this._od.cancel(handler);
  return handler.promise;

};


/**
 * Delegates onDisconnect()#remove.
 * @method Fireproof#onDisconnect#remove
 * @param {function=} callback Firebase callback.
 * @returns {Promise}
 */
OnDisconnect.prototype.remove = function(cb) {

  var handler = Fireproof._handleError(cb);
  this._od.remove(handler);
  return handler.promise;

};


/**
 * Delegates onDisconnect()#set.
 * @method Fireproof#onDisconnect#set
 * @param {*} value Value to set on the ref on disconnect.
 * @param {function=} callback Firebase callback.
 * @returns {Promise}
 */
OnDisconnect.prototype.set = function(value, cb) {

  var handler = Fireproof._handleError(cb);
  this._od.set(value, handler);
  return handler.promise;

};


/**
 * Delegates onDisconnect()#setWithPriority.
 * @method Fireproof#onDisconnect#setWithPriority
 * @param {*} value Value to set on the ref on disconnect.
 * @param {*} priority Priority to set on the ref on disconnect.
 * @param {function=} callback Firebase callback.
 * @returns {Promise}
 */
OnDisconnect.prototype.setWithPriority = function(value, priority, cb) {

  var handler = Fireproof._handleError(cb);
  this._od.setWithPriority(value, priority, handler);
  return handler.promise;

};


/**
 * Delegates onDisconnect()#update.
 * @method Fireproof#onDisconnect#update
 * @param {*} value Value to update on the ref on disconnect.
 * @param {function=} callback Firebase callback.
 * @returns {Promise}
 */
OnDisconnect.prototype.update = function(value, cb) {

  var handler = Fireproof._handleError(cb);
  this._od.update(value, handler);
  return handler.promise;

};

/**
 * Delegates Fireproof#onDisconnect.
 * @method Fireproof#onDisconnect
 * @returns {Fireproof.OnDisconnect}
 */
Fireproof.prototype.onDisconnect = function() {
  return new OnDisconnect(this._ref);
};



/**
 * A helper object for paging over Firebase objects.
 * @constructor Fireproof.Pager
 * @static
 * @param {Fireproof} ref a Firebase ref whose children you wish to page over.
 * @param {Number} [initialCount] The number of objects in the first page.
 */
function Pager(ref, initialCount) {

  if (arguments.length < 1) {
    throw new Error('Not enough arguments to Pager');
  }

  this._mainRef = ref.ref();
  this._resetCurrentOperation();

  if (initialCount) {
    var promise = this.next(initialCount);
    this.then = promise.then.bind(promise);
  } else {
    var deferred = Fireproof._checkQ().defer();
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

  return self._currentOperation
  .then(function() {

    self._direction = 'next';

    var ref = self._mainRef;
    if (self._page) {

      ref = ref.startAt(self._page.end.priority, self._page.end.key)
      .limitToFirst(count + 1);

    } else {
      ref = ref.startAt().limitToFirst(count);
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
    if (self._page) {

      ref = ref.endAt(self._page.start.priority, self._page.start.key)
      .limitToLast(count + 1);

    } else {
      ref = ref.limitToFirst(count);
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
      isCatchObject = self._page && childIndex === 0;
    } else {
      isCatchObject = self._page && childIndex === childCount-1;
    }

    if (!isCatchObject) {
      objects.push(child);
    }

    childIndex++;

  });

  if (objects.length > 0) {

    // set page positions
    self._page = {
      start: {
        priority: objects[0].getPriority(),
        key: objects[0].key()
      },

      end: {
        priority: objects[objects.length-1].getPriority(),
        key: objects[objects.length-1].key()
      }
    };

  }

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


/**
 * Delegates Firebase#limit.
 * @method Fireproof#limit
 * @param {Number} limit
 * @returns {Fireproof}
 */
Fireproof.prototype.limit = function(limit) {
  return new Fireproof(this._ref.limit(limit));
};


/**
 * Delegates Firebase#limitToFirst.
 * @method Fireproof#limitToFirst
 * @param {Number} limit
 * @returns {Fireproof}
 */
Fireproof.prototype.limitToFirst = function(limit) {
  return new Fireproof(this._ref.limitToFirst(limit));
};


/**
 * Delegates Firebase#limitToLast.
 * @method Fireproof#limitToLast
 * @param {Number} limit
 * @returns {Fireproof}
 */
Fireproof.prototype.limitToLast = function(limit) {
  return new Fireproof(this._ref.limitToLast(limit));
};


/**
 * Delegates Firebase#orderByChild.
 * @method Fireproof#orderByChild
 * @param {string} key
 * @returns {Fireproof}
 */
Fireproof.prototype.orderByChild = function(key) {
  return new Fireproof(this._ref.orderByChild(key));
};


/**
 * Delegates Firebase#orderByKey.
 * @method Fireproof#orderByKey
 * @returns {Fireproof}
 */
Fireproof.prototype.orderByKey = function() {
  return new Fireproof(this._ref.orderByKey());
};


/**
 * Delegates Firebase#orderByPriority.
 * @method Fireproof#orderByPriority
 * @returns {Fireproof}
 */
Fireproof.prototype.orderByPriority = function() {
  return new Fireproof(this._ref.orderByPriority());
};


/**
 * Delegates Firebase#equalTo.
 * @method Fireproof#equalTo
 * @param {String|Number|null} value
 * @param {String} [key]
 * @returns {Fireproof}
 */
Fireproof.prototype.equalTo = function(value, key) {

  if (key) {
    return new Fireproof(this._ref.equalTo(value, key));
  } else {
    return new Fireproof(this._ref.equalTo(value));
  }

};


/**
 * Delegates Firebase#startAt.
 * @method Fireproof#startAt
 * @param {object} value
 * @param {string} [key]
 * @returns {Fireproof}
 */
Fireproof.prototype.startAt = function(value, key) {

  if (key) {
    return new Fireproof(this._ref.startAt(value, key));
  } else {
    return new Fireproof(this._ref.startAt(value));
  }

};


/**
 * Delegates Firebase#endAt.
 * @method Fireproof#endAt
 * @param {object} value
 * @param {string} [key]
 * @returns {Fireproof}
 */
Fireproof.prototype.endAt = function(value, key) {

  if (key) {
    return new Fireproof(this._ref.endAt(value, key));
  } else {
    return new Fireproof(this._ref.endAt(value));
  }

};


/**
 * Delegates Firebase#ref.
 * @method Fireproof#ref
 * @returns {Fireproof}
 */
Fireproof.prototype.ref = function() {
  return new Fireproof(this._ref.ref());
};


/**
 * Delegates Firebase#transaction.
 * @method Fireproof#transaction
 * @param {function} updateFunction
 * @param {function} onComplete
 * @param {boolean=} applyLocally
 * @returns {Promise} an Object with two properties: 'committed' and 'snapshot'.
 */
Fireproof.prototype.transaction = function(updateFunction, onComplete, applyLocally) {

  var deferred = Fireproof._checkQ().defer(),
    self = this;

  var id = Fireproof.stats._start('transaction', self);

  self._ref.transaction(updateFunction, function(err, committed, snap) {

    Fireproof.stats._finish(id);
    snap = new Fireproof.Snapshot(snap);

    Fireproof._nextTick(function() {

      Fireproof.stats._finish(id, err);

      if (onComplete) {
        onComplete(err, committed, snap);
      }

      if (err) {
        deferred.reject(err);
      } else {

        deferred.resolve({
          committed: committed,
          snapshot: snap
        });

      }

    });

  }, applyLocally);

  return deferred.promise;

};


/**
 * Delegates Firebase#on.
 * @method Fireproof#on
 * @param {string} eventType 'value', 'child_added', 'child_changed', 'child_moved',
 * or 'child_removed'
 * @param {function} callback
 * @param {function=} cancelCallback
 * @param {object=} context
 * @returns {function} Your callback parameter wrapped in fireproofing. Use
 * this return value, not your own copy of callback, to call .off(). It also
 * functions as a promise that resolves with a {FireproofSnapshot}.
 */
Fireproof.prototype.on = function(eventType, callback, cancelCallback, context) {

  var deferred = Fireproof._checkQ().defer(),
    resolved = false,
    finished = false,
    self = this;

  var id = Fireproof.stats._start('read', self);
  Fireproof.stats._startListener(self);

  if (typeof callback !== 'function') {
    callback = function() {};
  }

  if (typeof cancelCallback !== 'function') {
    cancelCallback = function() {};
  }

  var callbackHandler = function(snap, prev) {

    if (!finished) {
      finished = true;
      Fireproof.stats._finish(id);
    }

    snap = new Fireproof.Snapshot(snap);

    Fireproof._nextTick(function() {

      callback(snap, prev);
      if (!resolved) {
        resolved = true;
        deferred.resolve(snap, prev);
      }

    });

  };

  callbackHandler.then = deferred.promise.then.bind(deferred.promise);

  self._ref.on(eventType, callbackHandler, function(err) {

    Fireproof.stats._endListener(self, err);

    Fireproof._nextTick(function() {

      cancelCallback(err);

      if (!resolved) {
        resolved = true;
        deferred.reject(err);
      }

    });

  }, context);

  return callbackHandler;

};


/**
 * Delegates Firebase#off.
 * @method Fireproof#off
 * @param {string} eventType
 * @param {function=} callback
 * @param {object=} context
 */
Fireproof.prototype.off = function(eventType, callback, context) {

  Fireproof.stats._endListener(this);
  this._ref.off(eventType, callback, context);

};


/**
 * Delegates Firebase#once.
 * @method Fireproof#once
 * @param {object} eventType 'value', 'child_added', 'child_changed', 'child_moved',
 * or 'child_removed'
 * @param {function} successCallback
 * @param {function=} failureCallback
 * @param {object=} context
 * @returns {Promise} Resolves with {FireproofSnapshot}.
 */
Fireproof.prototype.once = function(eventType, successCallback, failureCallback, context) {

  var deferred = Fireproof._checkQ().defer(),
    self = this;

  var id = Fireproof.stats._start('read', self);

  if (typeof successCallback !== 'function') {
    successCallback = function() {};
  }

  if (typeof failureCallback !== 'function') {
    failureCallback = function() {};
  }

  self._ref.once(eventType, function(snap) {

    Fireproof.stats._finish(id);
    snap = new Fireproof.Snapshot(snap);

    deferred.resolve(snap);
    Fireproof._nextTick(function() {
      successCallback(snap);
    });

  }, function(err) {

    Fireproof.stats._finish(id, err);

    deferred.reject(err);
    Fireproof._nextTick(function() {
      failureCallback(err);
    });

  }, context);

  return deferred.promise;

};



/**
 * A delegate object for Firebase's Snapshot.
 * @name FireproofSnapshot
 * @constructor
 * @global
 * @private
 * @param {Snapshot} snap The snapshot to delegate to.
 */
function FireproofSnapshot(snap) {
  this._snap = snap;
}

Fireproof.Snapshot = FireproofSnapshot;

/**
 * Delegates DataSnapshot#child.
 * @method FireproofSnapshot#child
 * @param {String} path Path of the child.
 * @returns {FireproofSnapshot} The snapshot of the child.
 */
FireproofSnapshot.prototype.child = function(path) {
  return new FireproofSnapshot(this._snap.child(path));
};


/**
 * Delegates DataSnapshot#forEach.
 * @method FireproofSnapshot#forEach
 * @param {cb} eachFn The function to call on each child.
 * @returns {Boolean} True if a callback returned true and cancelled enumeration.
 */
FireproofSnapshot.prototype.forEach = function(cb) {

  return this._snap.forEach(function(childSnap) {
    if (cb(new FireproofSnapshot(childSnap)) === true) {
      return true;
    }
  });

};


/**
 * Delegates DataSnapshot#hasChild.
 * @method FireproofSnapshot#hasChild
 * @param {cb} eachFn The function to call on each child.
 * @returns {Boolean} True if the snap has the specified child.
 */
FireproofSnapshot.prototype.hasChild = function(name) {
  return this._snap.hasChild(name);
};


/**
 * Delegates DataSnapshot#hasChildren.
 * @method FireproofSnapshot#hasChildren
 * @returns {Boolean} True if the snapshot has children.
 */
FireproofSnapshot.prototype.hasChildren = function() {
  return this._snap.hasChildren();
};


/**
 * Delegates DataSnapshot#numChildren.
 * @method FireproofSnapshot#numChildren
 * @returns {Number} The number of children the snapshot has.
 */
FireproofSnapshot.prototype.numChildren = function() {
  return this._snap.numChildren();
};


/**
 * Delegates DataSnapshot#name.
 * @method FireproofSnapshot#name
 * @returns {String} The last part of the snapshot's path.
 */
FireproofSnapshot.prototype.name = function() {
  return this._snap.name();
};


/**
 * Delegates DataSnapshot#key.
 * @method FireproofSnapshot#key
 * @returns {String} The last part of the snapshot's path.
 */
FireproofSnapshot.prototype.key = function() {
  return this._snap.key();
};


/**
 * Delegates DataSnapshot#val.
 * @method FireproofSnapshot#val
 * @returns {*} The Javascript deserialization of the snapshot.
 */
FireproofSnapshot.prototype.val = function() {
  return this._snap.val();
};


/**
 * Delegates DataSnapshot#ref.
 * @method FireproofSnapshot#ref
 * @returns {Fireproof} The Fireproof object for the snap's location.
 */
FireproofSnapshot.prototype.ref = function() {
  return new Fireproof(this._snap.ref());
};


/**
 * Delegates DataSnapshot#getPriority.
 * @method FireproofSnapshot#getPriority
 * @returns {*} The snapshot's priority.
 */
FireproofSnapshot.prototype.getPriority = function() {
  return this._snap.getPriority();
};


/**
 * Delegates DataSnapshot#exportVal.
 * @method FireproofSnapshot#exportVal
 * @returns {*} The Firebase export object of the snapshot.
 */
FireproofSnapshot.prototype.exportVal = function() {
  return this._snap.exportVal();
};


/**
 * Statistics about Firebase usage.
 * @namespace Fireproof.stats
 * @property {object} operationLog
 * @property {object} runningOperationCount
 * @property {object} operationCount
 * @property {object} listenCount
 * @static
 */
Fireproof.stats = { _eventSubscribers: {} };

/**
 * Resets the count of Firebase operations back to 0.
 * @method reset
 * @memberof Fireproof.stats
 */
Fireproof.stats.reset = function() {

  Fireproof.stats.operationLog = {};
  Fireproof.stats.runningOperationCount = 0;
  Fireproof.stats.operationCount = 0;

};


Fireproof.stats.resetListeners = function() {

  Fireproof.stats.listeners = {};
  Fireproof.stats.listenCount = 0;

};


/**
 * Records the start of a Firebase operation.
 * @private
 * @param {String} kind The kind of event (read, write, or update).
 * @param {String} ref The Fireproof ref to which the event refers.
 * @return {String} id
 */
Fireproof.stats._start = function(event, ref) {

  var path = ref.ref().toString();

  var id = Math.random().toString(36).slice(2);

  Fireproof.stats.runningOperationCount++;
  Fireproof.stats.operationLog[id] = {
    id: id,
    type: event,
    path: path,
    start: Date.now()
  };

  Fireproof.stats._emit('start', Fireproof.stats.operationLog[id]);

  if (event === 'listen') {
    Fireproof.stats.listenCount++;
  }

  return id;

};


/**
 * Records the end of a Firebase operation.
 * @private
 * @param {String} id The event ID.
 * @param {String} err Error, if any, to associate with the event.
 */
Fireproof.stats._finish = function(id, err) {

  var logEvent = Fireproof.stats.operationLog[id];

  if (!logEvent) {
    throw new Error('Fireproof: reference to unknown log event ' + id);
  }

  if (!logEvent.end) {

    Fireproof.stats.runningOperationCount--;
    Fireproof.stats.operationCount++;

    logEvent.finish = Date.now();
    logEvent.duration = logEvent.finish - logEvent.start;
    if (err) {
      logEvent.error = err;
      Fireproof.stats.errors.push(err);
    }

  }

  if (logEvent.error) {
    Fireproof.stats._emit('error', logEvent);
  } else {
    Fireproof.stats._emit('finish', logEvent);
  }

};


/**
 * Records the start of a Firebase listener.
 * @private
 * @param {Fireproof} ref
 */
 Fireproof.stats._startListener = function(ref) {

  var path = ref.ref().toString();
  if (!Fireproof.stats.listeners[path]) {
    Fireproof.stats.listeners[path] = 0;
  }

  Fireproof.stats.listeners[path]++;
  Fireproof.stats.listenCount++;

  Fireproof.stats._emit('listenStarted', path);

};


/**
 * Records the end of a Firebase listener.
 * @private
 * @param {Fireproof} ref
 * @param {String} err Error, if any, to associate with the event.
 */
 Fireproof.stats._endListener = function(ref, err) {

  var path = ref.ref().toString();
  Fireproof.stats.listeners[path]--;
  Fireproof.stats.listenCount--;

  Fireproof.stats._emit('listenEnded', path, err);

};


/**
 * Gets data about listeners on Firebase locations.
 * @method getListeners
 * @memberof Fireproof.stats
 * @returns {Object} Listener counts keyed by Firebase path.
 */
Fireproof.stats.getListeners = function() {
  return Fireproof.stats.listeners;
};


/**
 * Gets the total number of listeners on Firebase locations.
 * @method getListenerCount
 * @memberof Fireproof.stats
 * @returns {Number} The total number of Firebase listeners presently operating.
 */
Fireproof.stats.getListenerCount = function() {
  return Fireproof.stats.listenCount;
};


/**
 * Gets the per-operation, per-path counts of Firebase operations.
 * @method getPathCounts
 * @memberof Fireproof.stats
 * @returns {Object} An object with keys like "listen", "readOnce", "write",
 * and "update". Each key has an object value, of which the keys are Firebase
 * paths and the values are counts.
 */
Fireproof.stats.getPathCounts = function() {

  var result = {};

  for (var id in Fireproof.stats.operationLog) {

    var logEvent = Fireproof.stats.operationLog[id];

    if (!result[logEvent.type]) {
      result[logEvent.type] = {};
    }

    if (!result[logEvent.type][logEvent.path]) {
      result[logEvent.type][logEvent.path] = 1;
    } else {
      result[logEvent.type][logEvent.path]++;
    }

  }

  return result;

};

/**
 * Gets the per-operation counts of Firebase operations.
 * @method getCounts
 * @memberof Fireproof.stats
 * @returns {Object} An object with with keys like "read", "write",
 * and "update". The values are the counts of operations under those headings.
 */
Fireproof.stats.getCounts = function() {

  var result = {};
  for (var id in Fireproof.stats.operationLog) {

    var logEvent = Fireproof.stats.operationLog[id];
    if (!result[logEvent.type]) {
      result[logEvent.type] = 1;
    } else {
      result[logEvent.type]++;
    }

  }

  return result;

};


/**
 * Listens for Firebase events occurring.
 * @method on
 * @memberof Fireproof.stats
 * @param {String} name The name of the event. One of 'start', 'finish', 'error',
 * 'listenStarted', or 'listenEnded.'
 * @param {Function} fn The function to call when the event happens. Takes a single
 * parameter, the event object.
 * @returns {Function} fn is returned for convenience, to pass to `off`.
 * @throws if you don't pass in a function for fn.
 */
Fireproof.stats.on = function(name, fn) {

  if (typeof name === 'function' && fn === undefined) {
    fn = name;
    name = null;
  }

  if (typeof fn !== 'function') {
    throw new Error('Non-function passed to Fireproof.stats.on');
  }

  if (!Fireproof.stats._eventSubscribers[name]) {
    Fireproof.stats._eventSubscribers[name] = [];
  }

  Fireproof.stats._eventSubscribers[name].push(fn);

  return fn;

};


/**
 * Stops sending events to a listener.
 * @method off
 * @memberof Fireproof.stats
 * @param {String} [name] The name of the event. One of 'start', 'finish', 'error',
 * 'listenStarted', or 'listenEnded.'
 * @param {Function} fn The function to stop calling.
 * @throws if you don't pass in a function for fn.
 */
Fireproof.stats.off = function(name, fn) {

  if (typeof name === 'function' && fn === undefined) {
    fn = name;
    name = null;
  }

  if (typeof fn !== 'function') {
    throw new Error('Non-function passed to Fireproof.stats.off');
  }

  if (name) {

    var listeners = Fireproof.stats._eventSubscribers[name],
      index = listeners.indexOf(fn);

    if (index !== -1) {
      listeners[index] = null;
    }

  }

};


Fireproof.stats._emit = function(name) {

  var args = Array.prototype.slice.call(arguments, 1);

  if (!Fireproof.stats._eventSubscribers[name]) {
    Fireproof.stats._eventSubscribers[name] = [];
  }

  var listeners = Fireproof.stats._eventSubscribers[name];

  Fireproof._nextTick(function() {

    for (var i = 0; i < listeners.length; i++) {

      if (listeners[i] !== null) {
        listeners[i].apply(null, args);
      }

    }

  });

};

Fireproof.stats.reset();
Fireproof.stats.resetListeners();


/**
 * Delegates Firebase#createUser.
 * @method Fireproof#createUser
 * @param {Object} credentials
 * @param {Function} [onComplete]
 * @returns {Promise}
 */
Fireproof.prototype.createUser = function(credentials, onComplete) {

  var oc = Fireproof._handleError(onComplete);
  this._ref.createUser(credentials, oc);
  return oc.promise;

};


/**
 * Delegates Firebase#changePassword.
 * @method Fireproof#changePassword
 * @param {Object} credentials
 * @param {Function} [onComplete]
 * @returns {Promise}
 */
Fireproof.prototype.changePassword = function(credentials, onComplete) {

  var oc = Fireproof._handleError(onComplete);
  this._ref.changePassword(credentials, oc);
  return oc.promise;

};


/**
 * Delegates Firebase#resetPassword.
 * @method Fireproof#resetPassword
 * @param {Object} credentials
 * @param {Function} [onComplete]
 * @returns {Promise}
 */
Fireproof.prototype.resetPassword = function(credentials, onComplete) {

  var oc = Fireproof._handleError(onComplete);
  this._ref.resetPassword(credentials, oc);
  return oc.promise;

};


/**
 * Delegates Firebase#removeUser.
 * @method Fireproof#createUser
 * @param {Object} credentials
 * @param {Function} [onComplete]
 * @returns {Promise}
 */
Fireproof.prototype.removeUser = function(credentials, onComplete) {

  var oc = Fireproof._handleError(onComplete);
  this._ref.removeUser(credentials, oc);
  return oc.promise;

};


/**
 * Delegates Firebase#set.
 * @method Fireproof#set
 * @param {object} value The value to set this path to.
 * @param {function=} onComplete Callback when the operation is done.
 * @returns {Promise}
 * @example
 * ```js
 * fireproofRef.set('something')
 * .then(function()) {
 *   console.log('set was successful!');
 * }, function(err) {
 *   console.error('error while setting:', err);
 * });
 * ```
 */
Fireproof.prototype.set = function(value, onComplete) {

  var handler = Fireproof._handleError(onComplete);

  handler.id = Fireproof.stats._start('write', this);
  this._ref.set(value, handler);

  return handler.promise;

};


/**
 * Delegates Firebase#update.
 * @method Fireproof#update
 * @param {object} value An object with keys and values to update.
 * @param {function=} onComplete Callback when the operation is done.
 * @returns {Promise}
 */
Fireproof.prototype.update = function(value, onComplete) {

  var handler = Fireproof._handleError(onComplete);

  handler.id = Fireproof.stats._start('update', this);
  this._ref.update(value, handler);

  return handler.promise;

};


/**
 * Delegates Firebase#remove.
 * @method Fireproof#remove
 * @param {function=} onComplete Callback when the operation is done.
 * @returns {Promise}
 */
Fireproof.prototype.remove = function(onComplete) {

  var handler = Fireproof._handleError(onComplete);

  handler.id = Fireproof.stats._start('write', this);
  this._ref.remove(handler);

  return handler.promise;

};


/**
 * Delegates Firebase#push.
 * @method Fireproof#push
 * @param {object} value An object with keys and values to update.
 * @param {function=} onComplete Callback when the operation is done.
 * @returns {Promise}
 */
Fireproof.prototype.push = function(value, onComplete) {

  var handler = Fireproof._handleError(onComplete);

  handler.id = Fireproof.stats._start('write', this);

  var rv = new Fireproof(
    this._ref.push(value, handler),
    handler.promise
  );

  return rv;

};


/**
 * Delegates Firebase#setWithPriority.
 * @method Fireproof#setWithPriority
 * @param {object} value The value to set this path to.
 * @param {object} priority The priority to set this path to.
 * @param {function=} onComplete Callback when the operation is done.
 * @returns {Promise}
 */
Fireproof.prototype.setWithPriority = function(value, priority, onComplete) {

  var handler = Fireproof._handleError(onComplete);

  handler.id = Fireproof.stats._start('write', this);
  this._ref.setWithPriority(value, priority, handler);

  return handler.promise;

};


/**
 * Delegates Firebase#setPriority.
 * @method Fireproof#setPriority
 * @param {object} priority The priority to set this path to.
 * @param {function=} onComplete Callback when the operation is done.
 * @returns {Promise}
 */
Fireproof.prototype.setPriority = function(priority, onComplete) {

  var handler = Fireproof._handleError(onComplete);

  handler.id = Fireproof.stats._start('write', this);
  this._ref.setPriority(priority, handler);

  return handler.promise;

};



  return Fireproof;

}));
