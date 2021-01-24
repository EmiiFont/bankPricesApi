class InstagramScrapper {
  constructor() {
    this.config = require('./config/intagramConfig.json');
  }

  async initPuppeter() {
    const puppeteer = require('puppeteer');
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
      userDataDir: './user_data',
    });
    this.page = await this.browser.newPage();
    this.page.setViewport({ width: 1500, height: 764 });
  }

  async closeBrowser() {
    await this.browser.close();
  }

  async visitInstagram() {
    await this.page.goto(this.config.base_url, { timeout: 60000 });
    await this.page.waitFor(2500);
    // await this.page.click(this.config.selectors.home_to_login_button);
    // await this.page.waitFor(2500);
    /* Click on the username field using the field selector*/
    await this.page.click(this.config.selectors.username_field);
    await this.page.keyboard.type(this.config.username);
    await this.page.click(this.config.selectors.password_field);
    await this.page.keyboard.type(this.config.password);
    await this.page.click(this.config.selectors.login_button);
    await this.page.waitForNavigation();
    // Close Turn On Notification modal after login
    await this.page.click(this.config.selectors.save_user_info);
    await this.page.waitFor(2500);
    await this.page.click(this.config.selectors.not_now_button);
  }

  async visitInstagramWithUserData() {
    await this.page.goto(this.config.base_url, { timeout: 60000 });
    await this.page.waitFor(2500);
  }

  async visitCaplaRD() {
    try {
      await this.page.goto(`${this.config.base_url}/caplard/`);
      await this.page.waitFor(1500 + Math.floor(Math.random() * 500));
      await this.page.click(this.config.selectors.story_button_class);
      await this.page.waitFor(600);

      // if(elementExist(this.page)){
      //     var d = "aa";
      // }
      // //let cookiesLink = await this.page.click('body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.bIiDR');

      const imageLink = await this.page.$(this.config.selectors.story_img_class);
      const imagesrc = await this.page.evaluate((element) => element.src, imageLink);

      return imagesrc;
    } catch (error) {
      sentry.captureException(error);
      console.log(error);
      return '';
    }
  }
}

async function elementExist(page) {
  try {
    await page.$('body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.bIiDR');
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = InstagramScrapper;
