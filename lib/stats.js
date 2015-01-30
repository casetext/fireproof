
/**
 * Statistics about Firebase usage.
 * @namespace Fireproof.stats
 * @property {Object} operationLog
 * @property {Number} runningOperationCount
 * @property {Number} operationCount
 * @property {Number} listenCount
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
