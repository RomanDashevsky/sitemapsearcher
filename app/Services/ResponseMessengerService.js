class ResponseMessengerService {

  static getWordMessage({searchWord, selectors, empty, excludeSelectors}) {
    let message = 'Searching pages which '

    message += empty ? 'haven\'t ' : 'have '
    message += `word '${searchWord}'.`

    if (selectors) {
      message += ` In '${selectors}' selectors...`
    }

    if (excludeSelectors) {
      message += ` Exclude components with selectors '${excludeSelectors}'...`
    }

    return message
  }

  static getAttrMessage({selectors, searchAttr, attrValue, strict, empty, excludeSelectors}) {
    let message = 'Searching pages which '

    message += empty ? 'haven\'t ' : 'have '
    message += `component that has selector '${selectors}'.`

    if (searchAttr) {
      message += ` and '${searchAttr}' attribute `
    }

    if (attrValue) {
      message += ` with value '${attrValue}'...`
    }

    message += strict ? ' Strict comparison. ' : ' Non Strict comparison (value consist query value). '

    if (excludeSelectors) {
      message += ` Exclude components with selectors '${excludeSelectors}'...`
    }

    return message
  }

  static getPageInfoMessage() {
    return 'Crawling pages, getting info...'
  }

  static getEmptyMessage({excludeSelectors}) {
    let message = 'Searching empty elements...'

    if (excludeSelectors) {
      message += ` Exclude components with selectors '${excludeSelectors}'...`
    }

    return message
  }

  static getOuterInnerMessage({outerSelectors, innerSelector, empty, excludeSelectors}) {
    let message = 'Searching pages which '

    message += empty ? 'haven\'t ' : 'have '
    message += `inner component '${innerSelector}'.`

    if (outerSelectors) {
      message += ` In outer component '${outerSelectors}'...`
    }

    if (excludeSelectors) {
      message += ` Exclude components with selectors '${excludeSelectors}'...`
    }

    return message
  }
}

module.exports = ResponseMessengerService
