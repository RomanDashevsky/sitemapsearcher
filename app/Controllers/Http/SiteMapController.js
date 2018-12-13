'use strict'

const BackgroundWorkerService = require('../../Services/BackgroundWorkerService')

class SiteMapController {

  async index({ request, response }) {
    const searchWord = request._qs.word
    const options = { 'searchWord': searchWord }
    BackgroundWorkerService.searchWordInSiteMap(options)
    response.json({'message': `Start searching '${searchWord}'`})
  }

  async empty({ request, response }) {

    let tags = [
      'i',
      'b',
      'small',
      'em',
      'strong',
      'dfn',
      'code',
      'samp',
      'sub',
      'sup',
      'span',
      'div',
      'a',
      'p',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'pre',
      'q',
      'ins',
      'dt',
      'dd',
      'li',
      'label',
      'option',
      'textarea',
      'fieldset',
      'legend',
      'button',
      'caption',
      'td',
      'th',
      'title'
    ]

    BackgroundWorkerService.searchEmptyElements({ tags })
    response.json({'message': `Searching empty elements...`})
  }

  async findInner({ request, response }) {
    const outerSelector = request._qs.outerSelector
    const innerSelector = request._qs.innerSelector
    let empty = request._qs.empty || false
    let returnMessage;

    if (empty) {
      empty = true
      returnMessage = `Searching page that has outer elements ${outerSelector} which haven't inner elements ${innerSelector}...`
    } else {
      returnMessage = `Searching page that has outer elements ${outerSelector} which have inner elements ${innerSelector}...`
    }

    BackgroundWorkerService.searchInnerElementInOuter({ outerSelector, innerSelector, empty } )
    response.json({'message': returnMessage})
  }

}

module.exports = SiteMapController
