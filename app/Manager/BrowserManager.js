'use strict'

const Env = use('Env')
const countOfProcesses = Env.get('COUNT_OF_PROCESSES')
const disableNonDomRequest = Env.get('DISABLE_NON_DOM_REQUEST')
const puppeteer = require('puppeteer')
const ProgressBar = require('ascii-progress')
const { onlyDomRequest } = require('../Utils/helper')

class BrowserManager {


  static async getTabPool(browser) {
    const tabPool = []

    for (let i = 0; i < countOfProcesses; i++) {
      const tab = await browser.newPage()

      if (disableNonDomRequest === "true") {
        tab.setRequestInterception(true)
        tab.on('request', onlyDomRequest)
      }

      tabPool.push(tab)
    }

    return tabPool
  }

  static async getResult(urlArray, options, callbackFunc) {

    const result = []
    const browser = await puppeteer.launch()

    try {

      const tabPool = await BrowserManager.getTabPool(browser)
      const countOfUrls = urlArray.length
      const bar = new ProgressBar({
        schema: '[:bar.green]\t:current/:total \t:percent\t:elapseds\t:etas',
        total: countOfUrls
      });

      let currentSearchingPromises = [];

      currentSearchingPromises.push(callbackFunc(urlArray[0], options, tabPool[0], result))
      bar.tick()

      for (let i = 1; i < countOfUrls; i++) {

        bar.tick()

        currentSearchingPromises.push(callbackFunc(urlArray[i], options, tabPool[i % countOfProcesses], result))
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
