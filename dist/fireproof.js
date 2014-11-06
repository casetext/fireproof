
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
}(this, function () {

  
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


Fireproof._nextTick = function(fn) {

  if (process && process.nextTick) {
    process.nextTick(fn);
  } else {
    setTimeout(fn, 0);
  }

};


Fireproof._handleError = function(onComplete) {

  var deferred = Fireproof._checkQ().defer();

  var rv = function(err, val) {

    if (onComplete && typeof onComplete === 'function') {

      Fireproof._nextTick(function() {
        onComplete(err);
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
 * Delegates Firebase#toString.
 * @method Fireproof#toString
 * @returns {string} The full URL of this reference object.
 */
Fireproof.prototype.toString = function() {
  return this._ref.toString();
};

module.exports = Fireproof;


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
 * @param {boolean} [limit] Whether to use "limit" to restrict the length
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
      name: null,
      priority: null
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

        var newRef = ref.startAt(
          self._positions[ref.ref().toString()].priority,
          self._positions[ref.ref().toString()].name || undefined);

        if (self._limit) {
          return newRef.limit(count - self._buffer.length);
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
      if (position.priority !== child.getPriority() || position.name !== child.name()) {
        acc.push(child);
        position.priority = child.getPriority();
        position.name = child.name();
      }

    });

    return acc;

  }, []);

  self._buffer = self._buffer.concat(allResults).sort(function(a, b) {

    // sort by priority and name if the priorities are identical.
    // See the Firebase docs for more information.
    var aPriority = a.getPriority(),
      bPriority = b.getPriority(),
      aName = a.name(),
      bName = b.name();

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
 * Delegates Firebase#limit.
 * @method Fireproof#limit
 * @param {Number} limit
 * @returns {Fireproof}
 */
Fireproof.prototype.limit = function(limit) {
  return new Fireproof(this._ref.limit(limit));
};


/**
 * Delegates Firebase#startAt.
 * @method Fireproof#startAt
 * @param {object} priority
 * @param {string} name
 * @returns {Fireproof}
 */
Fireproof.prototype.startAt = function(priority, name) {
  return new Fireproof(this._ref.startAt(priority, name));
};


/**
 * Delegates Firebase#endAt.
 * @method Fireproof#endAt
 * @param {object} priority
 * @param {string} name
 * @returns {Fireproof}
 */
Fireproof.prototype.endAt = function(priority, name) {
  return new Fireproof(this._ref.endAt(priority, name));
};


/**
 * Delegates Firebase#equalTo.
 * @method Fireproof#equalTo
 * @param {object} priority
 * @param {string} name
 * @returns {Fireproof}
 */
Fireproof.prototype.equalTo = function(priority, name) {
  return new Fireproof(this._ref.equalTo(priority, name));
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

  Fireproof.stats._addListener(self.toString());

  self._ref.transaction(updateFunction, function(err, committed, snap) {

    Fireproof.stats._record('read', self.toString());
    snap = new Fireproof.Snapshot(snap);

    Fireproof._nextTick(function() {

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
    self = this;

  Fireproof.stats._addListener(self.toString());

  if (typeof callback !== 'function') {
    callback = function() {};
  }

  if (typeof cancelCallback !== 'function') {
    cancelCallback = function() {};
  }

  var callbackHandler = function(snap, prev) {

    Fireproof.stats._record('read', self.toString());
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

    Fireproof.stats._removeListener(self.toString());

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

  Fireproof.stats._removeListener(this.toString());
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

  Fireproof.stats._addListener(self.toString());

  if (typeof successCallback !== 'function') {
    successCallback = function() {};
  }

  if (typeof failureCallback !== 'function') {
    failureCallback = function() {};
  }

  self._ref.once(eventType, function(snap) {

    Fireproof.stats._removeListener(self.toString());
    Fireproof.stats._record('read', self.toString());
    snap = new Fireproof.Snapshot(snap);

    deferred.resolve(snap);
    Fireproof._nextTick(function() {
      successCallback(snap);
    });

  }, function(err) {

    Fireproof.stats._removeListener(self.toString());
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
 * @property {object} events
 * @property {object} listeners
 * @static
 */
Fireproof.stats = { };

/**
 * Resets the count of Firebase operations back to 0.
 * @method reset
 * @memberof Fireproof.stats
 */
Fireproof.stats.reset = function() {

  Fireproof.stats.events = {

    read: [],
    write: [],
    update: []

  };

};


/**
 * Resets the count of Firebase listeners back to 0.
 * @method resetListeners
 * @memberof Fireproof.stats
 */
Fireproof.stats.resetListeners = function() {
  Fireproof.stats.listeners = {};
};

/**
 * Records a Firebase operation.
 * @private
 * @param {String} kind The kind of event (read, write, or update).
 * @param {String} path The Firebase path to the event.
 */
Fireproof.stats._record = function(name, path) {
  Fireproof.stats.events[name].push({ path: path, time: Date.now() });
};


/**
 * Adds a Firebase listener.
 * @private
 * @param {String} path The Firebase path of the listener.
 */
Fireproof.stats._addListener = function(path) {

  if (!Fireproof.stats.listeners[path]) {
    Fireproof.stats.listeners[path] = 1;
  } else {
    Fireproof.stats.listeners[path]++;
  }

};


/**
 * Removes a Firebase listener.
 * @private
 * @param {String} path The Firebase path of the listener.
 */
Fireproof.stats._removeListener = function(path) {

  if (Fireproof.stats.listeners[path] === 1) {
    delete Fireproof.stats.listeners[path];
  } else if (Fireproof.stats.listeners[path]) {
    Fireproof.stats.listeners[path]--;
  }

};


/**
 * Gets data about listeners on Firebase locations.
 * @method getListeners
 * @memberof Fireproof.stats
 * @returns {Object} Listener counts keyed by Firebase path.
 */
Fireproof.stats.getListeners = function() {

  return Object.keys(Fireproof.stats.listeners)
  .reduce(function(acc, k) {

    acc[k] = Fireproof.stats.listeners[k];
    return acc;

  }, {});

};


/**
 * Gets the total number of listeners on Firebase locations.
 * @method getListenerCount
 * @memberof Fireproof.stats
 * @returns {Number} The total number of Firebase listeners presently operating.
 */
Fireproof.stats.getListenerCount = function() {

  return Object.keys(Fireproof.stats.listeners)
  .reduce(function(acc, k) {
    return acc + Fireproof.stats.listeners[k];
  }, 0);

};

/**
 * Gets the per-operation, per-path counts of Firebase operations.
 * @method getPathCounts
 * @memberof Fireproof.stats
 * @returns {Object} An object with three keys: "read", "write",
 * and "update". Each key has an object value, of which the keys are Firebase
 * paths and the values are counts.
 */
Fireproof.stats.getPathCounts = function() {

  return Object.keys(Fireproof.stats.events)
  .reduce(function(result, statName) {

    result[statName] = Fireproof.stats.events[statName]
    .reduce(function(acc, datum) {

      if (acc[datum.path]) {
        acc[datum.path]++;
      } else {
        acc[datum.path] = 1;
      }

      return acc;

    }, {});

    return result;

  }, {});

};

/**
 * Gets the per-operation counts of Firebase operations.
 * @method getCounts
 * @memberof Fireproof.stats
 * @returns {Object} An object with three keys: "read", "write", and
 * "update". The values are the counts of operations under those headings.
 */
Fireproof.stats.getCounts = function() {

  return Object.keys(Fireproof.stats.events)
  .reduce(function(result, statName) {

    result[statName] = Fireproof.stats.events[statName].length;
    return result;

  }, {});

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

  Fireproof.stats._record('write', this.toString());
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

  Fireproof.stats._record('update', this.toString());
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

  Fireproof.stats._record('write', this.toString());
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

  Fireproof.stats._record('write', this.toString());

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

  Fireproof.stats._record('write', this.toString());
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

  Fireproof.stats._record('write', this.toString());
  this._ref.setPriority(priority, handler);

  return handler.promise;

};



  Fireproof.Demux = Demux;
  return Fireproof;

}));
