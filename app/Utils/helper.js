module.exports = {
  'onlyDomRequest': function(req) {
    const whitelist = ['document', 'script', 'xhr', 'fetch']

    if(!whitelist.includes(req.resourceType())) {
      return req.abort()
    }

    req.continue()
  }
}
