'use strict'

const Env = use('Env')
const enableCache = Env.get('ENABLE_CACHE')
const CacheService = require('./CacheService')
const ViewPortService = require('./ViewPortService')

const viewPorts = ViewPortService.getViewports()

class PageService {

  static async getPageHTML(url, page) {
    if (enableCache === 'true') {
      const cacheHTML = await CacheService.get(url)

      if (cacheHTML) {
        return cacheHTML
      }
    }

    await page.goto(url)
    const resultHtml = {}

    for (const viewPortName in viewPorts) {
      await page.setViewport(viewPorts[viewPortName])
      resultHtml[viewPortName] = await page.content()
    }

    if (enableCache === 'true') {
      await CacheService.set(url, resultHtml)
    }

    return resultHtml
  }

}

module.exports = PageService
