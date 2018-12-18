class ResponseMessengerService {

  static getWordMessage({searchWord, selector, empty, excludeSelectors}) {
    let message = 'Searching pages which '

    message += empty ? 'haven\'t ' : 'have '
    message += `word '${searchWord}'.`

    if (selector) {
      message += ` In '${selector}' selector...`
    }

    if (excludeSelectors) {
      message += ` Exclude components with selectors '${excludeSelectors}'...`
    }

    return message
  }

  static getPageInfoMessage() {
    return 'Crawling pages, getting info...'
  }

  static getEmptyMessage() {
    return 'Searching empty elements...'
  }

  static getOuterInnerMessage({outerSelector, innerSelector, empty}) {
    if (empty) {
      return `Searching pages which have outer elements ${outerSelector} which haven't inner elements ${innerSelector}...`
    } else {
      return `Searching pages which have outer elements ${outerSelector} which have inner elements ${innerSelector}...`
    }
  }
}

module.exports = ResponseMessengerService
