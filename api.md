#Index

**Classes**

* [class: Fireproof](#Fireproof)
  * [new Fireproof(firebaseRef)](#new_Fireproof)
  * [Fireproof.setNextTick(nextTick)](#Fireproof.setNextTick)
  * [Fireproof.bless(Q)](#Fireproof.bless)
  * [fireproof.auth(authToken, [onComplete], [onCancel])](#Fireproof#auth)
  * [fireproof.child(childPath)](#Fireproof#child)
  * [fireproof.parent()](#Fireproof#parent)
  * [fireproof.root()](#Fireproof#root)
  * [fireproof.toFirebase()](#Fireproof#toFirebase)
  * [fireproof.name()](#Fireproof#name)
  * [fireproof.key()](#Fireproof#key)
  * [fireproof.toString()](#Fireproof#toString)
  * [fireproof.authWithCustomToken(authToken, [onComplete], [options])](#Fireproof#authWithCustomToken)
  * [fireproof.authAnonymously([onComplete], [options])](#Fireproof#authAnonymously)
  * [fireproof.authWithPassword(credentials, [onComplete], [options])](#Fireproof#authWithPassword)
  * [fireproof.authWithOAuthPopup(provider, [onComplete], [options])](#Fireproof#authWithOAuthPopup)
  * [fireproof.authWithOAuthRedirect(provider, [onComplete], [options])](#Fireproof#authWithOAuthRedirect)
  * [fireproof.authWithOAuthPopup(provider, credentials, [onComplete], [options])](#Fireproof#authWithOAuthPopup)
  * [fireproof.getAuth()](#Fireproof#getAuth)
  * [fireproof.onAuth(onComplete, [context])](#Fireproof#onAuth)
  * [fireproof.offAuth(onComplete, [context])](#Fireproof#offAuth)
  * [fireproof.unauth()](#Fireproof#unauth)
  * [fireproof.onDisconnect()](#Fireproof#onDisconnect)
    * [onDisconnect.cancel([callback])](#Fireproof#onDisconnect#cancel)
    * [onDisconnect.remove([callback])](#Fireproof#onDisconnect#remove)
    * [onDisconnect.set(value, [callback])](#Fireproof#onDisconnect#set)
    * [onDisconnect.setWithPriority(value, priority, [callback])](#Fireproof#onDisconnect#setWithPriority)
    * [onDisconnect.update(value, [callback])](#Fireproof#onDisconnect#update)
  * [fireproof.limit(limit)](#Fireproof#limit)
  * [fireproof.limitToFirst(limit)](#Fireproof#limitToFirst)
  * [fireproof.limitToLast(limit)](#Fireproof#limitToLast)
  * [fireproof.orderByChild(key)](#Fireproof#orderByChild)
  * [fireproof.orderByKey()](#Fireproof#orderByKey)
  * [fireproof.orderByPriority()](#Fireproof#orderByPriority)
  * [fireproof.equalTo(value, [key])](#Fireproof#equalTo)
  * [fireproof.startAt(value, [key])](#Fireproof#startAt)
  * [fireproof.endAt(value, [key])](#Fireproof#endAt)
  * [fireproof.ref()](#Fireproof#ref)
  * [fireproof.transaction(updateFunction, onComplete, [applyLocally])](#Fireproof#transaction)
  * [fireproof.on(eventType, callback, [cancelCallback], [context])](#Fireproof#on)
  * [fireproof.off(eventType, [callback], [context])](#Fireproof#off)
  * [fireproof.once(eventType, successCallback, [failureCallback], [context])](#Fireproof#once)
  * [fireproof.createUser(credentials, [onComplete])](#Fireproof#createUser)
  * [fireproof.changeEmail(credentials, [onComplete])](#Fireproof#changeEmail)
  * [fireproof.changePassword(credentials, [onComplete])](#Fireproof#changePassword)
  * [fireproof.resetPassword(credentials, [onComplete])](#Fireproof#resetPassword)
  * [fireproof.createUser(credentials, [onComplete])](#Fireproof#createUser)
  * [fireproof.set(value, [onComplete])](#Fireproof#set)
  * [fireproof.update(value, [onComplete])](#Fireproof#update)
  * [fireproof.remove([onComplete])](#Fireproof#remove)
  * [fireproof.push(value, [onComplete])](#Fireproof#push)
  * [fireproof.setWithPriority(value, priority, [onComplete])](#Fireproof#setWithPriority)
  * [fireproof.setPriority(priority, [onComplete])](#Fireproof#setPriority)
  * [Fireproof.stats](#Fireproof.stats)
    * [stats.reset()](#Fireproof.stats.reset)
    * [stats.getListeners()](#Fireproof.stats.getListeners)
    * [stats.getListenerCount()](#Fireproof.stats.getListenerCount)
    * [stats.getPathCounts()](#Fireproof.stats.getPathCounts)
    * [stats.getCounts()](#Fireproof.stats.getCounts)
    * [stats.on(name, fn)](#Fireproof.stats.on)
    * [stats.off([name], fn)](#Fireproof.stats.off)
  * [class: Fireproof.Demux](#Fireproof.Demux)
    * [new Fireproof.Demux(refs, [limitToFirst])](#new_Fireproof.Demux)
    * [demux.get(count)](#Fireproof.Demux#get)
  * [class: Fireproof.LiveArray](#Fireproof.LiveArray)
    * [new Fireproof.LiveArray([errorHandler])](#new_Fireproof.LiveArray)
    * [liveArray.connect([ref], [sortMode], [sortProperty])](#Fireproof.LiveArray#connect)
    * [liveArray.disconnect()](#Fireproof.LiveArray#disconnect)
  * [class: Fireproof.Pager](#Fireproof.Pager)
    * [new Fireproof.Pager(ref, [initialCount])](#new_Fireproof.Pager)
    * [pager.next(count)](#Fireproof.Pager#next)
    * [pager.previous(count)](#Fireproof.Pager#previous)
* [class: FireproofSnapshot](#FireproofSnapshot)
  * [new FireproofSnapshot(snap)](#new_FireproofSnapshot)
  * [fireproofSnapshot.child(path)](#FireproofSnapshot#child)
  * [fireproofSnapshot.forEach(eachFn)](#FireproofSnapshot#forEach)
  * [fireproofSnapshot.hasChild(eachFn)](#FireproofSnapshot#hasChild)
  * [fireproofSnapshot.hasChildren()](#FireproofSnapshot#hasChildren)
  * [fireproofSnapshot.numChildren()](#FireproofSnapshot#numChildren)
  * [fireproofSnapshot.name()](#FireproofSnapshot#name)
  * [fireproofSnapshot.key()](#FireproofSnapshot#key)
  * [fireproofSnapshot.val()](#FireproofSnapshot#val)
  * [fireproofSnapshot.ref()](#FireproofSnapshot#ref)
  * [fireproofSnapshot.getPriority()](#FireproofSnapshot#getPriority)
  * [fireproofSnapshot.exportVal()](#FireproofSnapshot#exportVal)
 
<a name="Fireproof"></a>
#class: Fireproof
**Members**

* [class: Fireproof](#Fireproof)
  * [new Fireproof(firebaseRef)](#new_Fireproof)
  * [Fireproof.setNextTick(nextTick)](#Fireproof.setNextTick)
  * [Fireproof.bless(Q)](#Fireproof.bless)
  * [fireproof.auth(authToken, [onComplete], [onCancel])](#Fireproof#auth)
  * [fireproof.child(childPath)](#Fireproof#child)
  * [fireproof.parent()](#Fireproof#parent)
  * [fireproof.root()](#Fireproof#root)
  * [fireproof.toFirebase()](#Fireproof#toFirebase)
  * [fireproof.name()](#Fireproof#name)
  * [fireproof.key()](#Fireproof#key)
  * [fireproof.toString()](#Fireproof#toString)
  * [fireproof.authWithCustomToken(authToken, [onComplete], [options])](#Fireproof#authWithCustomToken)
  * [fireproof.authAnonymously([onComplete], [options])](#Fireproof#authAnonymously)
  * [fireproof.authWithPassword(credentials, [onComplete], [options])](#Fireproof#authWithPassword)
  * [fireproof.authWithOAuthPopup(provider, [onComplete], [options])](#Fireproof#authWithOAuthPopup)
  * [fireproof.authWithOAuthRedirect(provider, [onComplete], [options])](#Fireproof#authWithOAuthRedirect)
  * [fireproof.authWithOAuthPopup(provider, credentials, [onComplete], [options])](#Fireproof#authWithOAuthPopup)
  * [fireproof.getAuth()](#Fireproof#getAuth)
  * [fireproof.onAuth(onComplete, [context])](#Fireproof#onAuth)
  * [fireproof.offAuth(onComplete, [context])](#Fireproof#offAuth)
  * [fireproof.unauth()](#Fireproof#unauth)
  * [fireproof.onDisconnect()](#Fireproof#onDisconnect)
    * [onDisconnect.cancel([callback])](#Fireproof#onDisconnect#cancel)
    * [onDisconnect.remove([callback])](#Fireproof#onDisconnect#remove)
    * [onDisconnect.set(value, [callback])](#Fireproof#onDisconnect#set)
    * [onDisconnect.setWithPriority(value, priority, [callback])](#Fireproof#onDisconnect#setWithPriority)
    * [onDisconnect.update(value, [callback])](#Fireproof#onDisconnect#update)
  * [fireproof.limit(limit)](#Fireproof#limit)
  * [fireproof.limitToFirst(limit)](#Fireproof#limitToFirst)
  * [fireproof.limitToLast(limit)](#Fireproof#limitToLast)
  * [fireproof.orderByChild(key)](#Fireproof#orderByChild)
  * [fireproof.orderByKey()](#Fireproof#orderByKey)
  * [fireproof.orderByPriority()](#Fireproof#orderByPriority)
  * [fireproof.equalTo(value, [key])](#Fireproof#equalTo)
  * [fireproof.startAt(value, [key])](#Fireproof#startAt)
  * [fireproof.endAt(value, [key])](#Fireproof#endAt)
  * [fireproof.ref()](#Fireproof#ref)
  * [fireproof.transaction(updateFunction, onComplete, [applyLocally])](#Fireproof#transaction)
  * [fireproof.on(eventType, callback, [cancelCallback], [context])](#Fireproof#on)
  * [fireproof.off(eventType, [callback], [context])](#Fireproof#off)
  * [fireproof.once(eventType, successCallback, [failureCallback], [context])](#Fireproof#once)
  * [fireproof.createUser(credentials, [onComplete])](#Fireproof#createUser)
  * [fireproof.changeEmail(credentials, [onComplete])](#Fireproof#changeEmail)
  * [fireproof.changePassword(credentials, [onComplete])](#Fireproof#changePassword)
  * [fireproof.resetPassword(credentials, [onComplete])](#Fireproof#resetPassword)
  * [fireproof.createUser(credentials, [onComplete])](#Fireproof#createUser)
  * [fireproof.set(value, [onComplete])](#Fireproof#set)
  * [fireproof.update(value, [onComplete])](#Fireproof#update)
  * [fireproof.remove([onComplete])](#Fireproof#remove)
  * [fireproof.push(value, [onComplete])](#Fireproof#push)
  * [fireproof.setWithPriority(value, priority, [onComplete])](#Fireproof#setWithPriority)
  * [fireproof.setPriority(priority, [onComplete])](#Fireproof#setPriority)
  * [Fireproof.stats](#Fireproof.stats)
    * [stats.reset()](#Fireproof.stats.reset)
    * [stats.getListeners()](#Fireproof.stats.getListeners)
    * [stats.getListenerCount()](#Fireproof.stats.getListenerCount)
    * [stats.getPathCounts()](#Fireproof.stats.getPathCounts)
    * [stats.getCounts()](#Fireproof.stats.getCounts)
    * [stats.on(name, fn)](#Fireproof.stats.on)
    * [stats.off([name], fn)](#Fireproof.stats.off)
  * [class: Fireproof.Demux](#Fireproof.Demux)
    * [new Fireproof.Demux(refs, [limitToFirst])](#new_Fireproof.Demux)
    * [demux.get(count)](#Fireproof.Demux#get)
  * [class: Fireproof.LiveArray](#Fireproof.LiveArray)
    * [new Fireproof.LiveArray([errorHandler])](#new_Fireproof.LiveArray)
    * [liveArray.connect([ref], [sortMode], [sortProperty])](#Fireproof.LiveArray#connect)
    * [liveArray.disconnect()](#Fireproof.LiveArray#disconnect)
  * [class: Fireproof.Pager](#Fireproof.Pager)
    * [new Fireproof.Pager(ref, [initialCount])](#new_Fireproof.Pager)
    * [pager.next(count)](#Fireproof.Pager#next)
    * [pager.previous(count)](#Fireproof.Pager#previous)

<a name="new_Fireproof"></a>
##new Fireproof(firebaseRef)
Fireproofs an existing Firebase reference, giving it magic promise powers.

**Params**

- firebaseRef `Firebase` - A Firebase reference object.  

**Properties**

- then  - A promise shortcut for .once('value'),
except for references created by .push(), where it resolves on success
and rejects on failure of the property object.  

**Example**  
var fp = new Fireproof(new Firebase('https://test.firebaseio.com/something'));
fp.then(function(snap) { console.log(snap.val()); });

<a name="Fireproof.setNextTick"></a>
##Fireproof.setNextTick(nextTick)
Tell Fireproof to use a given function to set timeouts from now on.
NB: If you are using AMD/require.js, you MUST call this function!

**Params**

- nextTick `function` - a function that takes a function and
runs it in the immediate future.  

<a name="Fireproof.bless"></a>
##Fireproof.bless(Q)
Tell Fireproof to use a given promise library from now on.

**Params**

- Q `Q` - a Q-style promise constructor with at least defer().  

<a name="Fireproof#auth"></a>
##fireproof.auth(authToken, [onComplete], [onCancel])
Delegates Firebase#auth.

**Params**

- authToken `string` - Firebase authentication token.  
- \[onComplete\] `function` - Callback on initial completion.  
- \[onCancel\] `function` - Callback if we ever get disconnected.  

**Returns**: `Promise` - Resolves on success, rejects on failure.  
<a name="Fireproof#child"></a>
##fireproof.child(childPath)
Delegates Firebase#child, wrapping the child in fireproofing.

**Params**

- childPath `string` - The subpath to refer to.  

**Returns**: [Fireproof](#Fireproof) - A reference to the child path.  
<a name="Fireproof#parent"></a>
##fireproof.parent()
Delegates Firebase#parent, wrapping the child in fireproofing.

**Returns**: [Fireproof](#Fireproof) - A ref to the parent path, or null if there is none.  
<a name="Fireproof#root"></a>
##fireproof.root()
Delegates Firebase#root, wrapping the root in fireproofing.

**Returns**: [Fireproof](#Fireproof) - A ref to the root.  
<a name="Fireproof#toFirebase"></a>
##fireproof.toFirebase()
Hands back the original Firebase reference.

**Returns**: `Firebase` - The proxied Firebase reference.  
<a name="Fireproof#name"></a>
##fireproof.name()
Delegates Firebase#name.

**Returns**: `string` - The last component of this reference object's path.  
<a name="Fireproof#key"></a>
##fireproof.key()
Delegates Firebase#key.

**Returns**: `string` - The last component of this reference object's path.  
<a name="Fireproof#toString"></a>
##fireproof.toString()
Delegates Firebase#toString.

**Returns**: `string` - The full URL of this reference object.  
<a name="Fireproof#authWithCustomToken"></a>
##fireproof.authWithCustomToken(authToken, [onComplete], [options])
Delegates Firebase#authWithCustomToken.

**Params**

- authToken `String`  
- \[onComplete\] `function`  
- \[options\] `Object`  

**Returns**: `Promise` - that resolves on auth success and rejects on auth failure.  
<a name="Fireproof#authAnonymously"></a>
##fireproof.authAnonymously([onComplete], [options])
Delegates Firebase#authAnonymously.

**Params**

- \[onComplete\] `function`  
- \[options\] `Object`  

**Returns**: `Promise` - that resolves on auth success and rejects on auth failure.  
<a name="Fireproof#authWithPassword"></a>
##fireproof.authWithPassword(credentials, [onComplete], [options])
Delegates Firebase#authWithPassword.

**Params**

- credentials `Object` - Should include `email` and `password`.  
- \[onComplete\] `function`  
- \[options\] `Object`  

**Returns**: `Promise` - that resolves on auth success and rejects on auth failure.  
<a name="Fireproof#authWithOAuthPopup"></a>
##fireproof.authWithOAuthPopup(provider, [onComplete], [options])
Delegates Firebase#authWithOAuthPopup.

**Params**

- provider `String`  
- \[onComplete\] `function`  
- \[options\] `Object`  

**Returns**: `Promise` - that resolves on auth success and rejects on auth failure.  
<a name="Fireproof#authWithOAuthRedirect"></a>
##fireproof.authWithOAuthRedirect(provider, [onComplete], [options])
Delegates Firebase#authWithOAuthRedirect.

**Params**

- provider `String`  
- \[onComplete\] `function`  
- \[options\] `Object`  

**Returns**: `Promise` - that resolves on auth success and rejects on auth failure.  
<a name="Fireproof#authWithOAuthPopup"></a>
##fireproof.authWithOAuthPopup(provider, credentials, [onComplete], [options])
Delegates Firebase#authWithOAuthPopup.

**Params**

- provider `String`  
- credentials `Object`  
- \[onComplete\] `function`  
- \[options\] `Object`  

**Returns**: `Promise` - that resolves on auth success and rejects on auth failure.  
<a name="Fireproof#getAuth"></a>
##fireproof.getAuth()
Delegates Firebase#getAuth.

**Returns**: `Object` - user info object, or null otherwise.  
<a name="Fireproof#onAuth"></a>
##fireproof.onAuth(onComplete, [context])
Delegates Firebase#onAuth.

**Params**

- onComplete `function` - Gets called on auth change.  
- \[context\] `Object`  

<a name="Fireproof#offAuth"></a>
##fireproof.offAuth(onComplete, [context])
Delegates Firebase#offAuth.

**Params**

- onComplete `function` - The function previously passed to onAuth.  
- \[context\] `Object`  

<a name="Fireproof#unauth"></a>
##fireproof.unauth()
Delegates Firebase#unauth.

<a name="Fireproof#onDisconnect"></a>
##fireproof.onDisconnect()
Delegates Fireproof#onDisconnect.

**Returns**: `Fireproof.OnDisconnect`  
<a name="Fireproof#limit"></a>
##fireproof.limit(limit)
Delegates Firebase#limit.

**Params**

- limit `Number`  

**Returns**: [Fireproof](#Fireproof)  
<a name="Fireproof#limitToFirst"></a>
##fireproof.limitToFirst(limit)
Delegates Firebase#limitToFirst.

**Params**

- limit `Number`  

**Returns**: [Fireproof](#Fireproof)  
<a name="Fireproof#limitToLast"></a>
##fireproof.limitToLast(limit)
Delegates Firebase#limitToLast.

**Params**

- limit `Number`  

**Returns**: [Fireproof](#Fireproof)  
<a name="Fireproof#orderByChild"></a>
##fireproof.orderByChild(key)
Delegates Firebase#orderByChild.

**Params**

- key `string`  

**Returns**: [Fireproof](#Fireproof)  
<a name="Fireproof#orderByKey"></a>
##fireproof.orderByKey()
Delegates Firebase#orderByKey.

**Returns**: [Fireproof](#Fireproof)  
<a name="Fireproof#orderByPriority"></a>
##fireproof.orderByPriority()
Delegates Firebase#orderByPriority.

**Returns**: [Fireproof](#Fireproof)  
<a name="Fireproof#equalTo"></a>
##fireproof.equalTo(value, [key])
Delegates Firebase#equalTo.

**Params**

- value `String` | `Number` | `null`  
- \[key\] `String`  

**Returns**: [Fireproof](#Fireproof)  
<a name="Fireproof#startAt"></a>
##fireproof.startAt(value, [key])
Delegates Firebase#startAt.

**Params**

- value `object`  
- \[key\] `string`  

**Returns**: [Fireproof](#Fireproof)  
<a name="Fireproof#endAt"></a>
##fireproof.endAt(value, [key])
Delegates Firebase#endAt.

**Params**

- value `object`  
- \[key\] `string`  

**Returns**: [Fireproof](#Fireproof)  
<a name="Fireproof#ref"></a>
##fireproof.ref()
Delegates Firebase#ref.

**Returns**: [Fireproof](#Fireproof)  
<a name="Fireproof#transaction"></a>
##fireproof.transaction(updateFunction, onComplete, [applyLocally])
Delegates Firebase#transaction.

**Params**

- updateFunction `function`  
- onComplete `function`  
- \[applyLocally\] `boolean`  

**Returns**: `Promise` - an Object with two properties: 'committed' and 'snapshot'.  
<a name="Fireproof#on"></a>
##fireproof.on(eventType, callback, [cancelCallback], [context])
Delegates Firebase#on.

**Params**

- eventType `string` - 'value', 'child_added', 'child_changed', 'child_moved',
or 'child_removed'  
- callback `function`  
- \[cancelCallback\] `function`  
- \[context\] `object`  

**Returns**: `function` - Your callback parameter wrapped in fireproofing. Use
this return value, not your own copy of callback, to call .off(). It also
functions as a promise that resolves with a {FireproofSnapshot}.  
<a name="Fireproof#off"></a>
##fireproof.off(eventType, [callback], [context])
Delegates Firebase#off.

**Params**

- eventType `string`  
- \[callback\] `function`  
- \[context\] `object`  

<a name="Fireproof#once"></a>
##fireproof.once(eventType, successCallback, [failureCallback], [context])
Delegates Firebase#once.

**Params**

- eventType `object` - 'value', 'child_added', 'child_changed', 'child_moved',
or 'child_removed'  
- successCallback `function`  
- \[failureCallback\] `function`  
- \[context\] `object`  

**Returns**: `Promise` - Resolves with {FireproofSnapshot}.  
<a name="Fireproof#createUser"></a>
##fireproof.createUser(credentials, [onComplete])
Delegates Firebase#createUser.

**Params**

- credentials `Object`  
- \[onComplete\] `function`  

**Returns**: `Promise`  
<a name="Fireproof#changeEmail"></a>
##fireproof.changeEmail(credentials, [onComplete])
Delegates Firebase#changeEmail.

**Params**

- credentials `Object`  
- \[onComplete\] `function`  

**Returns**: `Promise`  
<a name="Fireproof#changePassword"></a>
##fireproof.changePassword(credentials, [onComplete])
Delegates Firebase#changePassword.

**Params**

- credentials `Object`  
- \[onComplete\] `function`  

**Returns**: `Promise`  
<a name="Fireproof#resetPassword"></a>
##fireproof.resetPassword(credentials, [onComplete])
Delegates Firebase#resetPassword.

**Params**

- credentials `Object`  
- \[onComplete\] `function`  

**Returns**: `Promise`  
<a name="Fireproof#createUser"></a>
##fireproof.createUser(credentials, [onComplete])
Delegates Firebase#removeUser.

**Params**

- credentials `Object`  
- \[onComplete\] `function`  

**Returns**: `Promise`  
<a name="Fireproof#set"></a>
##fireproof.set(value, [onComplete])
Delegates Firebase#set.

**Params**

- value `object` - The value to set this path to.  
- \[onComplete\] `function` - Callback when the operation is done.  

**Returns**: `Promise`  
**Example**  
```js
fireproofRef.set('something')
.then(function()) {
  console.log('set was successful!');
}, function(err) {
  console.error('error while setting:', err);
});
```

<a name="Fireproof#update"></a>
##fireproof.update(value, [onComplete])
Delegates Firebase#update.

**Params**

- value `object` - An object with keys and values to update.  
- \[onComplete\] `function` - Callback when the operation is done.  

**Returns**: `Promise`  
<a name="Fireproof#remove"></a>
##fireproof.remove([onComplete])
Delegates Firebase#remove.

**Params**

- \[onComplete\] `function` - Callback when the operation is done.  

**Returns**: `Promise`  
<a name="Fireproof#push"></a>
##fireproof.push(value, [onComplete])
Delegates Firebase#push.

**Params**

- value `object` - An object with keys and values to update.  
- \[onComplete\] `function` - Callback when the operation is done.  

**Returns**: `Promise`  
<a name="Fireproof#setWithPriority"></a>
##fireproof.setWithPriority(value, priority, [onComplete])
Delegates Firebase#setWithPriority.

**Params**

- value `object` - The value to set this path to.  
- priority `object` - The priority to set this path to.  
- \[onComplete\] `function` - Callback when the operation is done.  

**Returns**: `Promise`  
<a name="Fireproof#setPriority"></a>
##fireproof.setPriority(priority, [onComplete])
Delegates Firebase#setPriority.

**Params**

- priority `object` - The priority to set this path to.  
- \[onComplete\] `function` - Callback when the operation is done.  

**Returns**: `Promise`  
<a name="Fireproof.stats"></a>
##Fireproof.stats
Statistics about Firebase usage.

**Properties**

- operationLog `Object`  
- runningOperationCount `Number`  
- operationCount `Number`  
- listenCount `Number`  

**Members**

* [Fireproof.stats](#Fireproof.stats)
  * [stats.reset()](#Fireproof.stats.reset)
  * [stats.getListeners()](#Fireproof.stats.getListeners)
  * [stats.getListenerCount()](#Fireproof.stats.getListenerCount)
  * [stats.getPathCounts()](#Fireproof.stats.getPathCounts)
  * [stats.getCounts()](#Fireproof.stats.getCounts)
  * [stats.on(name, fn)](#Fireproof.stats.on)
  * [stats.off([name], fn)](#Fireproof.stats.off)

<a name="Fireproof.stats.reset"></a>
###stats.reset()
Resets the count of Firebase operations back to 0.

<a name="Fireproof.stats.getListeners"></a>
###stats.getListeners()
Gets data about listeners on Firebase locations.

**Returns**: `Object` - Listener counts keyed by Firebase path.  
<a name="Fireproof.stats.getListenerCount"></a>
###stats.getListenerCount()
Gets the total number of listeners on Firebase locations.

**Returns**: `Number` - The total number of Firebase listeners presently operating.  
<a name="Fireproof.stats.getPathCounts"></a>
###stats.getPathCounts()
Gets the per-operation, per-path counts of Firebase operations.

**Returns**: `Object` - An object with keys like "listen", "readOnce", "write",
and "update". Each key has an object value, of which the keys are Firebase
paths and the values are counts.  
<a name="Fireproof.stats.getCounts"></a>
###stats.getCounts()
Gets the per-operation counts of Firebase operations.

**Returns**: `Object` - An object with with keys like "read", "write",
and "update". The values are the counts of operations under those headings.  
<a name="Fireproof.stats.on"></a>
###stats.on(name, fn)
Listens for Firebase events occurring.

**Params**

- name `String` - The name of the event. One of 'start', 'finish', 'error',
'listenStarted', or 'listenEnded.'  
- fn `function` - The function to call when the event happens. Takes a single
parameter, the event object.  

**Returns**: `function` - fn is returned for convenience, to pass to `off`.  
<a name="Fireproof.stats.off"></a>
###stats.off([name], fn)
Stops sending events to a listener.

**Params**

- \[name\] `String` - The name of the event. One of 'start', 'finish', 'error',
'listenStarted', or 'listenEnded.'  
- fn `function` - The function to stop calling.  

<a name="Fireproof.Demux"></a>
##class: Fireproof.Demux
**Members**

* [class: Fireproof.Demux](#Fireproof.Demux)
  * [new Fireproof.Demux(refs, [limitToFirst])](#new_Fireproof.Demux)
  * [demux.get(count)](#Fireproof.Demux#get)

<a name="new_Fireproof.Demux"></a>
###new Fireproof.Demux(refs, [limitToFirst])
A helper object for retrieving sorted Firebase objects from multiple
locations.

**Params**

- refs `Array` - a list of Fireproof object references to draw from.  
- \[limitToFirst\] `boolean` - Whether to use "limitToFirst" to restrict the length
of queries to Firebase. True by default. Set this to false if you want to
control the query more directly by setting it on the objects you pass to refs.  

<a name="Fireproof.Demux#get"></a>
###demux.get(count)
Get the next `count` items from the paths, ordered by priority.

**Params**

- count `Number` - The number of items to get from the list.  

**Returns**: `Promise` - A promise that resolves with the next `count` items, ordered by priority.  
<a name="Fireproof.LiveArray"></a>
##class: Fireproof.LiveArray
**Members**

* [class: Fireproof.LiveArray](#Fireproof.LiveArray)
  * [new Fireproof.LiveArray([errorHandler])](#new_Fireproof.LiveArray)
  * [liveArray.connect([ref], [sortMode], [sortProperty])](#Fireproof.LiveArray#connect)
  * [liveArray.disconnect()](#Fireproof.LiveArray#disconnect)

<a name="new_Fireproof.LiveArray"></a>
###new Fireproof.LiveArray([errorHandler])
A live array that keeps its members in sync with a Firebase location's children.
The three array references, `keys`, `values`, and `priorities`, are guaranteed
to persist for the lifetime of the array. In other words, the arrays themselves
are constant; only their contents are mutable. This is highly useful behavior
for dirty-checking environments like Angular.js.

**Params**

- \[errorHandler\] `function` - a function to be called if a Firebase error occurs.  

**Properties**

- keys `Array` - A live array of the keys at the Firebase ref.  
- values `Array` - A live array of the values at the Firebase ref.  
- priorities `Array` - A live array of the priorities at the Firebase ref.  

<a name="Fireproof.LiveArray#connect"></a>
###liveArray.connect([ref], [sortMode], [sortProperty])
Connect this LiveArray to a Firebase reference, instantiating listeners
for child events.
If an error is received from a Firebase listener, _all_ listeners are
disconnected, LiveArray#error is set, and your error handler is called if you
supplied one.

**Params**

- \[ref\] <code>[Fireproof](#Fireproof)</code> - a Firebase ref whose children you wish to sync to.  
- \[sortMode\] `String` - "key", "priority", or "child".  
- \[sortProperty\] `String` - The name of the child property to sort on, if
sortMode is null.  

<a name="Fireproof.LiveArray#disconnect"></a>
###liveArray.disconnect()
Disconnect this LiveArray from a Firebase reference, removing all listeners.
Also clears the contents of the live array references.

<a name="Fireproof.Pager"></a>
##class: Fireproof.Pager
**Members**

* [class: Fireproof.Pager](#Fireproof.Pager)
  * [new Fireproof.Pager(ref, [initialCount])](#new_Fireproof.Pager)
  * [pager.next(count)](#Fireproof.Pager#next)
  * [pager.previous(count)](#Fireproof.Pager#previous)

<a name="new_Fireproof.Pager"></a>
###new Fireproof.Pager(ref, [initialCount])
A helper object for paging over Firebase objects.

**Params**

- ref <code>[Fireproof](#Fireproof)</code> - a Firebase ref whose children you wish to page over.  
- \[initialCount\] `Number` - The number of objects in the first page.  

**Properties**

- hasPrevious `Boolean` - True if there are more objects before the current page.  
- hasNext `Boolean` - True if there are more objects after the current page.  

<a name="Fireproof.Pager#next"></a>
###pager.next(count)
Get the next page of children from the ref.

**Params**

- count `Number` - The size of the page.  

**Returns**: `Promise` - A promise that resolves with an array of the next children.  
<a name="Fireproof.Pager#previous"></a>
###pager.previous(count)
Get the previous page of children from the ref.

**Params**

- count `Number` - The size of the page.  

**Returns**: `Promise` - A promise that resolves with an array of the next children.  
<a name="FireproofSnapshot"></a>
#class: FireproofSnapshot
**Members**

* [class: FireproofSnapshot](#FireproofSnapshot)
  * [new FireproofSnapshot(snap)](#new_FireproofSnapshot)
  * [fireproofSnapshot.child(path)](#FireproofSnapshot#child)
  * [fireproofSnapshot.forEach(eachFn)](#FireproofSnapshot#forEach)
  * [fireproofSnapshot.hasChild(eachFn)](#FireproofSnapshot#hasChild)
  * [fireproofSnapshot.hasChildren()](#FireproofSnapshot#hasChildren)
  * [fireproofSnapshot.numChildren()](#FireproofSnapshot#numChildren)
  * [fireproofSnapshot.name()](#FireproofSnapshot#name)
  * [fireproofSnapshot.key()](#FireproofSnapshot#key)
  * [fireproofSnapshot.val()](#FireproofSnapshot#val)
  * [fireproofSnapshot.ref()](#FireproofSnapshot#ref)
  * [fireproofSnapshot.getPriority()](#FireproofSnapshot#getPriority)
  * [fireproofSnapshot.exportVal()](#FireproofSnapshot#exportVal)

<a name="new_FireproofSnapshot"></a>
##new FireproofSnapshot(snap)
A delegate object for Firebase's Snapshot.

**Params**

- snap `Snapshot` - The snapshot to delegate to.  

**Access**: private  
<a name="FireproofSnapshot#child"></a>
##fireproofSnapshot.child(path)
Delegates DataSnapshot#child.

**Params**

- path `String` - Path of the child.  

**Returns**: [FireproofSnapshot](#FireproofSnapshot) - The snapshot of the child.  
<a name="FireproofSnapshot#forEach"></a>
##fireproofSnapshot.forEach(eachFn)
Delegates DataSnapshot#forEach.

**Params**

- eachFn `cb` - The function to call on each child.  

**Returns**: `Boolean` - True if a callback returned true and cancelled enumeration.  
<a name="FireproofSnapshot#hasChild"></a>
##fireproofSnapshot.hasChild(eachFn)
Delegates DataSnapshot#hasChild.

**Params**

- eachFn `cb` - The function to call on each child.  

**Returns**: `Boolean` - True if the snap has the specified child.  
<a name="FireproofSnapshot#hasChildren"></a>
##fireproofSnapshot.hasChildren()
Delegates DataSnapshot#hasChildren.

**Returns**: `Boolean` - True if the snapshot has children.  
<a name="FireproofSnapshot#numChildren"></a>
##fireproofSnapshot.numChildren()
Delegates DataSnapshot#numChildren.

**Returns**: `Number` - The number of children the snapshot has.  
<a name="FireproofSnapshot#name"></a>
##fireproofSnapshot.name()
Delegates DataSnapshot#name.

**Returns**: `String` - The last part of the snapshot's path.  
<a name="FireproofSnapshot#key"></a>
##fireproofSnapshot.key()
Delegates DataSnapshot#key.

**Returns**: `String` - The last part of the snapshot's path.  
<a name="FireproofSnapshot#val"></a>
##fireproofSnapshot.val()
Delegates DataSnapshot#val.

**Returns**: `*` - The Javascript deserialization of the snapshot.  
<a name="FireproofSnapshot#ref"></a>
##fireproofSnapshot.ref()
Delegates DataSnapshot#ref.

**Returns**: [Fireproof](#Fireproof) - The Fireproof object for the snap's location.  
<a name="FireproofSnapshot#getPriority"></a>
##fireproofSnapshot.getPriority()
Delegates DataSnapshot#getPriority.

**Returns**: `*` - The snapshot's priority.  
<a name="FireproofSnapshot#exportVal"></a>
##fireproofSnapshot.exportVal()
Delegates DataSnapshot#exportVal.

**Returns**: `*` - The Firebase export object of the snapshot.  
