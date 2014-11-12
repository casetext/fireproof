
function Pager(ref) {

  this._positions = [];
  this._mainRef = ref;
  this.ref = ref;

}


Pager.prototype._handleResults = function(snap) {

  var self = this,
    objects = [];

  snap.forEach(function(child) {

    var childIsStartAt = (child.getPriority() === self._startAt.priority &&
      child.name() === self._startAt.name);

    // if this child is the "catch" object, don't include it in the results
    if (!(self._positions.length > 0 && childIsStartAt)) {

      objects.push(child);
      self._lastPosition = { priority: child.getPriority(), key: child.name() };

    }

  });

  return objects;

};


Pager.prototype.next = function() {

  var self = this,
    oldStartAt = self._startAt;

  this._startAt = self._lastPosition;
  this._rebuildRef();

  return this.ref.once('value')
  .then(function(snap) {

    self._positions.push(oldStartAt);
    return snap;

  })
  .then(this._handleResults.bind(this));

};


Pager.prototype.previous = function() {

  if (this._positions.length > 0) {

    this._startAt = this._positions.pop();
    this._rebuildRef();

  }

  return this.ref.once('value')
  .then(this._handleResults.bind(this));

};


Pager.prototype.limit = function(limit) {

  if (arguments.length > 0) {

    this._limit = limit;
    this._rebuildRef();

  }

  return this._limit;

};


Pager.prototype.startAt = function(priority, key) {

  if (arguments.length > 0) {

    this._startAt = { priority: priority };

    if (typeof key === 'string') {
      this._startAt.key = key;
    }

    this._rebuildRef();

  }

  return this._startAt;

};


Pager.prototype.endAt = function(priority, key) {

  if (arguments.length > 0) {

    this._endAt = { priority: priority };

    if (typeof key === 'string') {
      this._endAt.key = key;
    }

    this._rebuildRef();

  }

  return this._endAt;

};


Pager.prototype._rebuildRef = function() {

  this.ref = this._mainRef;

  if (this._startAt) {

    if (this._startAt.key) {
      this.ref = this.ref.startAt(this._startAt.priority, this._startAt.key);
    } else {
      this.ref = this.ref.startAt(this._startAt.priority);
    }

  }

  if (this._endAt) {

    if (this._endAt.key) {
      this.ref = this.ref.endAt(this._endAt.priority, this._endAt.key);
    } else {
      this.ref = this.ref.endAt(this._endAt.priority);
    }

  }

  if (this._limit) {
    this.ref = this.ref.limit(this._limit + 1);
  }

};


Fireproof.Pager = Pager;
