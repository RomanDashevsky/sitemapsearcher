const Drive = use('Drive')
const parseString = require('xml2js').parseString

class SiteMapManager {

  static async getUrlFromSiteMap() {

    const siteMapXML = await Drive.get(__dirname + '/../../sitemap.xml')

    // cover xml2js by promise, make it async/await like
    const siteMapJSON = await new Promise((resolve, reject) => parseString(siteMapXML, function (err, result) {
      if (err) reject(err)
      else resolve(result)
    }))

    return siteMapJSON.urlset.url.map(function callback (currentValue, index, array) {
      return currentValue.loc[0]
    })

  }

}

module.exports = SiteMapManager
