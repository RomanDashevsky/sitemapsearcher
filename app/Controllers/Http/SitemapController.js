'use strict'

const Drive = use('Drive')
var parseString = require('xml2js').parseString

const getUrlFromSiteMap = async () => {
  console.log(__dirname)
  const siteMapXML = await Drive.get(__dirname + '/../../../sitemap.xml')

  // cover xml2js by promise, make it async/await like
  const siteMapJSON = await new Promise((resolve, reject) => parseString(siteMapXML, function (err, result) {
    if (err) reject(err)
    else resolve(result)
  }))

  const urlArray = siteMapJSON.urlset.url.map(function callback(currentValue, index, array) {
    return currentValue.loc[0]
  })

  return urlArray
}

class SitemapController {

  async index({ request, response }) {

    const urlArray = await getUrlFromSiteMap()

    response.json(urlArray)

  }

}

module.exports = SitemapController
