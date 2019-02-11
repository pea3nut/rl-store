# rl-store

A map which be limited size of storage for catching.

Rin&Len store.


```ts
const RLStroe = require('rl-store');

const store = new RLStroe(1000); // Limite the store only retain 1000 length of string.

// to set
store.data['key1'] = 'value2';
store.dispatch('set', {key: 'key'});

// to get
let value1 = store.data['key1'];
store.dispatch('get', {key: 'key'});

// to remove a key maunally
store.delete('key1');
```