const { test } = require('@playwright/test');
const { LoginService } = require('@services/console/LoginService.js');
const { User } = require('@services/console/sales/users/user-list/User');
const {
  SettingList
} = require('@services/console/setting/setting-list/SettingList');
const {
  ProductVariant
} = require('@services/console/sales/product-variant/product-variant-list/ProductVariant');
const { Stock } = require('@services/console/setting/stock/Stock');
const {
  adminDapur,
  qualityChecker,
  legitChecker,
  automationUserSeller
} = require('@fixtures/json/user.json');
const { faker } = require('@faker-js/faker');

test.describe('seller listing', () => {
  for (let index = 0; index < 2; index++) {
    let homepage;
    let loginpage;
    let loginService;
    let user;
    let accessTokenAdmin;
    let accessTokenQC;
    let accessTokenLC;
    let accessTokenSeller;
    let selectedProduct;
    let sizeId;
    let sizeUS;
    let productVariantService;
    let stockService;
    let priceMultipliers;
    let userDetailSeller;

    const stagingURL = process.env.STAGING_URL;
    // const category = 'lifestyles';
    const category = faker.helpers.arrayElement([
      'sneakers',
      'handbags',
      'apparels',
      'lifestyles'
    ]);

    test.beforeAll(async ({ playwright, browser }) => {
      const requestContext = await playwright.request.newContext();
      const context = await browser.newContext();
      const pageContext = await context.newPage();

      const loginService = new LoginService();
      const settingListService = new SettingList();
      productVariantService = new ProductVariant();
      stockService = new Stock();
      const user = new User(pageContext);

      async function getAccessToken(user) {
        const response = await loginService.userLogin(
          requestContext,
          user.emailAddress,
          user.password
        );
        return response;
      }
      accessTokenAdmin = await getAccessToken(adminDapur);
      accessTokenQC = await getAccessToken(qualityChecker);
      accessTokenLC = await getAccessToken(legitChecker);
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

      console.log(selectedProduct, `selectedProduct.......`);

      await productVariantService.setProductVariantToBeActive(
        requestContext,
        accessTokenAdmin,
        selectedProduct
      );
      priceMultipliers = await settingListService.settingMultipliers(
        requestContext,
        accessTokenAdmin
      );

      const responseFindUser = await user.findUser(
        requestContext,
        accessTokenAdmin,
        automationUserSeller.emailAddress
      );
      userDetailSeller = responseFindUser.find(
        (e) => e.typed_email === automationUserSeller.emailAddress
      );
    });

    test(`100 seller listing ${index}`, async ({ request }) => {
      const productVariantService = new ProductVariant();
      const responseAddSize = await productVariantService.addSizeOnProduct(
        request,
        accessTokenAdmin,
        category,
        selectedProduct
      );
      for (let i = 0; i < 1; i++) {
        const selectedSize =
          responseAddSize[
            faker.number.int({
              min: 0,
              max: responseAddSize.length - 1
            })
          ];
        sizeId = selectedSize.id;
        // let shippingMethod = 'Express';
        let shippingMethod = faker.helpers.arrayElement([
          'Express',
          'Standard',
          'Pre Order',
          'Standard',
          'Pre Order'
        ]);

        // let askingPrice =
        //   faker.number.int({
        //     min: 1,
        //     max: 100000
        //   }) * priceMultipliers;
        let askingPrice = 1000000;
        console.log(i, shippingMethod, sizeId, `!!!!!!!!!`);
        await stockService.addStock(request, {
          accessTokenAdmin,
          shippingMethod: shippingMethod,
          selectedProduct,
          userDetailSeller,
          sizeId,
          price: askingPrice,
          accessTokenQC,
          accessTokenLC,
          category: category,
          isBrandNew: false,
          isDefect: true
        });
      }
    });
  }
});
