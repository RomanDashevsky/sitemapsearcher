'use strict'

const BackgroundWorkerService = require('../../Services/BackgroundWorkerService')
const { tagsWithInnerText } = require('../../Utils/helper')

class SearchingPagesController {

  async word({ request, response }) {
    const searchWord = request._qs.word
    let empty = request._qs.empty || false
    let returnMessage;

    if (empty) {
      empty = true
      returnMessage = `Searching pages which haven't word '${searchWord}'...`
    } else {
      returnMessage = `Searching pages which have word '${searchWord}'...`
    }

    BackgroundWorkerService.searchWordInSiteMap({ searchWord, empty })
    response.json({'message': returnMessage})
  }

  async info({ request, response }) {
    BackgroundWorkerService.getPageInfo()
    response.json({'message': `Crawling pages, getting info...`})
  }

  async empty({ request, response }) {
    BackgroundWorkerService.searchEmptyElements({ tagsWithInnerText })
    response.json({'message': `Searching empty elements...`})
  }

  async outerInner({ request, response }) {
    const outerSelector = request._qs.outerSelector
    const innerSelector = request._qs.innerSelector
    let empty = request._qs.empty || false
    let returnMessage;

    if (empty) {
      empty = true
      returnMessage = `Searching pages which have outer elements ${outerSelector} which haven't inner elements ${innerSelector}...`
    } else {
      returnMessage = `Searching pages which have outer elements ${outerSelector} which have inner elements ${innerSelector}...`
    }

    BackgroundWorkerService.searchInnerElementInOuter({ outerSelector, innerSelector, empty } )
    response.json({'message': returnMessage})
  }

}

module.exports = SearchingPagesController
