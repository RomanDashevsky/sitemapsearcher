'use strict'

const Drive = use('Drive')
const parseString = require('xml2js').parseString
const { Builder, By, until } = require('selenium-webdriver');
const WebDriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;
const service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

const getUrlFromSiteMap = async () => {

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

const getPagesWithSearchingContent = async (urlArray, searchWord) => {

  let driver = await new WebDriver.Builder()
    .withCapabilities(WebDriver.Capabilities.chrome())
    .build();
  const pages = [];

  try {
    for (const url of urlArray) {
      await driver.get(url)
      // await driver.wait(until.titleIs('mock title, just wait'), 2000)
      const element = await driver.findElement(By.css('html'))
      const html = await element.getAttribute('innerHTML')

      if (html.indexOf(searchWord) >= 0) {
        console.log(url);
        pages.push(url)
      }
    }
  } catch (e) {
    throw e
  } finally {
    driver.quit()
  }

  return pages

}

const runSearch = async (searchWord) => {
  const urlArray = await getUrlFromSiteMap()
  const result = await getPagesWithSearchingContent(urlArray, searchWord)
  await Drive.put('result.json', JSON.stringify({'searchWord': searchWord, 'result': result}))
}

class SitemapController {

  async index({ request, response }) {
    const searchWord = request._qs.word
    runSearch(searchWord)
    response.json({'message': `Start searching '${searchWord}'`})
  }

}

module.exports = SitemapController