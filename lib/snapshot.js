
'use strict';


module.exports = function(Fireproof) {


  function FireproofSnapshot(snap) {
    this._snap = snap;
  }


  /**
   * Delegates DataSnapshot#child.
   * @method DataSnapshot#child
   * @param {String} path Path of the child.
   * @returns {FireproofSnapshot} The snapshot of the child.
   */
  FireproofSnapshot.prototype.child = function(path) {
    return new FireproofSnapshot(this._snap.child(path));
  };


  /**
   * Delegates DataSnapshot#forEach.
   * @method DataSnapshot#forEach
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
   * @method DataSnapshot#hasChild
   * @param {cb} eachFn The function to call on each child.
   * @returns {Boolean} True if the snap has the specified child.
   */
  FireproofSnapshot.prototype.hasChild = function(name) {
    return this._snap.hasChild(name);
  };


  /**
   * Delegates DataSnapshot#hasChildren.
   * @method DataSnapshot#hasChildren
   * @returns {Boolean} True if the snapshot has children.
   */
  FireproofSnapshot.prototype.hasChildren = function() {
    return this._snap.hasChildren();
  };


  /**
   * Delegates DataSnapshot#numChildren.
   * @method DataSnapshot#numChildren
   * @returns {Number} The number of children the snapshot has.
   */
  FireproofSnapshot.prototype.numChildren = function() {
    return this._snap.numChildren();
  };


  /**
   * Delegates DataSnapshot#name.
   * @method DataSnapshot#name
   * @returns {String} The last part of the snapshot's path.
   */
  FireproofSnapshot.prototype.name = function() {
    return this._snap.name();
  };


  /**
   * Delegates DataSnapshot#val.
   * @method DataSnapshot#val
   * @returns {*} The Javascript deserialization of the snapshot.
   */
  FireproofSnapshot.prototype.val = function() {
    return this._snap.val();
  };


  /**
   * Delegates DataSnapshot#ref.
   * @method DataSnapshot#ref
   * @returns {Fireproof} The Fireproof object for the snap's location.
   */
  FireproofSnapshot.prototype.ref = function() {
    return new Fireproof(this._snap.ref());
  };


  /**
   * Delegates DataSnapshot#getPriority.
   * @method DataSnapshot#getPriority
   * @returns {*} The snapshot's priority.
   */
  FireproofSnapshot.prototype.getPriority = function() {
    return this._snap.getPriority();
  };


  /**
   * Delegates DataSnapshot#exportVal.
   * @method DataSnapshot#exportVal
   * @returns {*} The Firebase export object of the snapshot.
   */
  FireproofSnapshot.prototype.exportVal = function() {
    return this._snap.exportVal();
  };

  Fireproof.Snapshot = FireproofSnapshot;

};