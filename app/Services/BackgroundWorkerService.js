'use strict'

const Drive = use('Drive')
const SiteMapManager = require('../Manager/SiteMapManager')
const BrowserManager = require('../Manager/BrowserManager')
const PageProcessingService = require('./PageProcessingService')

class BackgroundWorkerService {

  static async  searchWordInSiteMap(options) {
    const urlArray = await SiteMapManager.getUrlFromSiteMap()
    const result = await BrowserManager.getResult(urlArray, options, PageProcessingService.searchWordOnPage)
    await Drive.put('result.json', JSON.stringify({'searchWord': options.searchWord, 'result': result}))
  }

  static async  searchEmptyElements(options) {
    const urlArray = await SiteMapManager.getUrlFromSiteMap()
    const result = await BrowserManager.getResult(urlArray, options, PageProcessingService.searchEmptyText)
    await Drive.put('empty.csv', result[0])
  }

  static async  searchInnerElementInOuter(options) {
    const urlArray = await SiteMapManager.getUrlFromSiteMap()
    const result = await BrowserManager.getResult(urlArray, options, PageProcessingService.searchInnerElementInOuter)
    await Drive.put('outer-inner.json', JSON.stringify({'outerSelector': options.outerSelector, 'innerSelector': options.innerSelector, 'empty': options.empty, 'result': result}))
  }

}

module.exports = BackgroundWorkerService
