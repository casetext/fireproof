
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
 * Delegates Firebase#orderByValue.
 * @method Fireproof#orderByValue
 * @returns {Fireproof}
 */
Fireproof.prototype.orderByValue = function() {
  return new Fireproof(this._ref.orderByValue());
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
