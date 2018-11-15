'use strict'

const Drive = use('Drive')
const SiteMapManager = require('../../Manager/SiteMapManager')
const WebDriverManager = require('../../Manager/WebDriverManager')

const searchWordInSiteMap = async (searchWord) => {
  const urlArray = await SiteMapManager.getUrlFromSiteMap()
  const result = await WebDriverManager.getPagesWithSearchingContent(urlArray, searchWord)
  await Drive.put('result.json', JSON.stringify({'searchWord': searchWord, 'result': result}))
}

class SiteMapController {

  async index({ request, response }) {
    const searchWord = request._qs.word
    searchWordInSiteMap(searchWord);
    response.json({'message': `Start searching '${searchWord}'`})
  }

}

module.exports = SiteMapController
