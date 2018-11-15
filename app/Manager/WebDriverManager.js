const Env = use('Env')
const countOfProcesses = Env.get('COUNT_OF_PROCESSES')
const { By } = require('selenium-webdriver')
const WebDriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const path = require('chromedriver').path
const service = new chrome.ServiceBuilder(path).build()
chrome.setDefaultService(service)


class WebDriverManager {

  static async searchWordOnPage(url, searchWord, driver, pages) {

    await driver.get(url)
    const element = await driver.findElement(By.css('html'))
    const html = await element.getAttribute('innerHTML')

    if (html.indexOf(searchWord) >= 0) {
      console.log(url);
      pages.push(url)
    }

  }


  static async getPagesWithSearchingContent(urlArray, searchWord) {

    const driverPool = [];

    for (let i = 0; i < countOfProcesses; i++) {
      const driver = await new WebDriver.Builder()
        .withCapabilities(WebDriver.Capabilities.chrome())
        .build()
      driverPool.push(driver)
    }

    const pages = []

    try {
      const countOfUrls = urlArray.length
      let currentSearchingPromises = [];

      currentSearchingPromises.push(WebDriverManager.searchWordOnPage(urlArray[0], searchWord, driverPool[0], pages))

      for (let i = 1; i < countOfUrls; i++) {

        currentSearchingPromises.push(WebDriverManager.searchWordOnPage(urlArray[i], searchWord, driverPool[i % countOfProcesses], pages))
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
