
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
