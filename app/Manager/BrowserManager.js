'use strict'

const Env = use('Env')
const countOfProcesses = Env.get('COUNT_OF_PROCESSES')
const disableNonDomRequest = Env.get('DISABLE_NON_DOM_REQUEST')
const puppeteer = require('puppeteer')
const ProgressBar = require('ascii-progress')
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

  static async getResult(urlArray, options, callbackFunc) {

    const result = []
    const browser = await puppeteer.launch()

    try {

      const pagesPool = await BrowserManager.getPagesPool(browser)
      const countOfUrls = urlArray.length
      const bar = new ProgressBar({
        schema: '[:bar.green]\t:current/:total \t:percent\t:elapseds\t:etas',
        total: countOfUrls
      });

      let currentSearchingPromises = [];

      currentSearchingPromises.push(callbackFunc(urlArray[0], options, pagesPool[0], result))
      bar.tick()

      for (let i = 1; i < countOfUrls; i++) {

        bar.tick()

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
      await browser.close()
    }

    return result

  }

}

module.exports = BrowserManager
