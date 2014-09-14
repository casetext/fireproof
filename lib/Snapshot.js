
'use strict';

var Fireproof = require('./Fireproof');

function FireproofSnapshot(snap) {
  this._snap = snap;
}


FireproofSnapshot.prototype.child = function(path) {
  return new FireproofSnapshot(this._snap.child(path));
};


FireproofSnapshot.prototype.forEach = function(cb) {

  return this._snap.forEach(function(childSnap) {
    if (cb(new FireproofSnapshot(childSnap)) === true) {
      return true;
    }
  });

};


FireproofSnapshot.prototype.hasChild = function() {
  return this._snap.hasChild.apply(this._snap, arguments);
};


FireproofSnapshot.prototype.hasChildren = function() {
  return this._snap.hasChildren.apply(this._snap, arguments);
};


FireproofSnapshot.prototype.numChildren = function() {
  return this._snap.numChildren();
};


FireproofSnapshot.prototype.name = function() {
  return this._snap.name.apply(this._snap, arguments);
};


FireproofSnapshot.prototype.val = function() {
  return this._snap.val();
};


FireproofSnapshot.prototype.ref = function() {
  return new Fireproof(this._snap.ref());
};


FireproofSnapshot.prototype.getPriority = function() {
  return this._snap.getPriority();
};


FireproofSnapshot.prototype.exportVal = function() {
  return this._snap.exportVal();
};


Fireproof.Snapshot = FireproofSnapshot;
module.exports = FireproofSnapshot;
