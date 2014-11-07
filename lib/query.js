
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
 * @param {string | number} value
 * @param {string} key
 * @returns {Fireproof}
 */
Fireproof.prototype.startAt = function(value, key) {
  return new Fireproof(this._ref.startAt(value, key));
};


/**
 * Delegates Firebase#endAt.
 * @method Fireproof#endAt
 * @param {string | number} value
 * @param {string} name
 * @returns {Fireproof}
 */
Fireproof.prototype.endAt = function(value, key) {
  return new Fireproof(this._ref.endAt(value, key));
};


/**
 * Delegates Firebase#equalTo.
 * @method Fireproof#equalTo
 * @param {string | number} value
 * @param {string} name
 * @returns {Fireproof}
 */
Fireproof.prototype.equalTo = function(value, key) {
  return new Fireproof(this._ref.equalTo(value, key));
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
 * Delegates Firebase#orderByChild.
 * @method Fireproof#orderByChild
 * @param {string} child The child to order by.
 * @returns {Fireproof}
 */
Fireproof.prototype.orderByChild = function(child) {
  return new Fireproof(this._ref.orderByChild(child));
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
 * Delegates Firebase#limitToFirst.
 * @method Fireproof#limitToFirst
 * @param {number} limit
 * @returns {Fireproof}
 */
Fireproof.prototype.limitToFirst = function(limit) {
  return new Fireproof(this._ref.limitToFirst(limit));
};


/**
 * Delegates Firebase#limitToLast.
 * @method Fireproof#limitToLast
 * @param {number} limit
 * @returns {Fireproof}
 */
Fireproof.prototype.limitToLast = function(limit) {
  return new Fireproof(this._ref.limitToLast(limit));
};


/**
 * Delegates Firebase#equalTo.
 * @method Fireproof#equalTo
 * @param {string | number | null} value
 * @param {string} key
 * @returns {Fireproof}
 */
Fireproof.prototype.equalTo = function(value, key) {

  if (key !== undefined) {
    return new Fireproof(this._ref.equalTo(value, key));
  } else {
    return new Fireproof(this._ref.equalTo(value));
  }

};

