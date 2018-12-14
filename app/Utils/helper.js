module.exports = {
  'onlyDomRequest': function(req) {
    const whitelist = ['document', 'script', 'xhr', 'fetch']

    if(!whitelist.includes(req.resourceType())) {
      return req.abort()
    }

    req.continue()
  },

  'tagsWithInnerText': [
    'i',
    'b',
    'small',
    'em',
    'strong',
    'dfn',
    'code',
    'samp',
    'sub',
    'sup',
    'span',
    'div',
    'a',
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'pre',
    'q',
    'ins',
    'dt',
    'dd',
    'li',
    'label',
    'option',
    'textarea',
    'fieldset',
    'legend',
    'button',
    'caption',
    'td',
    'th',
    'title'
  ]
}
