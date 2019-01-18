'use strict'

const BackgroundWorkerService = require('../../Services/BackgroundWorkerService')
const { tagsWithInnerText, getStringFromQueryArrayParam } = require('../../Utils/helper')
const ResponseMessengerService = require('../../Services/ResponseMessengerService')

class SearchingPagesController {

  async word({ request, response }) {
    const searchWord = request._qs.word
    const selectors = getStringFromQueryArrayParam(request._qs.selectors) || 'html'
    const empty = !!request._qs.empty
    const excludeSelectors = request._qs.excludeSelectors ? getStringFromQueryArrayParam(request._qs.excludeSelectors) : null
    const options = { selectors, searchWord, empty, excludeSelectors }
    const responseMessage = ResponseMessengerService.getWordMessage(options)
    BackgroundWorkerService.searchWordInComponent(options)
    console.log(responseMessage)
    response.json({'message': responseMessage})
  }

  async attribute({ request, response }) {
    const selectors = getStringFromQueryArrayParam(request._qs.selectors)
    const searchAttr = request._qs.attr
    const attrValue = request._qs.value
    const strict = !!request._qs.strict
    const empty = !!request._qs.empty
    const excludeSelectors = request._qs.excludeSelectors ? getStringFromQueryArrayParam(request._qs.excludeSelectors) : null
    const options = { selectors, searchAttr, attrValue, strict, empty, excludeSelectors }
    const responseMessage = ResponseMessengerService.getAttrMessage(options)
    BackgroundWorkerService.searchComponentWithAttr(options)
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
    const excludeSelectors = request._qs.excludeSelectors ? getStringFromQueryArrayParam(request._qs.excludeSelectors) : null
    const options = { tagsWithInnerText, excludeSelectors }
    const responseMessage = ResponseMessengerService.getEmptyMessage(options)
    BackgroundWorkerService.searchEmptyElements(options)
    console.log(responseMessage)
    response.json({'message': responseMessage})
  }

  async outerInner({ request, response }) {
    const outerSelectors = getStringFromQueryArrayParam(request._qs.outerSelectors)
    const innerSelector = request._qs.innerSelector
    const empty = !!request._qs.empty
    const excludeSelectors = request._qs.excludeSelectors ? getStringFromQueryArrayParam(request._qs.excludeSelectors) : null
    const options = { outerSelectors, innerSelector, empty, excludeSelectors }
    const responseMessage = ResponseMessengerService.getOuterInnerMessage(options)
    BackgroundWorkerService.searchInnerElementInOuter(options)
    console.log(responseMessage);
    response.json({'message': responseMessage})
  }

}

module.exports = SearchingPagesController
