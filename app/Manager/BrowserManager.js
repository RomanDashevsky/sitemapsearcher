'use strict'

const Env = use('Env')
const countOfProcesses = Env.get('COUNT_OF_PROCESSES')
const puppeteer = require('puppeteer')
const ProgressBar = require('ascii-progress')
const { onlyDomRequest } = require('../Utils/helper')

class BrowserManager {

  static async getResult(urlArray, options, callbackFunc) {

    const result = []
    const browser = await puppeteer.launch()

    try {

      const tabPool = []

      for (let i = 0; i < countOfProcesses; i++) {
        const tab = await browser.newPage()
        tab.setRequestInterception(true)
        tab.on('request', onlyDomRequest)
        tabPool.push(tab)
      }

      const countOfUrls = urlArray.length
      let totalProgress = 0

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

      console.log('Job finished...');

    } catch (e) {
      throw e
    } finally {
      await browser.close()
    }

    return result

  }

}

module.exports = BrowserManager
