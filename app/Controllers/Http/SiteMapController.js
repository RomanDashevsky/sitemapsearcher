'use strict'

const Drive = use('Drive')
const SiteMapManager = require('../../Manager/SiteMapManager')
const WebDriverManager = require('../../Manager/WebDriverManager')


class SiteMapController {

  async index({ request, response }) {

    const searchWord = request._qs.word
    const urlArray = await SiteMapManager.getUrlFromSiteMap()
    const result = await WebDriverManager.getPagesWithSearchingContent(urlArray, searchWord)

    await Drive.put('result.json', JSON.stringify({'searchWord': searchWord, 'result': result}))

    response.json({'message': `Start searching '${searchWord}'`})
  }

}

module.exports = SiteMapController
