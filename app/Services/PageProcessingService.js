'use strict'

const Logger = use('Logger')
const CacheService = require('./CacheService')

const getTab = async (url, freeTab) => {

  const cacheTab = await CacheService.get(url)

  if (cacheTab) {
    return cacheTab
  }

  await freeTab.goto(url)
  await CacheService.set(url, freeTab)

  return freeTab
}

class PageProcessingService {

  static async searchWordOnPage(url, { searchWord, empty }, freeTab, result) {

    try {
      const tab = await getTab(url, freeTab)
      const html = await tab.content()

      if ((empty && html.indexOf(searchWord) < 0) || (!empty && html.indexOf(searchWord) >= 0)) {
        result.push(url)
      }

    } catch (e) {
      Logger.transport('file').error('error: %s', e.message)
    }
  }

  static async searchEmptyText(url, { tags }, freeTab, result) {

    try {

      const tab = await getTab(url, freeTab)
      const title = await tab.title()

      tags.forEach(async (tag) => {
        try {
          const foundComponents = await tab.$$(`${tag}`)

          for (const indexOfFoundComponent in foundComponents) {

            const foundComponent = foundComponents[indexOfFoundComponent]
            const elemID = await foundComponent.getProperty('id')
            const elemClass = await foundComponent.getProperty('class')
            let innerText = await foundComponent.getProperty('innerText')
            let innerHTML = await foundComponent.getProperty('innerHTML')

            innerText = innerText.trim()

            if (!innerText && !innerHTML) {
              const res = `${url};${title};${tag};${elemID};${elemClass};\n`
              result[0] = result[0] + res
            }
          }
        } catch (e) {
          Logger.transport('file').error('error: %s', e.message)
        }
      })

    } catch (e) {
      Logger.transport('file').error('error: %s', e.message)
    }
  }

  static async searchInnerElementInOuter(url, { outerSelector, innerSelector, empty }, freeTab, result) {

    try {

      const tab = await getTab(url, freeTab)

      const outerComponents = await tab.$$(`${outerSelector}`)
      for (const indexOfOuterComponents in outerComponents) {

        const outerComponent = outerComponents[indexOfOuterComponents]
        let innerComponent = await outerComponent.$$(`${innerSelector}`)
        if ((empty && !innerComponent.length) || (!empty && innerComponent.length)) {
          result.push(url)
          break
        }
      }
    } catch (e) {
      Logger.transport('file').error('error: %s', e.message)
    }
  }

  static async getPageInfo(url, options, freeTab, result) {

    try {

      const tab = await getTab(url, freeTab)
      const title = await tab.title()
      const res = `${url};${title};\n`
      result[0] = result[0] + res

    } catch (e) {
      Logger.transport('file').error('error: %s', e.message)
    }
  }

}

module.exports = PageProcessingService
