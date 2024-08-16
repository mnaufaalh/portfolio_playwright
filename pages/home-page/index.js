const { Banner } = require('../../services/console/creative/banner/banner');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.banner = new Banner(page)
    this.closeBanner = page.locator('.dont-show-again');
    this.loginButton = page.locator('.ant-col > p:has-text("Login")');
    this.userNameInHomepage = page.locator('.ButtonProfile_profile-email__3kweB');
    this.searchButton = page.locator('.ant-input-prefix');
    this.searchBar = page.locator('.ant-col >> input[placeholder="Type any products here"]');
  }

  async isBanner(request) {
    try {
      const isBannerPresent = await this.banner.isBanner(request);
      if (isBannerPresent.length) {
        await this.closeBanner.click();
      }
      return isBannerPresent;
    } catch (error) {
      console.error('Error checking banner:', error);
      return false;
    }
  }
};