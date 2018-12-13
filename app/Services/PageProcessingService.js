'use strict'

const Logger = use('Logger')

class PageProcessingService {

  static async searchWordOnPage(url, { searchWord }, tab, result) {

    try {
      await tab.goto(url)
      const html = await tab.content()

      if (html.indexOf(searchWord) >= 0) {
        result.push(url)
      }

    } catch (e) {
      Logger.transport('file').error('error: %j', e)
    }

  }

  static async searchEmptyText(url, { tags }, tab, result) {

    try {

      await tab.goto(url)
      const title = await tab.getTitle()

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
          Logger.transport('file').error('error: %j', e)
        }
      })

    } catch (e) {
      Logger.transport('file').error('error: %j', e)
    }

  }

  static async searchInnerElementInOuter(url, { outerSelector, innerSelector, empty }, tab, result) {

    try {

      await tab.goto(url)

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
      Logger.transport('file').error('error: %j', e)
    }
  }

}

module.exports = PageProcessingService
