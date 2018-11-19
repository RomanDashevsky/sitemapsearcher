const Env = use('Env')
const countOfProcesses = Env.get('COUNT_OF_PROCESSES')
const { By } = require('selenium-webdriver')
const WebDriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const path = require('chromedriver').path
const service = new chrome.ServiceBuilder(path).build()
chrome.setDefaultService(service)

const defaultAltArray = [
  'Purple hero (default)',
  'Microscope hero',
  'Flask hero',
  'Microbe hero',
  'Green-blue hero',
  'Bubbles hero',
  'Pink hero',
  'Net hero',
  'Net hero',
]



class WebDriverManager {

  static async searchWordOnPage(url, components, driver, pages) {

    await driver.get(url)
    const element = await driver.findElement(By.css('html'))
    const title = await driver.getTitle()

    for (const componentClass in components) {
      if (components.hasOwnProperty(componentClass)) {

        try {
          const foundComponents = await driver.findElements(By.css(`.${componentClass} img`))

          for (const indexOfFoundComponent in foundComponents) {

            const foundComponent = foundComponents[indexOfFoundComponent];
            const src = await foundComponent.getAttribute('src')
            const alt = await foundComponent.getAttribute('alt')
            const isDefault = defaultAltArray.indexOf(alt) > -1

            const res = `${url};${title};${components[componentClass]};${src};${alt};${isDefault};\n`
            console.log(res);
            pages[0] = pages[0] + res

          }
        } catch (e) {
          console.log(e)
        }


      }
    }

  }


  static async getPagesWithSearchingContent(urlArray, components) {

    const driverPool = [];

    for (let i = 0; i < countOfProcesses; i++) {
      const driver = await new WebDriver.Builder()
        .withCapabilities(WebDriver.Capabilities.chrome())
        .build()
      driverPool.push(driver)
    }

    let pages = ['']

    try {
      const countOfUrls = urlArray.length
      let currentSearchingPromises = [];

      currentSearchingPromises.push(WebDriverManager.searchWordOnPage(urlArray[0], components, driverPool[0], pages))

      for (let i = 1; i < countOfUrls; i++) {

        currentSearchingPromises.push(WebDriverManager.searchWordOnPage(urlArray[i], components, driverPool[i % countOfProcesses], pages))
        if (i % countOfProcesses === 0) {
          await Promise.all(currentSearchingPromises)
          currentSearchingPromises = []
        }

      }

      await Promise.all(currentSearchingPromises)

    } catch (e) {
      throw e
    } finally {
      for (const driver of driverPool) {
        driver.quit()
      }
    }

    return pages

  }

}

module.exports = WebDriverManager
