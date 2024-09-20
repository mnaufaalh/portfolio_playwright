exports.LocalStorage = class LocalStorage {
  constructor(page) {
    this.page = page;
    this.keyAccessToken = process.env.ACCESS_TOKEN;
    this.shippingFee = process.env.SHIPPING_FEE;
  }

  async setLogin(accessToken) {
    try {
      await this.page.evaluate(
        ({ key, token }) => {
          localStorage.setItem(key, token);
        },
        { key: this.keyAccessToken, token: accessToken }
      );
      await this.page.reload();
    } catch (error) {
      console.error('Error setting item in local storage:', error);
      return null;
    }
  }

  async getShippingFee() {
    try {
      await this.page.waitForFunction((key) => {
        return localStorage.getItem(key) !== null;
      }, this.shippingFee);
      const response = await this.page.evaluate((key) => {
        return localStorage.getItem(key);
      }, this.shippingFee);
      return JSON.parse(atob(response))[0].data;
    } catch (error) {
      console.error('Error getting shipping fee from local storage:', error);
      return null;
    }
  }
};
