'use strict'

const Logger = use('Logger')
const PageService = require('./PageService')
const JqueryService = require('./JqueryService')

class PageProcessingService {

  static async searchWordInComponent(url, { selectors, searchWord, empty, excludeSelectors }, page, result) {

    try {
      const viewportsHTML = await PageService.getPageHTML(url, page)
      for (const viewPortName in viewportsHTML) {
        const html = viewportsHTML[viewPortName]

        const $ = await JqueryService.initJquery(html, excludeSelectors)
        const elems = $(selectors)

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
      Logger.transport('file').error(e.message)
    }
  }

  static async searchComponentWithAttr(url, { selectors, searchAttr, attrValue, strict, empty, excludeSelectors }, page, result) {

    try {
      const viewportsHTML = await PageService.getPageHTML(url, page)
      for (const viewPortName in viewportsHTML) {
        const html = viewportsHTML[viewPortName]

        const $ = await JqueryService.initJquery(html, excludeSelectors)
        const elems = $(selectors)

        for (let elemIndex = 0; elemIndex < elems.length; elemIndex++) {
          const elem = elems[elemIndex]
          const currentAttrValue = String($(elem).attr(searchAttr))

          if (strict && currentAttrValue === attrValue
            || (empty && currentAttrValue.indexOf(attrValue) < 0)
            || (!empty && currentAttrValue.indexOf(attrValue) >= 0)) {

            result.push(url)
            return
          }
        }
      }
    } catch (e) {
      Logger.transport('file').error(e.message)
    }
  }

  static async getPageInfo(url, options, page, result) {

    try {

      const viewportsHTML = await PageService.getPageHTML(url, page)
      for (const viewPortName in viewportsHTML) {
        const html = viewportsHTML[viewPortName]

        const $ = await JqueryService.initJquery(html)
        const title = $('title').text();
        const res = `${url};${title};\n`
        result.push(res)
      }

    } catch (e) {
      Logger.transport('file').error(e.message)
    }
  }

  static async searchEmptyText(url, { tagsWithInnerText, excludeSelectors }, page, result) {

    try {

      const viewportsHTML = await PageService.getPageHTML(url, page)
      for (const viewPortName in viewportsHTML) {
        const html = viewportsHTML[viewPortName]

        const $ = await JqueryService.initJquery(html, excludeSelectors)
        const title = $('title').text();

        for (const tagIndex in tagsWithInnerText) {
          const tag = tagsWithInnerText[tagIndex]
          const elems = $(tag)

          for (let elemIndex = 0; elemIndex < elems.length; elemIndex++) {

            const elem = $(elems[elemIndex])
            const elemID = elem.attr('id')
            const elemClass = elem.attr('class')
            let innerText = elem.text()
            let innerHTML = elem.html()

            if(innerText) {
              innerText = innerText.trim()
            }

            if (!innerText && !innerHTML) {
              const res = `${url};${title};${tag};${elemID};${elemClass};\n`
              result.push(res)
            }
          }
        }
      }
    } catch (e) {
      Logger.transport('file').error(e.message)
    }
  }

  static async searchInnerElementInOuter(url, { outerSelectors, innerSelector, empty, excludeSelectors }, page, result) {

    try {

      const viewportsHTML = await PageService.getPageHTML(url, page)
      for (const viewPortName in viewportsHTML) {
        const html = viewportsHTML[viewPortName]

        const $ = await JqueryService.initJquery(html, excludeSelectors)
        const outerElems = $(outerSelectors)
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
      Logger.transport('file').error(e.message)
    }
  }

}

module.exports = PageProcessingService
