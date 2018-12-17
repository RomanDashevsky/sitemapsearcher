'use strict'

const Logger = use('Logger')
const Env = use('Env')
const enableCache = Env.get('ENABLE_CACHE')
const CacheService = require('./CacheService')
const cheerio = require('cheerio')


const getPageHTML = async (url, page) => {

  if (enableCache === 'true') {
    const cacheHTML = await CacheService.get(url)

    if (cacheHTML) {
      return cacheHTML
    }
  }

  await page.goto(url)
  const html = await page.content()

  if (enableCache === 'true') {
    await CacheService.set(url, html)
  }

  return html
}

const initJquery = async (url, page) => {
  const html = await getPageHTML(url, page)
  return cheerio.load(html)
}

class PageProcessingService {

  static async searchWordInComponent(url, { selector, searchWord, empty }, page, result) {

    try {
      const $ = await initJquery(url, page)
      const elems = $(selector)

      for (let elemIndex = 0; elemIndex < elems.length; elemIndex++) {
        const elem = elems[elemIndex]
        const innerHtml = $(elem).html()

        if ((empty && innerHtml.indexOf(searchWord) < 0) || (!empty && innerHtml.indexOf(searchWord) >= 0)) {
          result.push(url)
          return
        }
      }

    } catch (e) {
      Logger.transport('file').error('error: %s', e.message)
    }
  }

  static async searchEmptyText(url, { tags }, page, result) {

    try {

      const $ = await initJquery(url, page)
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

  static async searchInnerElementInOuter(url, { outerSelector, innerSelector, empty }, page, result) {

    try {

      const $ = await initJquery(url, page)

      const outerElems = $(outerSelector)
      for (let elemIndex = 0; elemIndex < outerElems.length; elemIndex++) {

        const outerElem = $(outerElems[elemIndex])
        let innerElems = outerElem.find(innerSelector)
        if ((empty && !innerElems.length) || (!empty && innerElems.length)) {
          result.push(url)
          break
        }
      }
    } catch (e) {
      Logger.transport('file').error('error: %s', e.message)
    }
  }

  static async getPageInfo(url, options, page, result) {

    try {

      const $ = await initJquery(url, page)
      const title = $('title').text();
      const res = `${url};${title};\n`
      result[0] = result[0] + res

    } catch (e) {
      Logger.transport('file').error('error: %s', e.message)
    }
  }

}

module.exports = PageProcessingService
