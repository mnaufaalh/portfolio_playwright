const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const {
  adminDapur,
  automationUserSeller
} = require('@fixtures/json/user.json');
const { LoginService } = require('@services/console/LoginService');
const {
  ProductVariant
} = require('@services/console/sales/product-variant/product-variant-list/ProductVariant');
const { User } = require('@services/console/sales/users/user-list/User');
const {
  SettingList
} = require('@services/console/setting/setting-list/SettingList');
const { Stock } = require('@services/console/setting/stock/Stock');
const { LocalStorage } = require('@utils/LocalStorage');
const { HomePage } = require('@pages/home-page/HomePage');
const { Profile } = require('@pages/profile/profile');
const {
  SellingDashBoard
} = require('@pages/profile/selling-dashboard/SellingDashboard');
const { SellNowPage } = require('@pages/sell-now-page/SellNowPage');
const {
  SellAndConsignmentRequest
} = require('@services/console/operations/sell-and-consignment-request/SellAndConsignmentRequest');

test.describe('Sell', () => {
  const category = faker.helpers.arrayElement([
    'sneakers'
    // 'handbags',
    // 'apparels',
    // 'lifestyles'
  ]);
  const priceMultipliers = 1000;

  let accessTokenAdmin;
  let accessTokenSeller;
  let selectedProduct;
  let askingPrice;
  let sizeId;
  let sizeUS;

  test.beforeAll(async ({ playwright }) => {
    const productVariantService = new ProductVariant();
    const loginService = new LoginService();
    const requestContext = await playwright.request.newContext();

    async function getAccessToken(user) {
      const response = await loginService.userLogin(
        requestContext,
        user.emailAddress,
        user.password
      );
      return response;
    }

    accessTokenAdmin = await getAccessToken(adminDapur);
    accessTokenSeller = await getAccessToken(automationUserSeller);

    const listOfProductVariant =
      await productVariantService.listOfProductVariant(
        requestContext,
        accessTokenAdmin,
        category
      );
    selectedProduct =
      listOfProductVariant[
        faker.number.int({
          min: 0,
          max: listOfProductVariant.length - 1
        })
      ];

    console.log(selectedProduct, `selectedProduct......`);
  });

  test.beforeEach(async ({ page, request }) => {
    const stagingURL = process.env.STAGING_URL;
    const homepage = new HomePage(page, request);
    const localStorage = new LocalStorage(page);
    const productVariantService = new ProductVariant();

    const responseAddSize = await productVariantService.addSizeOnProduct(
      request,
      accessTokenAdmin,
      category,
      selectedProduct
    );

    console.log(responseAddSize, `responseAddSize.......`);

    const selectedSize =
      responseAddSize[
        faker.number.int({
          min: 0,
          max: responseAddSize.length - 1
        })
      ];
    sizeId = selectedSize.id;
    sizeUS = selectedSize.US;

    await productVariantService.setProductVariantToBeActive(
      request,
      accessTokenAdmin,
      selectedProduct
    );
    await page.goto(stagingURL);
    await localStorage.setLogin(accessTokenSeller);
    await homepage.isBanner(request, accessTokenAdmin);
  });

  test('Should able user to sell single product', async ({ page, request }) => {
    const profile = new Profile(page);
    const sellingDashboardPage = new SellingDashBoard(page);
    const homepage = new HomePage(page, request);
    const sellNowPage = new SellNowPage(page);
    const sellAndConsignmentRequestService = new SellAndConsignmentRequest(
      request
    );
    const packagingCondition = faker.helpers.arrayElement([
      'PERFECT',
      'DEFECT',
      'MISSING BOX'
    ]);
    const responsePrice = async (isInitialSizeSameWithSizeUS) => {
      let priceItem;
      const [responsePrice] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().includes('/products/prices') &&
            response.status() === 201
        ),
        isInitialSizeSameWithSizeUS ? '' : sellNowPage.getSubmitButton.click()
      ]);
      const responseBodyPrice = await responsePrice.json();
      if (Object.hasOwn(responseBodyPrice.data, 'min_price')) {
        priceItem =
          faker.number.int({
            min: parseInt(responseBodyPrice.data.min_price) / priceMultipliers,
            max: 1000
          }) * priceMultipliers;
      } else {
        priceItem = faker.number.int({ min: 50, max: 1000 }) * priceMultipliers;
      }
      return priceItem;
    };
    let itemInArrayProductCondition = ['BRAND NEW', 'PRE OWNED'];
    let priceItem;
    if (category === 'handbags') {
      itemInArrayProductCondition.pop();
      itemInArrayProductCondition.push(
        'PRISTINE',
        'GOOD',
        'WELL USED',
        'LIKE NEW',
        'VINTAGE'
      );
    }
    const productCondition = faker.helpers.arrayElement(
      itemInArrayProductCondition
    );
    const isOthers = faker.helpers.arrayElement([true, false]);
    await homepage.getProfileUserButton.click();
    await profile.getSellingDashboardButton.click();
    await sellingDashboardPage.sellAProductButton.click();
    await sellNowPage.chooseCategory(category);
    const initialMinimumUploadPhotos = parseInt(
      (await sellNowPage.getNumberOfPhoto.textContent()).match(/\d+/)[0],
      10
    );
    for (let i = 0; i < initialMinimumUploadPhotos; i++) {
      await sellNowPage.uploadImage(i);
    }
    const initialSize = await sellNowPage.getSize.textContent();
    await sellNowPage.chooseProductName(selectedProduct.display_name);
    priceItem = await responsePrice(initialSize !== sizeUS);
    if (initialSize !== sizeUS) {
      await sellNowPage.getSize.click();
      await sellNowPage.getSizeOptionButton(sizeUS);
      priceItem = await responsePrice(initialSize !== sizeUS);
    }
    await sellNowPage.getProductCondition.click();
    await sellNowPage.getProductConditionOptionButton(productCondition);
    await sellNowPage.getPackagingCondition.click();
    await sellNowPage.getPackagingConditionOptionButton(packagingCondition);
    if (isOthers) {
      await sellNowPage.getOptionOthers(category);
    }
    if (category === 'handbags') {
      const isInclusion = faker.helpers.arrayElement([true, false]);
      if (isInclusion) {
        await sellNowPage.getInclusionButton();
      }
    }
    const UploadPhotosRequired = parseInt(
      (await sellNowPage.getNumberOfPhoto.textContent()).match(/\d+/)[0],
      10
    );
    console.log(UploadPhotosRequired, `initialMinimumUploadPhotos`);
    if (await sellNowPage.getErrorUploadMinimalPhotos.isVisible()) {
      for (
        let i = 0;
        i < UploadPhotosRequired - initialMinimumUploadPhotos;
        i++
      ) {
        await sellNowPage.uploadImage(initialMinimumUploadPhotos + i);
      }
    }
    await sellNowPage.getNoteTextArea.fill(faker.lorem.lines());
    await page.keyboard.press('Meta+A');
    await page.keyboard.press('Backspace');
    await sellNowPage.getInputPrice.fill(`${priceItem}`);
    const [responseCreateUserSell] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes('/users/sells') && response.status() === 200
      ),
      sellNowPage.getSubmitButton.click()
    ]);
    const responseBodyCreateUserSell = await responseCreateUserSell.json();
    const userSell = responseBodyCreateUserSell.data;
    // await sellingDashboardPage.getSortByButton.click();
    // await sellingDashboardPage.getOptionSortByButton.click();
    // await page.waitForResponse((response) => {
    //   return (
    //     response.url().includes('sort_by=createdAt_desc') &&
    //     response.status() === 200
    //   );
    // });
    // // expect(await sellingDashboardPage.getTitle.textContent()).toBe(
    // //   selectedProduct.display_name
    // // );
    // // expect(await sellingDashboardPage.getStatusItem.textContent()).toBe(
    // //   'AWAITING REVIEW'
    // // );
    // // expect(await sellingDashboardPage.getPriceItem.textContent()).toBe(
    // //   `IDR ${priceItem.toLocaleString('en-US')}`
    // // );
    // // await sellAndConsignmentRequestService.changeStatusSellAndConsignmentRequest(
    // //   request,
    // //   accessTokenAdmin,
    // //   userSell,
    // //   'approved'
    // // );
    // // await page.reload();
    // // await sellingDashboardPage.getSortByButton.click();
    // // await sellingDashboardPage.getOptionSortByButton.click();
    // // await page.waitForResponse((response) => {
    // //   return (
    // //     response.url().includes('sort_by=createdAt_desc') &&
    // //     response.status() === 200
    // //   );
    // // });
    // // expect(await sellingDashboardPage.getStatusItem.isVisible()).toBe(false);
    // await page.waitForTimeout(10000);
    // // // await sellNowPage.getUploadImage().click();
  });
});
