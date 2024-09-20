exports.MidtransSnap = class MidtransSnap {
  constructor(page) {
    this.page = page;
    this.frameLocator = page.frameLocator('[id="snap-midtrans"]');
    this.cvvField = this.frameLocator.locator('#card-cvv');
    this.payNowButton = this.frameLocator.getByText('Pay now');
    this.passwordField = this.frameLocator
      .frameLocator('iframe')
      .locator('[type="password"]');
    this.submitButton = this.frameLocator
      .frameLocator('iframe')
      .locator('[type="submit"]');
    this.OKButton = this.frameLocator.locator('[type="button"]', {
      hasText: 'OK'
    });
  }

  async bankLogoOnVirtualAccountButton(bankVA) {
    try {
      return this.frameLocator.getByText(bankVA).click();
    } catch (error) {
      console.error('Error get bank logo VA:', error);
      return null;
    }
  }
};
