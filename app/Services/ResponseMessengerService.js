class ResponseMessengerService {

  static getWordMessage({searchWord, selector, empty}) {
    if (empty) {
      return `Searching pages which haven't word '${searchWord}' in '${selector}' selector...`
    } else {
      return `Searching pages which have word '${searchWord}' in '${selector}' selector...`
    }
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
