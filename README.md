
fireproof
=========

A library with some useful utilities for Firebase.

## LiveArray

An object encapsulating arrays that keeps their members in sync with a Firebase location's children. The three array references, `keys`, `values`, and `priorities`, are guaranteed to persist for the lifetime of the array. In other words, the arrays themselves are constant; only their contents are mutable. This is highly useful behavior for dirty-checking environments like Angular.js.

Note that changes to the array are not propagated to Firebase.

Usage example:

```js
var Firebase = require('firebase');
var Fireproof = require('fireproof');

var stooges = new Fireproof.LiveArray(function(err) {
  console.error('Hmm, Firebase disconnected with this error: ' + err.message);
});

users.connect(new Firebase('https://my-firebase.firebaseio.com/stooges'));

// some time in the future...
console.log(users.keys);
[
  'larry',
  'curly',
  'moe'
]

console.log(users.values);
[{
  name: 'Curly Howard',
  catchphrase: 'Nyuk-nyuk-nyuk!'
}, {
  name: 'Larry Fine',
  occupation: 'Violinist'
}, {
  name: 'Moe Howard',
  haircut: 'bowl'
}]

console.log(users.priorities);
[1,2,3]

users.disconnect();

```
JSDocs are inline.

## Pager

A helper object for paging over Firebase data.

## Demux

A helper object for retrieving sorted Firebase objects from multiple locations.

## Promise support now deprecated

[Firebase 2.4.0](https://www.firebase.com/docs/web/changelog.html) returns Promises without any need for extra help. Hooray!

![A celebratory .gif of Sonic the Hedgehog running forever with a rainbow trailing from his butt.](http://30.media.tumblr.com/tumblr_lvyx3aVWsS1qcmpuao1_500.gif)

Thanks so much for all your help guys.

## Installation
```bash
npm install --save fireproof
```

## Usage

See the API documentation [here.](https://github.com/casetext/fireproof/blob/master/api.md)

The bottom line is this: all Firebase methods are reproduced on a Fireproof object.

By default, Fireproof uses the built-in Promise constructor, which is available in Node > 0.12 and many modern web browsers. You can override this behavior by providing a standards-compliant Promise constructor on Fireproof's constructor, like so:

```js
Fireproof.Promise = require('bluebird');
```

You can also choose to "bless" Fireproof with a promise library that follows the deferral model:

```js
Fireproof.bless(require('Q'));
```

If a Promise constructor is not supplied and none exists natively, Fireproof will explode spectacularly.

- If the corresponding Firebase method has no return value but does something asynchronously, Fireproof returns a promise that fulfills if the interaction succeeds and rejects if an error occurs. This is true of, e.g., ```transaction()```, ```auth()```, ```set()```, ```update()```, ```remove()```, and ```once()```.

- For ```on()```, Firebase returns the callback method that you passed in. Fireproof returns your _wrapped_ callback method with an extra method, ```then()```, attached. So the callback is effectively a promise!

- For ```push()```, Firebase returns the reference to the new child. Fireproof does the same, but the reference is also a promise that resolves if the push
succeeds and rejects if the push fails.

- All Fireproof objects are themselves promises. Except for the case of
```push()``` mentioned above, their then() is a shortcut for
```fp.once('value')```. This means you can get the value of any Fireproof object
at any time just by treating it as a promise!

```javascript
var Fireproof = require('fireproof'),
  Firebase = require('firebase');

var firebase = new Firebase('https://test.firebaseio.com/thing'),
  fireproof = new Fireproof(firebase);

fireproof.auth('my_auth_token').then(function() {
  console.log('Successfully authenticated.')
}, function(err) {
  console.error('Error authenticating to Firebase!');
})
```

## Support

IE back to 9.

