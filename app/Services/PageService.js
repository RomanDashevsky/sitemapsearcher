'use strict'

const Env = use('Env')
const enableCache = Env.get('ENABLE_CACHE')
const CacheService = require('./CacheService')
const cheerio = require('cheerio')


class PageService {

  static async getPageHTML(url, page) {
    if (enableCache === 'true') {
      const cacheHTML = await CacheService.get(url)

      if (cacheHTML) {
        return cacheHTML
      }
    }

    await page.goto(url)
    const html = await page.content()

    if (enableCache === 'true') {
      await CacheService.set(url, html)
    }

    return html
  }

  static async initJquery(url, page) {
    const html = await PageService.getPageHTML(url, page)
    return cheerio.load(html)
  }

}

module.exports = PageService
