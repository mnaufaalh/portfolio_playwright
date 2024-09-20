const { Banner } = require('@services/console/creative/banner/Banner');

exports.HomePage = class HomePage {
  constructor(page, request) {
    this.page = page;
    this.request = request;
    this.banner = new Banner(page);
    this.closeBanner = page.locator('.dont-show-again');
    this.loginButton = page.locator('.ant-col > p:has-text("Login")');
    this.userNameInHomepage = page.locator(
      '.ButtonProfile_profile-email__3kweB'
    );
    this.searchButton = page.locator('.ant-input-prefix');
    this.searchBar = page.locator(
      'input.ant-input.ant-input-borderless.SearchInput_search-input__2f-Vd'
    );
    this.brandNewButton = page.locator('p', { hasText: 'Brand New' });
    this.usedButton = page.locator('p', { hasText: 'Used' });
    this.preOrderButton = page.locator('p', { hasText: 'Pre-Order' });
    this.makeOfferButton = page.locator('.make-offer-btn-wrapper');
    this.inputOffer = page.locator('[name="offerAmount"]');
    this.continueButton = page
      .locator('p', { hasText: 'Continue' })
      .locator('..');
    this.proceedToPaymentButton = page.getByText('Proceed to Payment', {
      exact: true
    });
    this.viewVoucherButton = page
      .locator('p', { hasText: 'View' })
      .locator('..')
      .filter({ has: page.locator('button') });
    this.voucherInputField = page.locator(
      'input[placeholder="Enter voucher code here"]'
    );
    this.checkVoucherAvailabilityButton = page
      .locator('p', { hasText: 'Check' })
      .locator('..')
      .filter({ has: page.locator('.arrow-wrapper') });
    this.useVoucherButton = page.locator('.footer-button', {
      hasText: 'Use voucher'
    });
    this.choosePayment = page.locator('p', {
      hasText: 'Choose Payment'
    });
    this.kickCreditPaymentButton = page.locator(
      'img[src="https://d5ibtax54de3q.cloudfront.net/eyJidWNrZXQiOiJraWNrYXZlbnVlLWFzc2V0cyIsImtleSI6ImVtYWlsL2tpY2tfY2hlY2sucG5nIiwiZWRpdHMiOnsicmVzaXplIjp7fSwid2VicCI6eyJxdWFsaXR5Ijo1MH19fQ=="]'
    );
    this.useCreditButton = page
      .locator('p:has-text("Use Credit")')
      .locator('..')
      .locator('..')
      .locator('.payment-toggle-switch');
    this.useKickPointButton = page
      .locator('p:has-text("Use Kick Point")')
      .locator('..')
      .locator('..')
      .locator('.payment-toggle-switch');
    this.textTotalPrice = page.locator('p:has-text("Total")').locator('~ p');
    this.viewVoucherButton = page.getByRole('button', { name: 'View' });
    this.findVoucherField = page.locator(
      'input[placeholder="Enter voucher code here"]'
    );
    this.checkVoucherAvailabilityButton = page
      .locator('div')
      .filter({ hasText: /^Check$/ })
      .nth(1);
    this.useVoucherButton = page.locator(
      '.footer-button:has-text("Use voucher")'
    );
    this.viewOfferHistoryButton = page.locator('p', {
      hasText: 'View Offer History'
    });
    this.goToBuyingDashboardButton = page.getByText('Go to Buying Dashboard');
    this.getProfileUserButton = page.locator(
      '.ButtonProfile_profile-image__r48gN'
    );
    this.getSeeInstructionButton = page.getByRole('button', {
      name: 'SEE INSTRUCTIONS'
    });
    this.backToHomePageButton = page.locator('.btn-black flat');
  }

  async isBanner(accessTokenAdmin) {
    try {
      const isBannerPresent = await this.banner.isBanner(
        this.request,
        accessTokenAdmin
      );
      if (isBannerPresent.length) {
        await this.closeBanner.click();
      }
      return isBannerPresent;
    } catch (error) {
      console.error('Error checking banner:', error);
      return false;
    }
  }

  async chooseItem(name) {
    const locator = this.page.locator('h2.price-tag', {
      hasText: name.trim()
    });

    const checkProductIsVisible = async () => {
      await this.page.reload();
      await this.page.waitForResponse((response) => {
        return (
          response.url().includes(`/brands?category=`) &&
          response.status() === 200
        );
      });
      if (await locator.isVisible()) {
        await locator.click();
        return true;
      } else {
        return checkProductIsVisible();
      }
    };

    try {
      if (await locator.isVisible()) {
        await locator.click();
      } else {
        return await checkProductIsVisible();
      }
    } catch (error) {
      console.error('Error choosing item:', error);
      return false;
    }
  }

  async productCondition(condition) {
    try {
      switch (condition) {
        case 'Brand New':
          await this.brandNewButton.click();
          break;
        case 'Used':
          await this.usedButton.click();
          break;
        default:
          await this.preOrderButton.click();
          break;
      }
    } catch (error) {
      console.error('Error checking banner:', error);
      return false;
    }
  }

  async selectSize(size) {
    try {
      await this.page
        .locator('.size-div-tabel')
        .locator('span', { hasText: size })
        .click();
    } catch (error) {
      console.error('Error checking banner:', error);
      return false;
    }
  }

  async chooseProductAddOnButton(productAddon) {
    try {
      await this.page
        .locator(`p:has-text("${productAddon}")`)
        .locator('..')
        .locator('..')
        .locator('.extra-item-add-button-icon')
        .click();
    } catch (error) {
      console.error('Error choose product addon:', error);
      return false;
    }
  }

  async virtualAccountPaymentButton(bankVA) {
    try {
      await this.page
        .getByText(bankVA.toUpperCase(), {
          exact: true
        })
        .click();
    } catch (error) {
      console.error('Error choose Virtual Account Card:', error);
      return false;
    }
  }

  async creditCardPaymentButton(bankCC) {
    try {
      await this.page.getByText(`${bankCC.toUpperCase()} Credit Card`).click();
    } catch (error) {
      console.error('Error choose Credit Card:', error);
      return false;
    }
  }
};
