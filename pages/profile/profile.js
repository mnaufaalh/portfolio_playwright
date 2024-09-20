exports.Profile = class Profile {
  constructor(page) {
    this.page = page;
    this.getBuyingDashboardButton = page
      .locator('.menu-item')
      .filter({ hasText: /^Buying Dashboard$/ });
  }
};
