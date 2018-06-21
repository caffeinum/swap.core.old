const id = require('./id')

const { LocalStorage } = require('node-localstorage')

class Storage {
  constructor(path) {
    this.storage = new LocalStorage(path)
  }

  // swap-core uses : in path, and they work bad in dir names
  setItem(key, value) {
    return this.storage.setItem(key.replace(/:/g,'.'), value)
  }

  getItem(key) {
    return this.storage.getItem(key.replace(/:/g,'.'))
  }

  removeItem(key) {
    return this.storage.removeItem(key.replace(/:/g,'.'))
  }
}

console.log('[STORAGE] use id =', id)

module.exports = new Storage('./storage/' + id)
