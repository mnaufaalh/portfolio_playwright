exports.MidtransWeb = class MidtransWeb {
  constructor(page) {
    this.page = page;
    this.virtualAccountButtonOnSideBar = page.getByText('Virtual Account');
    this.billerCodeField = page.locator('input[name="billerCode"]');
    this.billKeyField = page.locator('input[name="billKey"]');
    this.inquireButton = page.getByRole('button', { name: 'Inquire' });
    this.payButton = page.locator('[type="submit"][value="Pay"]');
  }

  async bankButtonOnSideBar(bankVA) {
    try {
      let text;
      if (bankVA === 'Mandiri') {
        text = `${bankVA} Bill`;
      } else {
        text = `${bankVA} VA`;
      }
      return this.page.getByRole('link', { name: text }).click();
    } catch (error) {
      console.error('Error get bank logo VA:', error);
      return null;
    }
  }
  async virtualAccountField(bankVA, VirtualAccountNumber) {
    try {
      if (bankVA === 'BCA') {
        return this.page
          .locator('input[name="va_number"]')
          .fill(VirtualAccountNumber);
      } else {
        return this.page.locator('#inputMerchantId').fill(VirtualAccountNumber);
      }
    } catch (error) {
      console.error('Error get virtual account field:', error);
      return null;
    }
  }
};
