'use strict'

const Env = use('Env')
const countOfProcesses = Env.get('COUNT_OF_PROCESSES')
const dockerHost = Env.get('DOCKER_HOST')
const disableNonDomRequest = Env.get('DISABLE_NON_DOM_REQUEST')
const puppeteer = require('puppeteer')
const fetch = require('node-fetch')
// const ProgressBar = require('ascii-progress')
const { onlyDomRequest } = require('../Utils/helper')

class BrowserManager {


  static async getPagesPool(browser) {
    const pagesPool = []

    for (let i = 0; i < countOfProcesses; i++) {
      const page = await browser.newPage()

      if (disableNonDomRequest === "true") {
        page.setRequestInterception(true)
        page.on('request', onlyDomRequest)
      }

      pagesPool.push(page)
    }

    return pagesPool
  }

  static async getBrowserWSEndpoint(host, port = 9222) {
    const url = `http://${host}:${port}/json/version`
    const response = await fetch(url);
    const json = await response.json();
    return json.webSocketDebuggerUrl;
  }

  static async getResult(urlArray, options, callbackFunc) {

    const result = []
    const browserWSEndpoint = await BrowserManager.getBrowserWSEndpoint(dockerHost);
    console.log(browserWSEndpoint)
    const browser = await puppeteer.connect({
      browserWSEndpoint: browserWSEndpoint
    })

    const pagesPool = await BrowserManager.getPagesPool(browser)

    try {
      const countOfUrls = urlArray.length
      // const bar = new ProgressBar({
      //   schema: '[:bar.green]\t:current/:total \t:percent\t:elapseds\t:etas',
      //   total: countOfUrls
      // });

      let currentSearchingPromises = [];

      currentSearchingPromises.push(callbackFunc(urlArray[0], options, pagesPool[0], result))
      // bar.tick()

      for (let i = 1; i < countOfUrls; i++) {

        console.log(i)
        // bar.tick()

        currentSearchingPromises.push(callbackFunc(urlArray[i], options, pagesPool[i % countOfProcesses], result))
        if (i % countOfProcesses === 0) {
          await Promise.all(currentSearchingPromises)
          currentSearchingPromises = []
        }

      }

      await Promise.all(currentSearchingPromises)

      console.log('\nJob finished...');

    } catch (e) {
      throw e
    } finally {
      pagesPool.forEach(async (page) => {
        await page.close()
      })
    }

    return [...new Set(result)]

  }

}

module.exports = BrowserManager
