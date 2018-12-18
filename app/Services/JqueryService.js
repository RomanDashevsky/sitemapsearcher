'use strict'

const cheerio = require('cheerio')

class JqueryService {

  static async initJquery(html, excludeSelectors = null) {
    const $ = cheerio.load(html)

    if (excludeSelectors) {
      $(excludeSelectors).remove()
    }

    return $
  }

}

module.exports = JqueryService
