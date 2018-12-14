'use strict'

const Env = use('Env')
const urlSource = Env.get('URL_SOURCE')
const SiteMapManager = require('./SiteMapManager')

const sourceFuncMap = {
  'sitemap': SiteMapManager.getUrlFromSiteMap
}

class SourceManager {

  static async getUrlArray() {
    const getUrlArrayFunc = sourceFuncMap[urlSource]

    if (!getUrlArrayFunc) {
      return []
    }

    return getUrlArrayFunc()
  }
}

module.exports = SourceManager
