'use strict'

const cacheMap = new Map()

class CacheService {

  static async set(key, value) {
    cacheMap.set(key, value)
  }

  static async get(key) {
    return cacheMap.get(key)
  }

}

module.exports = CacheService
