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



  static async searchEmptyText(url, driver, tags, pages) {

    await driver.get(url)
    const title = await driver.getTitle()

    tags.forEach(async (tag) => {

      try {
        const foundComponents = await driver.findElements(By.css(`${tag}`))

        for (const indexOfFoundComponent in foundComponents) {

          const foundComponent = foundComponents[indexOfFoundComponent];
          const elemID = await foundComponent.getAttribute('id')
          const elemClass = await foundComponent.getAttribute('class')
          let innerText = await foundComponent.getAttribute('innerText');
          let innerHTML = await foundComponent.getAttribute('innerHTML');

          innerText = innerText.trim();

          if (!innerText && !innerHTML) {
            const res = `${url};${title};${tag};${elemID};${elemClass};\n`
            console.log(res);
            pages[0] = pages[0] + res
          }
        }
      } catch (e) {
        console.log(e)
      }

    })
  }


  static async getPagesWithEmptyText(urlArray) {

    const driverPool = [];

    for (let i = 0; i < countOfProcesses; i++) {
      const driver = await new WebDriver.Builder()
        .withCapabilities(WebDriver.Capabilities.chrome())
        .build()
      driverPool.push(driver)
    }

    let pages = ['']
    let tags = [
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

    try {
      const countOfUrls = urlArray.length
      let currentSearchingPromises = [];

      currentSearchingPromises.push(WebDriverManager.searchEmptyText(urlArray[0], driverPool[0], tags, pages))

      for (let i = 1; i < countOfUrls; i++) {

        currentSearchingPromises.push(WebDriverManager.searchEmptyText(urlArray[i], driverPool[i % countOfProcesses], tags, pages))
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
