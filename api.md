<a name="Fireproof"></a>
## Fireproof
**Kind**: global class  
**Properties**

| Name | Description |
| --- | --- |
| then | A promise shortcut for .once('value'), except for references created by .push(), where it resolves on success and rejects on failure of the property object. |


* [Fireproof](#Fireproof)
  * [new Fireproof(firebaseRef)](#new_Fireproof_new)
  * _instance_
    * [.child(childPath)](#Fireproof+child) ⇒ <code>[Fireproof](#Fireproof)</code>
    * [.parent()](#Fireproof+parent) ⇒ <code>[Fireproof](#Fireproof)</code>
    * [.root()](#Fireproof+root) ⇒ <code>[Fireproof](#Fireproof)</code>
    * [.toFirebase()](#Fireproof+toFirebase) ⇒ <code>Firebase</code>
    * [.name()](#Fireproof+name) ⇒ <code>string</code>
    * [.key()](#Fireproof+key) ⇒ <code>string</code>
    * [.toString()](#Fireproof+toString) ⇒ <code>string</code>
    * [._wrapAuth(fn)](#Fireproof+_wrapAuth)
    * [.auth(authToken, [onComplete], [options])](#Fireproof+auth) ⇒ <code>Promise</code>
    * [.authWithCustomToken(authToken, [onComplete], [options])](#Fireproof+authWithCustomToken) ⇒ <code>Promise</code>
    * [.authAnonymously([onComplete], [options])](#Fireproof+authAnonymously) ⇒ <code>Promise</code>
    * [.authWithPassword(credentials, [onComplete], [options])](#Fireproof+authWithPassword) ⇒ <code>Promise</code>
    * [.authWithOAuthPopup(provider, [onComplete], [options])](#Fireproof+authWithOAuthPopup) ⇒ <code>Promise</code>
    * [.authWithOAuthRedirect(provider, [onComplete], [options])](#Fireproof+authWithOAuthRedirect) ⇒ <code>Promise</code>
    * [.authWithOAuthPopup(provider, credentials, [onComplete], [options])](#Fireproof+authWithOAuthPopup) ⇒ <code>Promise</code>
    * [.getAuth()](#Fireproof+getAuth) ⇒ <code>Object</code>
    * [.onAuth(onComplete, [context])](#Fireproof+onAuth)
    * [.offAuth(onComplete, [context])](#Fireproof+offAuth)
    * [.unauth()](#Fireproof+unauth)
    * [.onDisconnect()](#Fireproof+onDisconnect) ⇒ <code>Fireproof.OnDisconnect</code>
      * [.cancel([callback])](#Fireproof+onDisconnect+cancel) ⇒ <code>Promise</code>
      * [.remove([callback])](#Fireproof+onDisconnect+remove) ⇒ <code>Promise</code>
      * [.set(value, [callback])](#Fireproof+onDisconnect+set) ⇒ <code>Promise</code>
      * [.setWithPriority(value, priority, [callback])](#Fireproof+onDisconnect+setWithPriority) ⇒ <code>Promise</code>
      * [.update(value, [callback])](#Fireproof+onDisconnect+update) ⇒ <code>Promise</code>
    * [.limit(limit)](#Fireproof+limit) ⇒ <code>[Fireproof](#Fireproof)</code>
    * [.limitToFirst(limit)](#Fireproof+limitToFirst) ⇒ <code>[Fireproof](#Fireproof)</code>
    * [.limitToLast(limit)](#Fireproof+limitToLast) ⇒ <code>[Fireproof](#Fireproof)</code>
    * [.orderByChild(key)](#Fireproof+orderByChild) ⇒ <code>[Fireproof](#Fireproof)</code>
    * [.orderByKey()](#Fireproof+orderByKey) ⇒ <code>[Fireproof](#Fireproof)</code>
    * [.orderByValue()](#Fireproof+orderByValue) ⇒ <code>[Fireproof](#Fireproof)</code>
    * [.orderByPriority()](#Fireproof+orderByPriority) ⇒ <code>[Fireproof](#Fireproof)</code>
    * [.equalTo(value, [key])](#Fireproof+equalTo) ⇒ <code>[Fireproof](#Fireproof)</code>
    * [.startAt(value, [key])](#Fireproof+startAt) ⇒ <code>[Fireproof](#Fireproof)</code>
    * [.endAt(value, [key])](#Fireproof+endAt) ⇒ <code>[Fireproof](#Fireproof)</code>
    * [.ref()](#Fireproof+ref) ⇒ <code>[Fireproof](#Fireproof)</code>
    * [.transaction(updateFunction, onComplete, [applyLocally])](#Fireproof+transaction) ⇒ <code>Promise</code>
    * [.on(eventType, callback, [cancelCallback], [context])](#Fireproof+on) ⇒ <code>function</code>
    * [.off(eventType, [callback], [context])](#Fireproof+off)
    * [.once(eventType, successCallback, [failureCallback], [context])](#Fireproof+once) ⇒ <code>Promise</code>
    * [.createUser(credentials, [onComplete])](#Fireproof+createUser) ⇒ <code>Promise</code>
    * [.changeEmail(credentials, [onComplete])](#Fireproof+changeEmail) ⇒ <code>Promise</code>
    * [.changePassword(credentials, [onComplete])](#Fireproof+changePassword) ⇒ <code>Promise</code>
    * [.resetPassword(credentials, [onComplete])](#Fireproof+resetPassword) ⇒ <code>Promise</code>
    * [.createUser(credentials, [onComplete])](#Fireproof+createUser) ⇒ <code>Promise</code>
    * [.set(value, [onComplete])](#Fireproof+set) ⇒ <code>Promise</code>
    * [.update(value, [onComplete])](#Fireproof+update) ⇒ <code>Promise</code>
    * [.remove([onComplete])](#Fireproof+remove) ⇒ <code>Promise</code>
    * [.push(value, [onComplete])](#Fireproof+push) ⇒ <code>Promise</code>
    * [.setWithPriority(value, priority, [onComplete])](#Fireproof+setWithPriority) ⇒ <code>Promise</code>
    * [.setPriority(priority, [onComplete])](#Fireproof+setPriority) ⇒ <code>Promise</code>
  * _static_
    * [.Demux](#Fireproof.Demux)
      * [new Demux(refs, [limitToFirst])](#new_Fireproof.Demux_new)
      * [.get(count)](#Fireproof.Demux+get) ⇒ <code>Promise</code>
    * [.LiveArray](#Fireproof.LiveArray)
      * [new LiveArray([errorHandler])](#new_Fireproof.LiveArray_new)
      * [.connect([ref], [sortMode], [sortProperty])](#Fireproof.LiveArray+connect)
      * [.disconnect()](#Fireproof.LiveArray+disconnect)
    * [.Pager](#Fireproof.Pager)
      * [new Pager(ref, [initialCount])](#new_Fireproof.Pager_new)
      * [.next(count)](#Fireproof.Pager+next) ⇒ <code>Promise</code>
      * [.previous(count)](#Fireproof.Pager+previous) ⇒ <code>Promise</code>
    * [.stats](#Fireproof.stats) : <code>object</code>
      * [.reset()](#Fireproof.stats.reset)
      * [.getListeners()](#Fireproof.stats.getListeners) ⇒ <code>Object</code>
      * [.getListenerCount()](#Fireproof.stats.getListenerCount) ⇒ <code>Number</code>
      * [.getPathCounts()](#Fireproof.stats.getPathCounts) ⇒ <code>Object</code>
      * [.getCounts()](#Fireproof.stats.getCounts) ⇒ <code>Object</code>
      * [.on(name, fn)](#Fireproof.stats.on) ⇒ <code>function</code>
      * [.off([name], fn)](#Fireproof.stats.off)
    * ~~[.bless(Deferrable)](#Fireproof.bless)~~
    * [.setNextTick(nextTick)](#Fireproof.setNextTick)

<a name="new_Fireproof_new"></a>
### new Fireproof(firebaseRef)
Fireproofs an existing Firebase reference, giving it magic promise powers.


| Param | Type | Description |
| --- | --- | --- |
| firebaseRef | <code>Firebase</code> | A Firebase reference object. |

**Example**  
```js
var fp = new Fireproof(new Firebase('https://test.firebaseio.com/something'));
fp.then(function(snap) { console.log(snap.val()); });
```
<a name="Fireproof+child"></a>
### fireproof.child(childPath) ⇒ <code>[Fireproof](#Fireproof)</code>
Delegates Firebase#child, wrapping the child in fireproofing.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>[Fireproof](#Fireproof)</code> - A reference to the child path.  

| Param | Type | Description |
| --- | --- | --- |
| childPath | <code>string</code> | The subpath to refer to. |

<a name="Fireproof+parent"></a>
### fireproof.parent() ⇒ <code>[Fireproof](#Fireproof)</code>
Delegates Firebase#parent, wrapping the child in fireproofing.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>[Fireproof](#Fireproof)</code> - A ref to the parent path, or null if there is none.  
<a name="Fireproof+root"></a>
### fireproof.root() ⇒ <code>[Fireproof](#Fireproof)</code>
Delegates Firebase#root, wrapping the root in fireproofing.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>[Fireproof](#Fireproof)</code> - A ref to the root.  
<a name="Fireproof+toFirebase"></a>
### fireproof.toFirebase() ⇒ <code>Firebase</code>
Hands back the original Firebase reference.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>Firebase</code> - The proxied Firebase reference.  
<a name="Fireproof+name"></a>
### fireproof.name() ⇒ <code>string</code>
Delegates Firebase#name.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>string</code> - The last component of this reference object's path.  
<a name="Fireproof+key"></a>
### fireproof.key() ⇒ <code>string</code>
Delegates Firebase#key.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>string</code> - The last component of this reference object's path.  
<a name="Fireproof+toString"></a>
### fireproof.toString() ⇒ <code>string</code>
Delegates Firebase#toString.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>string</code> - The full URL of this reference object.  
<a name="Fireproof+_wrapAuth"></a>
### fireproof._wrapAuth(fn)
Wraps auth methods so they execute in order.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Auth function that generates a promise once it's done. |

<a name="Fireproof+auth"></a>
### fireproof.auth(authToken, [onComplete], [options]) ⇒ <code>Promise</code>
Delegates Firebase#auth.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>Promise</code> - that resolves on auth success and rejects on auth failure.  

| Param | Type |
| --- | --- |
| authToken | <code>String</code> | 
| [onComplete] | <code>function</code> | 
| [options] | <code>Object</code> | 

<a name="Fireproof+authWithCustomToken"></a>
### fireproof.authWithCustomToken(authToken, [onComplete], [options]) ⇒ <code>Promise</code>
Delegates Firebase#authWithCustomToken.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>Promise</code> - that resolves on auth success and rejects on auth failure.  

| Param | Type |
| --- | --- |
| authToken | <code>String</code> | 
| [onComplete] | <code>function</code> | 
| [options] | <code>Object</code> | 

<a name="Fireproof+authAnonymously"></a>
### fireproof.authAnonymously([onComplete], [options]) ⇒ <code>Promise</code>
Delegates Firebase#authAnonymously.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>Promise</code> - that resolves on auth success and rejects on auth failure.  

| Param | Type |
| --- | --- |
| [onComplete] | <code>function</code> | 
| [options] | <code>Object</code> | 

<a name="Fireproof+authWithPassword"></a>
### fireproof.authWithPassword(credentials, [onComplete], [options]) ⇒ <code>Promise</code>
Delegates Firebase#authWithPassword.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>Promise</code> - that resolves on auth success and rejects on auth failure.  

| Param | Type | Description |
| --- | --- | --- |
| credentials | <code>Object</code> | Should include `email` and `password`. |
| [onComplete] | <code>function</code> |  |
| [options] | <code>Object</code> |  |

<a name="Fireproof+authWithOAuthPopup"></a>
### fireproof.authWithOAuthPopup(provider, [onComplete], [options]) ⇒ <code>Promise</code>
Delegates Firebase#authWithOAuthPopup.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>Promise</code> - that resolves on auth success and rejects on auth failure.  

| Param | Type |
| --- | --- |
| provider | <code>String</code> | 
| [onComplete] | <code>function</code> | 
| [options] | <code>Object</code> | 

<a name="Fireproof+authWithOAuthRedirect"></a>
### fireproof.authWithOAuthRedirect(provider, [onComplete], [options]) ⇒ <code>Promise</code>
Delegates Firebase#authWithOAuthRedirect.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>Promise</code> - that resolves on auth success and rejects on auth failure.  

| Param | Type |
| --- | --- |
| provider | <code>String</code> | 
| [onComplete] | <code>function</code> | 
| [options] | <code>Object</code> | 

<a name="Fireproof+authWithOAuthPopup"></a>
### fireproof.authWithOAuthPopup(provider, credentials, [onComplete], [options]) ⇒ <code>Promise</code>
Delegates Firebase#authWithOAuthPopup.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>Promise</code> - that resolves on auth success and rejects on auth failure.  

| Param | Type |
| --- | --- |
| provider | <code>String</code> | 
| credentials | <code>Object</code> | 
| [onComplete] | <code>function</code> | 
| [options] | <code>Object</code> | 

<a name="Fireproof+getAuth"></a>
### fireproof.getAuth() ⇒ <code>Object</code>
Delegates Firebase#getAuth.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>Object</code> - user info object, or null otherwise.  
<a name="Fireproof+onAuth"></a>
### fireproof.onAuth(onComplete, [context])
Delegates Firebase#onAuth.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type | Description |
| --- | --- | --- |
| onComplete | <code>function</code> | Gets called on auth change. |
| [context] | <code>Object</code> |  |

<a name="Fireproof+offAuth"></a>
### fireproof.offAuth(onComplete, [context])
Delegates Firebase#offAuth.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type | Description |
| --- | --- | --- |
| onComplete | <code>function</code> | The function previously passed to onAuth. |
| [context] | <code>Object</code> |  |

<a name="Fireproof+unauth"></a>
### fireproof.unauth()
Delegates Firebase#unauth.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
<a name="Fireproof+onDisconnect"></a>
### fireproof.onDisconnect() ⇒ <code>Fireproof.OnDisconnect</code>
Delegates Fireproof#onDisconnect.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

  * [.onDisconnect()](#Fireproof+onDisconnect) ⇒ <code>Fireproof.OnDisconnect</code>
    * [.cancel([callback])](#Fireproof+onDisconnect+cancel) ⇒ <code>Promise</code>
    * [.remove([callback])](#Fireproof+onDisconnect+remove) ⇒ <code>Promise</code>
    * [.set(value, [callback])](#Fireproof+onDisconnect+set) ⇒ <code>Promise</code>
    * [.setWithPriority(value, priority, [callback])](#Fireproof+onDisconnect+setWithPriority) ⇒ <code>Promise</code>
    * [.update(value, [callback])](#Fireproof+onDisconnect+update) ⇒ <code>Promise</code>

<a name="Fireproof+onDisconnect+cancel"></a>
#### onDisconnect.cancel([callback]) ⇒ <code>Promise</code>
Delegates onDisconnect()#cancel.

**Kind**: instance method of <code>[onDisconnect](#Fireproof+onDisconnect)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | <code>function</code> | Firebase callback. |

<a name="Fireproof+onDisconnect+remove"></a>
#### onDisconnect.remove([callback]) ⇒ <code>Promise</code>
Delegates onDisconnect()#remove.

**Kind**: instance method of <code>[onDisconnect](#Fireproof+onDisconnect)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | <code>function</code> | Firebase callback. |

<a name="Fireproof+onDisconnect+set"></a>
#### onDisconnect.set(value, [callback]) ⇒ <code>Promise</code>
Delegates onDisconnect()#set.

**Kind**: instance method of <code>[onDisconnect](#Fireproof+onDisconnect)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to set on the ref on disconnect. |
| [callback] | <code>function</code> | Firebase callback. |

<a name="Fireproof+onDisconnect+setWithPriority"></a>
#### onDisconnect.setWithPriority(value, priority, [callback]) ⇒ <code>Promise</code>
Delegates onDisconnect()#setWithPriority.

**Kind**: instance method of <code>[onDisconnect](#Fireproof+onDisconnect)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to set on the ref on disconnect. |
| priority | <code>\*</code> | Priority to set on the ref on disconnect. |
| [callback] | <code>function</code> | Firebase callback. |

<a name="Fireproof+onDisconnect+update"></a>
#### onDisconnect.update(value, [callback]) ⇒ <code>Promise</code>
Delegates onDisconnect()#update.

**Kind**: instance method of <code>[onDisconnect](#Fireproof+onDisconnect)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to update on the ref on disconnect. |
| [callback] | <code>function</code> | Firebase callback. |

<a name="Fireproof+limit"></a>
### fireproof.limit(limit) ⇒ <code>[Fireproof](#Fireproof)</code>
Delegates Firebase#limit.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type |
| --- | --- |
| limit | <code>Number</code> | 

<a name="Fireproof+limitToFirst"></a>
### fireproof.limitToFirst(limit) ⇒ <code>[Fireproof](#Fireproof)</code>
Delegates Firebase#limitToFirst.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type |
| --- | --- |
| limit | <code>Number</code> | 

<a name="Fireproof+limitToLast"></a>
### fireproof.limitToLast(limit) ⇒ <code>[Fireproof](#Fireproof)</code>
Delegates Firebase#limitToLast.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type |
| --- | --- |
| limit | <code>Number</code> | 

<a name="Fireproof+orderByChild"></a>
### fireproof.orderByChild(key) ⇒ <code>[Fireproof](#Fireproof)</code>
Delegates Firebase#orderByChild.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="Fireproof+orderByKey"></a>
### fireproof.orderByKey() ⇒ <code>[Fireproof](#Fireproof)</code>
Delegates Firebase#orderByKey.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
<a name="Fireproof+orderByValue"></a>
### fireproof.orderByValue() ⇒ <code>[Fireproof](#Fireproof)</code>
Delegates Firebase#orderByValue.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
<a name="Fireproof+orderByPriority"></a>
### fireproof.orderByPriority() ⇒ <code>[Fireproof](#Fireproof)</code>
Delegates Firebase#orderByPriority.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
<a name="Fireproof+equalTo"></a>
### fireproof.equalTo(value, [key]) ⇒ <code>[Fireproof](#Fireproof)</code>
Delegates Firebase#equalTo.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type |
| --- | --- |
| value | <code>String</code> &#124; <code>Number</code> &#124; <code>null</code> | 
| [key] | <code>String</code> | 

<a name="Fireproof+startAt"></a>
### fireproof.startAt(value, [key]) ⇒ <code>[Fireproof](#Fireproof)</code>
Delegates Firebase#startAt.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type |
| --- | --- |
| value | <code>object</code> | 
| [key] | <code>string</code> | 

<a name="Fireproof+endAt"></a>
### fireproof.endAt(value, [key]) ⇒ <code>[Fireproof](#Fireproof)</code>
Delegates Firebase#endAt.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type |
| --- | --- |
| value | <code>object</code> | 
| [key] | <code>string</code> | 

<a name="Fireproof+ref"></a>
### fireproof.ref() ⇒ <code>[Fireproof](#Fireproof)</code>
Delegates Firebase#ref.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
<a name="Fireproof+transaction"></a>
### fireproof.transaction(updateFunction, onComplete, [applyLocally]) ⇒ <code>Promise</code>
Delegates Firebase#transaction.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>Promise</code> - an Object with two properties: 'committed' and 'snapshot'.  

| Param | Type |
| --- | --- |
| updateFunction | <code>function</code> | 
| onComplete | <code>function</code> | 
| [applyLocally] | <code>boolean</code> | 

<a name="Fireproof+on"></a>
### fireproof.on(eventType, callback, [cancelCallback], [context]) ⇒ <code>function</code>
Delegates Firebase#on.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>function</code> - Your callback parameter wrapped in fireproofing. Use
this return value, not your own copy of callback, to call .off(). It also
functions as a promise that resolves with a {FireproofSnapshot}.  

| Param | Type | Description |
| --- | --- | --- |
| eventType | <code>string</code> | 'value', 'child_added', 'child_changed', 'child_moved', or 'child_removed' |
| callback | <code>function</code> |  |
| [cancelCallback] | <code>function</code> |  |
| [context] | <code>object</code> |  |

<a name="Fireproof+off"></a>
### fireproof.off(eventType, [callback], [context])
Delegates Firebase#off.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type |
| --- | --- |
| eventType | <code>string</code> | 
| [callback] | <code>function</code> | 
| [context] | <code>object</code> | 

<a name="Fireproof+once"></a>
### fireproof.once(eventType, successCallback, [failureCallback], [context]) ⇒ <code>Promise</code>
Delegates Firebase#once.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  
**Returns**: <code>Promise</code> - Resolves with {FireproofSnapshot}.  

| Param | Type | Description |
| --- | --- | --- |
| eventType | <code>object</code> | 'value', 'child_added', 'child_changed', 'child_moved', or 'child_removed' |
| successCallback | <code>function</code> |  |
| [failureCallback] | <code>function</code> |  |
| [context] | <code>object</code> |  |

<a name="Fireproof+createUser"></a>
### fireproof.createUser(credentials, [onComplete]) ⇒ <code>Promise</code>
Delegates Firebase#createUser.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type |
| --- | --- |
| credentials | <code>Object</code> | 
| [onComplete] | <code>function</code> | 

<a name="Fireproof+changeEmail"></a>
### fireproof.changeEmail(credentials, [onComplete]) ⇒ <code>Promise</code>
Delegates Firebase#changeEmail.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type |
| --- | --- |
| credentials | <code>Object</code> | 
| [onComplete] | <code>function</code> | 

<a name="Fireproof+changePassword"></a>
### fireproof.changePassword(credentials, [onComplete]) ⇒ <code>Promise</code>
Delegates Firebase#changePassword.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type |
| --- | --- |
| credentials | <code>Object</code> | 
| [onComplete] | <code>function</code> | 

<a name="Fireproof+resetPassword"></a>
### fireproof.resetPassword(credentials, [onComplete]) ⇒ <code>Promise</code>
Delegates Firebase#resetPassword.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type |
| --- | --- |
| credentials | <code>Object</code> | 
| [onComplete] | <code>function</code> | 

<a name="Fireproof+createUser"></a>
### fireproof.createUser(credentials, [onComplete]) ⇒ <code>Promise</code>
Delegates Firebase#removeUser.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type |
| --- | --- |
| credentials | <code>Object</code> | 
| [onComplete] | <code>function</code> | 

<a name="Fireproof+set"></a>
### fireproof.set(value, [onComplete]) ⇒ <code>Promise</code>
Delegates Firebase#set.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>object</code> | The value to set this path to. |
| [onComplete] | <code>function</code> | Callback when the operation is done. |

**Example**  
```js
fireproofRef.set('something')
.then(function()) {
  console.log('set was successful!');
}, function(err) {
  console.error('error while setting:', err);
});
```
<a name="Fireproof+update"></a>
### fireproof.update(value, [onComplete]) ⇒ <code>Promise</code>
Delegates Firebase#update.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>object</code> | An object with keys and values to update. |
| [onComplete] | <code>function</code> | Callback when the operation is done. |

<a name="Fireproof+remove"></a>
### fireproof.remove([onComplete]) ⇒ <code>Promise</code>
Delegates Firebase#remove.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [onComplete] | <code>function</code> | Callback when the operation is done. |

<a name="Fireproof+push"></a>
### fireproof.push(value, [onComplete]) ⇒ <code>Promise</code>
Delegates Firebase#push.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>object</code> | An object with keys and values to update. |
| [onComplete] | <code>function</code> | Callback when the operation is done. |

<a name="Fireproof+setWithPriority"></a>
### fireproof.setWithPriority(value, priority, [onComplete]) ⇒ <code>Promise</code>
Delegates Firebase#setWithPriority.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>object</code> | The value to set this path to. |
| priority | <code>object</code> | The priority to set this path to. |
| [onComplete] | <code>function</code> | Callback when the operation is done. |

<a name="Fireproof+setPriority"></a>
### fireproof.setPriority(priority, [onComplete]) ⇒ <code>Promise</code>
Delegates Firebase#setPriority.

**Kind**: instance method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type | Description |
| --- | --- | --- |
| priority | <code>object</code> | The priority to set this path to. |
| [onComplete] | <code>function</code> | Callback when the operation is done. |

<a name="Fireproof.Demux"></a>
### Fireproof.Demux
**Kind**: static class of <code>[Fireproof](#Fireproof)</code>  

  * [.Demux](#Fireproof.Demux)
    * [new Demux(refs, [limitToFirst])](#new_Fireproof.Demux_new)
    * [.get(count)](#Fireproof.Demux+get) ⇒ <code>Promise</code>

<a name="new_Fireproof.Demux_new"></a>
#### new Demux(refs, [limitToFirst])
A helper object for retrieving sorted Firebase objects from multiple
locations.


| Param | Type | Description |
| --- | --- | --- |
| refs | <code>Array</code> | a list of Fireproof object references to draw from. |
| [limitToFirst] | <code>boolean</code> | Whether to use "limitToFirst" to restrict the length of queries to Firebase. True by default. Set this to false if you want to control the query more directly by setting it on the objects you pass to refs. |

<a name="Fireproof.Demux+get"></a>
#### demux.get(count) ⇒ <code>Promise</code>
Get the next `count` items from the paths, ordered by priority.

**Kind**: instance method of <code>[Demux](#Fireproof.Demux)</code>  
**Returns**: <code>Promise</code> - A promise that resolves with the next `count` items, ordered by priority.  

| Param | Type | Description |
| --- | --- | --- |
| count | <code>Number</code> | The number of items to get from the list. |

<a name="Fireproof.LiveArray"></a>
### Fireproof.LiveArray
**Kind**: static class of <code>[Fireproof](#Fireproof)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| keys | <code>Array</code> | A live array of the keys at the Firebase ref. |
| values | <code>Array</code> | A live array of the values at the Firebase ref. |
| priorities | <code>Array</code> | A live array of the priorities at the Firebase ref. |


  * [.LiveArray](#Fireproof.LiveArray)
    * [new LiveArray([errorHandler])](#new_Fireproof.LiveArray_new)
    * [.connect([ref], [sortMode], [sortProperty])](#Fireproof.LiveArray+connect)
    * [.disconnect()](#Fireproof.LiveArray+disconnect)

<a name="new_Fireproof.LiveArray_new"></a>
#### new LiveArray([errorHandler])
A live array that keeps its members in sync with a Firebase location's children.
The three array references, `keys`, `values`, and `priorities`, are guaranteed
to persist for the lifetime of the array. In other words, the arrays themselves
are constant; only their contents are mutable. This is highly useful behavior
for dirty-checking environments like Angular.js.


| Param | Type | Description |
| --- | --- | --- |
| [errorHandler] | <code>function</code> | a function to be called if a Firebase error occurs. |

<a name="Fireproof.LiveArray+connect"></a>
#### liveArray.connect([ref], [sortMode], [sortProperty])
Connect this LiveArray to a Firebase reference, instantiating listeners
for child events.
If an error is received from a Firebase listener, _all_ listeners are
disconnected, LiveArray#error is set, and your error handler is called if you
supplied one.

**Kind**: instance method of <code>[LiveArray](#Fireproof.LiveArray)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [ref] | <code>[Fireproof](#Fireproof)</code> | a Firebase ref whose children you wish to sync to. |
| [sortMode] | <code>String</code> | "key", "priority", or "child". |
| [sortProperty] | <code>String</code> | The name of the child property to sort on, if sortMode is "child". |

<a name="Fireproof.LiveArray+disconnect"></a>
#### liveArray.disconnect()
Disconnect this LiveArray from a Firebase reference, removing all listeners.
Also clears the contents of the live array references.

**Kind**: instance method of <code>[LiveArray](#Fireproof.LiveArray)</code>  
<a name="Fireproof.Pager"></a>
### Fireproof.Pager
**Kind**: static class of <code>[Fireproof](#Fireproof)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| hasPrevious | <code>Boolean</code> | True if there are more objects before the current page. |
| hasNext | <code>Boolean</code> | True if there are more objects after the current page. |


  * [.Pager](#Fireproof.Pager)
    * [new Pager(ref, [initialCount])](#new_Fireproof.Pager_new)
    * [.next(count)](#Fireproof.Pager+next) ⇒ <code>Promise</code>
    * [.previous(count)](#Fireproof.Pager+previous) ⇒ <code>Promise</code>

<a name="new_Fireproof.Pager_new"></a>
#### new Pager(ref, [initialCount])
A helper object for paging over Firebase objects.


| Param | Type | Description |
| --- | --- | --- |
| ref | <code>[Fireproof](#Fireproof)</code> | a Firebase ref whose children you wish to page over. |
| [initialCount] | <code>Number</code> | The number of objects in the first page. |

<a name="Fireproof.Pager+next"></a>
#### pager.next(count) ⇒ <code>Promise</code>
Get the next page of children from the ref.

**Kind**: instance method of <code>[Pager](#Fireproof.Pager)</code>  
**Returns**: <code>Promise</code> - A promise that resolves with an array of the next children.  

| Param | Type | Description |
| --- | --- | --- |
| count | <code>Number</code> | The size of the page. |

<a name="Fireproof.Pager+previous"></a>
#### pager.previous(count) ⇒ <code>Promise</code>
Get the previous page of children from the ref.

**Kind**: instance method of <code>[Pager](#Fireproof.Pager)</code>  
**Returns**: <code>Promise</code> - A promise that resolves with an array of the next children.  

| Param | Type | Description |
| --- | --- | --- |
| count | <code>Number</code> | The size of the page. |

<a name="Fireproof.stats"></a>
### Fireproof.stats : <code>object</code>
Statistics about Firebase usage.

**Kind**: static namespace of <code>[Fireproof](#Fireproof)</code>  
**Properties**

| Name | Type |
| --- | --- |
| operationLog | <code>Object</code> | 
| runningOperationCount | <code>Number</code> | 
| operationCount | <code>Number</code> | 
| listenCount | <code>Number</code> | 


  * [.stats](#Fireproof.stats) : <code>object</code>
    * [.reset()](#Fireproof.stats.reset)
    * [.getListeners()](#Fireproof.stats.getListeners) ⇒ <code>Object</code>
    * [.getListenerCount()](#Fireproof.stats.getListenerCount) ⇒ <code>Number</code>
    * [.getPathCounts()](#Fireproof.stats.getPathCounts) ⇒ <code>Object</code>
    * [.getCounts()](#Fireproof.stats.getCounts) ⇒ <code>Object</code>
    * [.on(name, fn)](#Fireproof.stats.on) ⇒ <code>function</code>
    * [.off([name], fn)](#Fireproof.stats.off)

<a name="Fireproof.stats.reset"></a>
#### stats.reset()
Resets the count of Firebase operations back to 0.

**Kind**: static method of <code>[stats](#Fireproof.stats)</code>  
<a name="Fireproof.stats.getListeners"></a>
#### stats.getListeners() ⇒ <code>Object</code>
Gets data about listeners on Firebase locations.

**Kind**: static method of <code>[stats](#Fireproof.stats)</code>  
**Returns**: <code>Object</code> - Listener counts keyed by Firebase path.  
<a name="Fireproof.stats.getListenerCount"></a>
#### stats.getListenerCount() ⇒ <code>Number</code>
Gets the total number of listeners on Firebase locations.

**Kind**: static method of <code>[stats](#Fireproof.stats)</code>  
**Returns**: <code>Number</code> - The total number of Firebase listeners presently operating.  
<a name="Fireproof.stats.getPathCounts"></a>
#### stats.getPathCounts() ⇒ <code>Object</code>
Gets the per-operation, per-path counts of Firebase operations.

**Kind**: static method of <code>[stats](#Fireproof.stats)</code>  
**Returns**: <code>Object</code> - An object with keys like "listen", "readOnce", "write",
and "update". Each key has an object value, of which the keys are Firebase
paths and the values are counts.  
<a name="Fireproof.stats.getCounts"></a>
#### stats.getCounts() ⇒ <code>Object</code>
Gets the per-operation counts of Firebase operations.

**Kind**: static method of <code>[stats](#Fireproof.stats)</code>  
**Returns**: <code>Object</code> - An object with with keys like "read", "write",
and "update". The values are the counts of operations under those headings.  
<a name="Fireproof.stats.on"></a>
#### stats.on(name, fn) ⇒ <code>function</code>
Listens for Firebase events occurring.

**Kind**: static method of <code>[stats](#Fireproof.stats)</code>  
**Returns**: <code>function</code> - fn is returned for convenience, to pass to `off`.  
**Throws**:

- if you don't pass in a function for fn.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the event. One of 'start', 'finish', 'error', 'listenStarted', or 'listenEnded.' |
| fn | <code>function</code> | The function to call when the event happens. Takes a single parameter, the event object. |

<a name="Fireproof.stats.off"></a>
#### stats.off([name], fn)
Stops sending events to a listener.

**Kind**: static method of <code>[stats](#Fireproof.stats)</code>  
**Throws**:

- if you don't pass in a function for fn.


| Param | Type | Description |
| --- | --- | --- |
| [name] | <code>String</code> | The name of the event. One of 'start', 'finish', 'error', 'listenStarted', or 'listenEnded.' |
| fn | <code>function</code> | The function to stop calling. |

<a name="Fireproof.bless"></a>
### ~~Fireproof.bless(Deferrable)~~
***Deprecated***

Tell Fireproof to use a given defer-style promise library from now on.
If you have native promises, you don't need to call this;
if you want to substitute a different promise constructor, just set it on Fireproof.Promise directly.

**Kind**: static method of <code>[Fireproof](#Fireproof)</code>  
**Throws**:

- if you don't provide a valid promise library.


| Param | Type | Description |
| --- | --- | --- |
| Deferrable | <code>function</code> | a deferrable promise constructor with .all(). |

<a name="Fireproof.setNextTick"></a>
### Fireproof.setNextTick(nextTick)
Tell Fireproof to use a given function to set timeouts from now on.

**Kind**: static method of <code>[Fireproof](#Fireproof)</code>  

| Param | Type | Description |
| --- | --- | --- |
| nextTick | <code>function</code> | a function that takes a function and runs it in the immediate future. |

