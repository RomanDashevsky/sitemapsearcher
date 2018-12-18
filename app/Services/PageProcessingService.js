'use strict'

const Logger = use('Logger')
const PageService = require('./PageService')
const JqueryService = require('./JqueryService')

class PageProcessingService {

  static async searchWordInComponent(url, { selector, searchWord, empty, excludeSelectors }, page, result) {

    try {
      const viewportsHTML = await PageService.getPageHTML(url, page)
      for (const viewPortName in viewportsHTML) {
        const html = viewportsHTML[viewPortName]

        const $ = await JqueryService.initJquery(html, excludeSelectors)
        const elems = $(selector)

        for (let elemIndex = 0; elemIndex < elems.length; elemIndex++) {
          const elem = elems[elemIndex]
          const innerHtml = $(elem).html()

          if ((empty && innerHtml.indexOf(searchWord) < 0) || (!empty && innerHtml.indexOf(searchWord) >= 0)) {
            result.push(url)
            return
          }
        }
      }
    } catch (e) {
      Logger.transport('file').error('error: %s', e.message)
    }
  }

  static async getPageInfo(url, options, page, result) {

    try {

      const viewportsHTML = await PageService.getPageHTML(url, page)
      for (const viewPortName in viewportsHTML) {
        const html = viewportsHTML[viewPortName]

        const $ = await JqueryService.initJquery(html, excludeSelectors)
        const title = $('title').text();
        const res = `${url};${title};\n`
        result.push(res)
      }

    } catch (e) {
      Logger.transport('file').error('error: %s', e.message)
    }
  }

  static async searchEmptyText(url, { tags }, page, result) {

    try {

      const viewportsHTML = await PageService.getPageHTML(url, page)
      for (const viewPortName in viewportsHTML) {
        const html = viewportsHTML[viewPortName]

        const $ = await JqueryService.initJquery(html, excludeSelectors)
        const title = $('title').text();

        tags.forEach(async (tag) => {
          try {
            const elems = $(tag)

            for (let elemIndex = 0; elemIndex < elems.length; elemIndex++) {

              const elem = $(elems[elemIndex])
              const elemID = elem.attr('id')
              const elemClass = elem.attr('class')
              let innerText = elem.attr('innerText')
              let innerHTML = elem.attr('innerHTML')

              innerText = innerText.trim()

              if (!innerText && !innerHTML) {
                const res = `${url};${title};${tag};${elemID};${elemClass};\n`
                result.push(res)
              }
            }
          } catch (e) {
            Logger.transport('file').error('error: %s', e.message)
          }
        })
      }

    } catch (e) {
      Logger.transport('file').error('error: %s', e.message)
    }
  }

  static async searchInnerElementInOuter(url, { outerSelector, innerSelector, empty, excludeSelectors }, page, result) {

    try {

      const viewportsHTML = await PageService.getPageHTML(url, page)
      for (const viewPortName in viewportsHTML) {
        const html = viewportsHTML[viewPortName]

        const $ = await JqueryService.initJquery(html, excludeSelectors)
        const outerElems = $(outerSelector)
        for (let elemIndex = 0; elemIndex < outerElems.length; elemIndex++) {

          const outerElem = $(outerElems[elemIndex])
          let innerElems = outerElem.find(innerSelector)
          if ((empty && !innerElems.length) || (!empty && innerElems.length)) {
            result.push(url)
            break
          }
        }
      }
    } catch (e) {
      Logger.transport('file').error('error: %s', e.message)
    }
  }

}

module.exports = PageProcessingService
