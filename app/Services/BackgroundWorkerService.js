'use strict'

const Drive = use('Drive')
const SourceManager = require('../Manager/SourceManager')
const BrowserManager = require('../Manager/BrowserManager')
const PageProcessingService = require('./PageProcessingService')

class BackgroundWorkerService {

  static async  searchWordInComponent(options) {
    const urlArray = await SourceManager.getUrlArray()
    const result = await BrowserManager.getResult(urlArray, options, PageProcessingService.searchWordInComponent)
    await Drive.put('word.json', JSON.stringify({
        'searchWord': options.searchWord,
        'selector': options.selector,
        'excludeSelectors': options.excludeSelectors,
        'result': result
      }))
  }

  static async  getPageInfo() {
    const urlArray = await SourceManager.getUrlArray()
    const result = await BrowserManager.getResult(urlArray, null, PageProcessingService.getPageInfo)
    await Drive.put('info.csv', result[0])
  }

  static async  searchEmptyElements(options) {
    const urlArray = await SourceManager.getUrlArray()
    const result = await BrowserManager.getResult(urlArray, options, PageProcessingService.searchEmptyText)
    await Drive.put('empty.csv', result[0])
  }

  static async  searchInnerElementInOuter(options) {
    const urlArray = await SourceManager.getUrlArray()
    const result = await BrowserManager.getResult(urlArray, options, PageProcessingService.searchInnerElementInOuter)
    await Drive.put('outer-inner.json', JSON.stringify({
      'outerSelector': options.outerSelector,
      'innerSelector': options.innerSelector,
      'empty': options.empty,
      'excludeSelectors': options.excludeSelectors,
      'result': result
    }))
  }

}

module.exports = BackgroundWorkerService
