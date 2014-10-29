
'use strict';

module.exports = function(Fireproof) {

  Fireproof.stats = {};

  /**
   * Resets the count of Firebase operations back to 0.
   * @method Fireproof.stats.reset
   */
  Fireproof.stats.reset = function() {

    Fireproof.stats.events = {

      read: [],
      write: [],
      update: []

    };

  };

  /**
   * Records a Firebase operation.
   * @private
   * @method Fireproof.stats._record
   * @param {String} kind The kind of event (read, write, or update).
   * @param {String} path The Firebase path to the event.
   */
  Fireproof.stats._record = function(name, path) {
    Fireproof.stats.events[name].push({ path: path, time: Date.now() });
  };

  /**
   * Gets the per-operation, per-path counts of Firebase operations.
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
   * @returns {Object} An object with four keys: "read", "write", and
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

};
