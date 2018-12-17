'use strict'

const BackgroundWorkerService = require('../../Services/BackgroundWorkerService')
const { tagsWithInnerText } = require('../../Utils/helper')
const ResponseMessengerService = require('../../Services/ResponseMessengerService')

class SearchingPagesController {

  async word({ request, response }) {
    const searchWord = request._qs.word
    const selector = request._qs.selector || 'html'
    const empty = !!request._qs.empty
    const options = { selector, searchWord, empty }
    const responseMessage = ResponseMessengerService.getWordMessage(options)
    BackgroundWorkerService.searchWordInComponent(options)
    console.log(responseMessage)
    response.json({'message': responseMessage})
  }

  async info({ request, response }) {
    const responseMessage = ResponseMessengerService.getPageInfoMessage()
    BackgroundWorkerService.getPageInfo()
    console.log(responseMessage)
    response.json({'message': responseMessage})
  }

  async empty({ request, response }) {
    const responseMessage = ResponseMessengerService.getEmptyMessage()
    BackgroundWorkerService.searchEmptyElements({ tagsWithInnerText })
    console.log(responseMessage)
    response.json({'message': responseMessage})
  }

  async outerInner({ request, response }) {
    const outerSelector = request._qs.outerSelector
    const innerSelector = request._qs.innerSelector
    const empty = !!request._qs.empty
    const options = { outerSelector, innerSelector, empty }
    const responseMessage = ResponseMessengerService.getOuterInnerMessage(options)
    BackgroundWorkerService.searchInnerElementInOuter(options)
    console.log(responseMessage);
    response.json({'message': responseMessage})
  }

}

module.exports = SearchingPagesController
