'use strict'

const Redis = use('Redis')

class CacheService {

  static async set(key, value) {
    await Redis.set(key, JSON.stringify(value))
  }

  static async get(key) {
    return JSON.parse(await Redis.get(key))
  }
}

module.exports = CacheService
