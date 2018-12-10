'use strict'

const Drive = use('Drive')
const SiteMapManager = require('../../Manager/SiteMapManager')
const WebDriverManager = require('../../Manager/WebDriverManager')

const searchWordInSiteMap = async (searchWord) => {
  const urlArray = await SiteMapManager.getUrlFromSiteMap()
  const result = await WebDriverManager.getPagesWithSearchingContent(urlArray, searchWord)
  await Drive.put('result.json', JSON.stringify({'searchWord': searchWord, 'result': result}))
}

const searchEmptyElements = async () => {
  const urlArray = await SiteMapManager.getUrlFromSiteMap()
  const result = await WebDriverManager.getPagesWithEmptyText(urlArray)
  await Drive.put('empty.csv', result[0])
}

class SiteMapController {

  async index({ request, response }) {
    const searchWord = request._qs.word
    searchWordInSiteMap(searchWord);
    response.json({'message': `Start searching '${searchWord}'`})
  }

  async empty({ request, response }) {
    searchEmptyElements();
    response.json({'message': `Searching empty elements...`})
  }

}

module.exports = SiteMapController
