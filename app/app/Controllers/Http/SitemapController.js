'use strict'

class SitemapController {

  index({ request, response }) {

    response.json({
      massage: 'searching...'
    });

  }

}

module.exports = SitemapController
