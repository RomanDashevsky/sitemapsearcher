'use strict'

const Redis = use('Redis')

class CacheService {

  static async set(key, value) {
    await Redis.set(key, value)
  }

  static async get(key) {
    return await Redis.get(key)
  }

}

module.exports = CacheService
