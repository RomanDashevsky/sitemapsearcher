'use strict'

const Drive = use('Drive')
const SiteMapManager = require('../../Manager/SiteMapManager')
const WebDriverManager = require('../../Manager/WebDriverManager')

const searchWordInSiteMap = async (components) => {
  const urlArray = await SiteMapManager.getUrlFromSiteMap()
  const result = await WebDriverManager.getPagesWithSearchingContent(urlArray, components)
  await Drive.put('result.csv', result[0])
}

class SiteMapController {

  async index({ request, response }) {
    const components = {
      'landing-hero__background-image': 'Hero image',
      'home-hero__background-image': 'Hero image',
      'article-hero__background-image': 'Hero image',
      'landing-article-hero__background-image': 'Hero image',
      'home-video-hero__background-video': 'Hero video',
      'landing-video-hero__background-image': 'Hero video',
      'gateway-tile__background': 'Gateway component with optional component body copy (simple)',
      'three-up-hero__background-image': '3 Call Out Gateway component',
      'tile__background': 'Tile layout',
      'stats__background': 'Statistics Component'
    }

    searchWordInSiteMap(components);
    response.json({'message': `Start searching ''`})
  }

}

module.exports = SiteMapController
