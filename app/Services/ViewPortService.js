'use strict'

const Env = use('Env')
const enableViewPorts = Env.get('ENABLE_VIEWPORTS')
const viewPortsRaw = Env.get('VIEWPORTS')

class ViewPortService {

  static getViewports() {

    let viewPorts = JSON.parse(viewPortsRaw)

    if (enableViewPorts !== 'true') {
      for (const viewPortName in viewPorts) {
        viewPorts = { defaultViewPort: viewPorts[viewPortName] }
        break
      }
    }

    return viewPorts
  }

}

module.exports = ViewPortService
