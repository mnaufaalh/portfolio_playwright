const { faker } = require('@faker-js/faker');

exports.SellNowPage = class SellNowPage {
  constructor(page, request) {
    this.page = page;
    this.request = request;
    this.getNumberOfPhoto = page.locator('.photo-section p').first();
    this.getUploadImage = page.locator('input[type="file"]');
    this.getNoteTextArea = page.locator(
      '.input-section:has-text("Note") textarea'
    );
    this.getSize = page.locator(
      `.input-section:has-text("Size (US)") .text-box`
    );
    this.getProductCondition = page.locator(
      `.input-section:has-text("Product Condition") .text-box`
    );
    this.getPackagingCondition = page.locator(
      `.input-section:has-text("Packaging / Box Condition") .text-box`
    );
    this.getInputPrice = page.locator(`input[placeholder="Input Price"]`);
    this.getErrorUploadMinimalPhotos = page.locator('.error-text');
    this.getSubmitButton = page.locator(`.submit-button`);
    this.getCantFindBrand = page.locator('.no-brand');
    this.getProductNameField = page.locator(
      'input[type="text"][placeholder="Input Name or SKU of the Product"]'
    );
  }

  async uploadImage(number) {
    return await this.getUploadImage
      .nth(number)
      .setInputFiles('fixtures/images/images.png');
  }

  async chooseCategory(name) {
    let categoryName;
    if (name === 'sneakers') {
      categoryName = 'Sneakers';
    } else if (name === 'apparels') {
      categoryName = 'Apparel';
    } else if (name === 'handbags') {
      categoryName = 'Luxury';
    } else {
      categoryName = 'Electronics & Collectibles';
    }
    return await this.page
      .locator('.category-container p', {
        hasText: categoryName
      })
      .click();
  }

  async chooseProductName(name) {
    const searchItem = await this.page.locator('.search-product-item p', {
      hasText: name
    });
    const inputProductName = async (name) => {
      await this.getProductNameField.fill(name);
      await this.page.keyboard.press('Enter');
      await this.page.waitForResponse((response) => {
        return response.url().includes('/search') && response.status() === 200;
      });
    };
    await this.getProductNameField.fill(name);
    await this.page.keyboard.press('Enter');
    await this.page.waitForResponse((response) => {
      return response.url().includes('/search') && response.status() === 200;
    });
    console.log(
      await this.getCantFindBrand.isVisible(),
      `await this.getCantFindBrand.isVisible()......`
    );
    if (await this.getCantFindBrand.isVisible()) {
      console.log(`await this.getCantFindBrand.isVisible()`);
      if ((await searchItem.isVisible()) === false) {
        console.log(`(await this.searchItem.isVisible()) === false`);
        await this.page.keyboard.press('Meta+A');
        await this.page.keyboard.press('Backspace');
        await inputProductName(name);
      } else {
        console.log(`.....`);
      }
    } else {
      console.log(`&&&&&&`);
    }
    return await searchItem.click();
  }

  async getSizeOptionButton(option) {
    return await this.page.getByText(option, { exact: true }).click();
  }

  async getProductConditionOptionButton(option) {
    return await this.page
      .locator(`.search-size-item:has-text("${option}")`)
      .click();
  }

  async getPackagingConditionOptionButton(option) {
    return await this.page
      .locator(`.search-size-item:has-text("${option}")`)
      .click();
  }

  async getOptionOthers(category) {
    let othersList = [];

    if (category === 'sneakers') {
      othersList.push(
        'Missing Accessories',
        'Yellowing',
        'Display Item',
        'Defect from Manufacture'
      );
    } else if (category === 'apparels') {
      othersList.push(
        'No Tags',
        'Missing Original Packaging',
        'Defect from Manufacture'
      );
    } else if (category === 'handbags') {
      othersList.push(
        'Missing Accessories',
        'Discoloration',
        'Scratches',
        'Transferred Color',
        'Sign Of Wear'
      );
    } else {
      othersList.push(
        'No Tags',
        'Missing Accessories',
        'Defect from Manufacture',
        'Unassembled',
        'Scratches',
        'Repainted',
        'Reconditioned',
        'No Warranty',
        'Display Item',
        'Discoloration'
      );
    }

    for (const element of faker.helpers.arrayElements(othersList)) {
      await this.page.locator(`.choose-item:has-text("${element}")`).click();
    }
  }

  async getInclusionButton() {
    const options = [
      'Box',
      'Dust Bag',
      'Tag',
      'Mirror',
      'Strap',
      'Authentication Card'
    ];

    for (const element of faker.helpers.arrayElements(options)) {
      await this.page.locator(`.choose-item:has-text("${element}")`).click();
    }
  }

  async getErrorUploadMinimalPhotos() {
    const textField = await this.page.locator('.error-text').textContent();
    return parseInt(textField.match(/\d+/)[0], 10);
  }
};
