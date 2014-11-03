
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