const { test, expect } = require('@playwright/test');
const { HomePage } = require('@pages/home-page/HomePage');
const {
  adminDapur,
  qualityChecker,
  legitChecker,
  automationUserBuyerMidtrans,
  automationUserSeller,
  automationUserBuyerKickCredit,
  automationUserBuyerKickPoint,
  automationUserBuyerSellerCredit
} = require('@fixtures/json/user.json');
const { LoginService } = require('@services/console/LoginService.js');
const { User } = require('@services/console/sales/users/user-list/User');
const {
  ProductVariant
} = require('@services/console/sales/product-variant/product-variant-list/ProductVariant');
const { faker } = require('@faker-js/faker');
const {
  SettingList
} = require('@services/console/setting/setting-list/SettingList');
const { Stock } = require('@services/console/setting/stock/Stock');
const {
  ProductAddonsList
} = require('@services/console/sales/product-addons/product-addons-list/ProductAddonsList');
const {
  VoucherList
} = require('@services/console/sales/vouchers/voucher_list/VoucherList');
const {
  CategoriesList
} = require('@services/console/sales/categories/categories_list/CategoriesList');
const {
  CreateDisbursements
} = require('@services/console/finance/disbursements/create_disbursements/CreateDisbursements');
const { MidtransSnap } = require('@pages/midtrans/midtrans-snap/MidtransSnap');
const { MidtransWeb } = require('@pages/midtrans/midtrans-web/MidtransWeb');
const { Profile } = require('@pages/profile/profile');
const {
  BuyingDashboard
} = require('@pages/profile/buying-dashboard/BuyingDashboard');
const {
  SellingDashboard
} = require('@services/marketplace/profile/selling-dashboard/SellingDashboard');
const {
  AllSales
} = require('@services/console/operations/sales/all-sales/AllSales');
const {
  OutstandingSales
} = require('@services/console/operations/sales/outstanding-sales/OutstandingSales');
const {
  QualityControl
} = require('@services/console/operations/sales/quality-control/QualityControl');
const {
  LegitCheck
} = require('@services/console/operations/sales/legit-check/LegitCheck');
const {
  PreDelivering
} = require('@services/console/operations/sales/pre-delivering/PreDelivering');
const {
  Delivering
} = require('@services/console/operations/sales/delivering/Delivering');
const { LocalStorage } = require('@utils/LocalStorage');
const { DateTime } = require('@utils/DateTime');

test.describe('Purchase', () => {
  let accessTokenAdmin;
  let accessTokenQC;
  let accessTokenLC;
  let accessTokenSeller;
  let accessTokenBuyer;
  let accessTokenBuyerMidtrans;
  let accessTokenBuyerKickCredit;
  let accessTokenBuyerKickPoint;
  let accessTokenBuyerSellerCredit;
  let emailBuyer;
  let selectedProduct;
  let priceMultipliers;
  let processingFee;
  let shippingFee;
  let askingPrice;
  let totalPrice;
  let userDetailSeller;
  let userDetailBuyer;
  let kickKredit;
  let sellerCredit;
  let kickPoint;
  let sizeId;
  let sizeUS;
  let invoiceNumber;
  let bidId;
  let userSellId;
  let saleDetail;
  let VirtualAccountNumber;
  let isExpress;
  let voucherCode;
  let voucherAmount;
  let cashback;
  let isCashback;
  let deductType;
  let typeOfCalculationVoucher;
  let maxAmountDiscountVoucher;
  let displayNameProductAddOn;
  let priceProductAddOn;
  let basePrice;
  let params;

  let offerPrice;

  let homepage;
  let user;
  let productVariantService;
  let settingListService;
  let stockService;
  let productAddOnListService;
  let voucherListService;
  let categoriesListService;
  let createDisbursementService;
  let sellingDashboardService;
  let allSalesService;
  let outstandingSalesService;
  let qualityControlSalesService;
  let legitCheckSalesService;
  let preDeliveringService;
  let deliveringService;
  let midtransSnap;
  let midtransWeb;
  let profile;
  let buyingDashboard;
  let localStorage;
  let dateTime;

  const stagingURL = process.env.STAGING_URL;
  const midtransSimulatorUrl = process.env.MIDTRANS_SIMULATOR_URL;
  const CVV = process.env.CVV;
  const passwordTransactionMidtrans = process.env.PASSWORD_TRANSACTION_MIDTRANS;
  const category = faker.helpers.arrayElement([
    'sneakers',
    'handbags',
    'apparels',
    'lifestyles'
  ]);
  const bankCC = faker.helpers.arrayElement(['BCA', 'Mandiri', 'BNI']);
  const bankVA = faker.helpers.arrayElement([
    'BCA',
    'Mandiri',
    'BNI',
    'Permata',
    'BRI'
  ]);

  const openWebsiteUntilProductDetail = async (page, request, params) => {
    const {
      productCondition = 'Brand New',
      sizeUS,
      isAddOnProduct = false,
      voucher = {
        isVoucher: false,
        typeOfVoucher: ''
      },
      paymentMethod = {
        payment: 'Seller Credit',
        isOffer: false
      }
    } = params;

    if (paymentMethod.isOffer)
      offerPrice =
        faker.number.int({
          min: Math.round(50000 / priceMultipliers),
          max: Math.round(askingPrice / priceMultipliers)
        }) * priceMultipliers;

    basePrice = paymentMethod.isOffer ? offerPrice : askingPrice;
    const processingFeeAmount = (basePrice * processingFee) / 100;

    const useVoucher = async (request, typeOfVoucher, askingPrice) => {
      let body;
      let isActive;
      let isLimit;
      let isInRangeOfDate;
      let isAllPatform;
      let isVariant;
      let isAnyCategory;
      let isEarly;
      let idVoucher;
      let totalUsage;
      let categoriesId = [];
      let isMinPurchase;
      let isGroupName;

      const responseVoucherlist = await voucherListService.listOfVoucher(
        request,
        accessTokenAdmin,
        typeOfVoucher
      );
      const data =
        responseVoucherlist[faker.number.int(responseVoucherlist.length - 1)];
      idVoucher = data.id;
      totalUsage = await voucherListService.totalVoucherUsage(
        request,
        accessTokenAdmin,
        idVoucher
      );
      const responseCategoriesList =
        await categoriesListService.listOfCategories(request, accessTokenAdmin);
      responseCategoriesList.forEach((e) => {
        categoriesId.push(e.id);
      });
      const responseVoucherDetail = await voucherListService.voucherDetail(
        request,
        accessTokenAdmin,
        idVoucher
      );
      const voucherDetail = responseVoucherDetail;
      isCashback = voucherDetail.is_cashback;
      deductType = voucherDetail.deduct_type;
      voucherCode = voucherDetail.code;
      typeOfCalculationVoucher = voucherDetail.type;
      maxAmountDiscountVoucher = voucherDetail.max_amount;
      body = voucherDetail;
      const dailyStartTime = voucherDetail.daily_start_time;
      const newDateToday = new Date();

      let newDateStartedAt = new Date(voucherDetail.started_at);
      let newDateEndedAt = new Date(voucherDetail.ended_at);

      if (typeOfCalculationVoucher === 'percentage') {
        if (deductType === 'product_price') {
          voucherAmount = (parseInt(voucherDetail.amount) * askingPrice) / 100;
        } else {
          voucherAmount = voucherDetail.amount / 100;
        }
      } else {
        voucherAmount = parseInt(voucherDetail.amount);
      }

      if (maxAmountDiscountVoucher !== null) {
        if (parseInt(maxAmountDiscountVoucher) < voucherAmount) {
          voucherAmount = parseInt(maxAmountDiscountVoucher);
        }
      }
      body.listing_pre_order = false;
      body.listing_pre_verified = false;

      const functionCheckDailyTime = async () => {
        let earlyOrNot;
        const parseTime = async (timeString) => {
          const [hours, minutes, seconds] = timeString.split(':').map(Number);
          const date = new Date(dateTime.getCurrentDate());
          date.setUTCHours(hours, minutes, seconds, 0);
          return date.toISOString();
        };
        const dateToTimeString = async (date) => {
          const hours = String(date.getUTCHours()).padStart(2, '0');
          const minutes = String(date.getUTCMinutes()).padStart(2, '0');
          return `${hours}:${minutes}:00`;
        };
        const firstDate = await parseTime(dailyStartTime);
        const secondTime = await parseTime(
          await dateTime.getCurrentTimeStamp()
        );
        let newDate;
        let tempDate;
        if (firstDate > secondTime) {
          earlyOrNot = true;
          newDate = new Date(secondTime);
          newDate.setHours(newDate.getHours() - 1);
          newDate.setSeconds(0);
          tempDate = await dateToTimeString(newDate);
          body.daily_start_time = `${tempDate}`;
        } else {
          earlyOrNot = false;
        }
        return earlyOrNot;
      };

      typeOfVoucher === 'private'
        ? await voucherListService.addUserInVoucher(
            request,
            accessTokenAdmin,
            idVoucher,
            userDetailBuyer
          )
        : '';

      isEarly = await functionCheckDailyTime();

      if (body.brand_vouchers.length !== 0) {
        await voucherListService.removeBrandsInVoucher(
          request,
          accessTokenAdmin,
          idVoucher
        );
      }

      if (voucherDetail.groupName !== null) {
        isGroupName = true;
        body.group_name = null;
      } else {
        isGroupName = false;
      }

      if (parseInt(body.minimum_purchase) > askingPrice) {
        isMinPurchase = true;
        body.minimum_purchase = askingPrice;
      } else {
        isMinPurchase = false;
      }

      if (body.voucher_payment_methods.length !== 0)
        await voucherListService.editPaymentMethodInVoucher(
          request,
          accessTokenAdmin,
          idVoucher
        );

      if (body.platform_specifications !== null) {
        isAllPatform = true;
        body.platform_specifications = null;
      } else {
        isAllPatform = false;
      }

      if (body.categories.length !== categoriesId.length) {
        isAnyCategory = true;
        await voucherListService.editCategoriesInVoucher(
          request,
          accessTokenAdmin,
          idVoucher,
          categoriesId
        );
      } else {
        isAnyCategory = false;
      }

      if (body.variant_vouchers.length !== 0) {
        isVariant = true;
        await voucherListService.editVariantVoucher(
          request,
          accessTokenAdmin,
          idVoucher
        );
      } else {
        isVariant = false;
      }

      if (voucherDetail.active === false) {
        body.active = true;
        isActive = true;
      } else {
        isActive = false;
      }

      if (
        totalUsage === voucherDetail.limit ||
        totalUsage < voucherDetail.limit
      ) {
        isLimit = true;
        body.limit = totalUsage + 1;
      } else {
        isLimit = false;
      }

      const totalUserUseVoucer = await voucherListService.userListUseVoucher(
        request,
        accessTokenAdmin,
        idVoucher
      );

      if (totalUserUseVoucer > voucherDetail.limit) {
        isLimit = true;
        body.limit = totalUserUseVoucer + 1;
      } else {
        isLimit = false;
      }

      if (newDateToday < newDateStartedAt) {
        isInRangeOfDate = true;
        newDateStartedAt = await dateTime.formatDate(
          newDateToday.setDate(newDateToday.getDate() - 1)
        );
        body.started_at = newDateStartedAt;
      } else {
        isInRangeOfDate = false;
      }

      if (newDateToday > newDateEndedAt) {
        isInRangeOfDate = true;
        newDateEndedAt = await dateTime.formatDate(
          newDateToday.setDate(newDateToday.getDate() + 1)
        );
        body.ended_at = newDateEndedAt;
      } else {
        isInRangeOfDate = false;
      }

      const responseUserUsageVoucher =
        await voucherListService.userUsageVoucher(
          request,
          accessTokenAdmin,
          idVoucher,
          userDetailBuyer
        );
      let isLimitUser;
      let isSetLimitPerUser;

      if (body.limit !== null) {
        if (parseInt(body.limit) === responseUserUsageVoucher) {
          isLimitUser = true;
          body.limit++;
        }
      } else {
        isLimitUser = false;
      }

      if (parseInt(body.limit_per_user) === totalUsage) {
        isSetLimitPerUser = true;
        body.limit_per_user++;
      } else {
        isSetLimitPerUser = false;
      }

      if (
        isLimit === true ||
        isInRangeOfDate === true ||
        isActive === true ||
        isAllPatform === true ||
        isVariant === true ||
        isEarly === true ||
        isAnyCategory === true ||
        isLimitUser === true ||
        isSetLimitPerUser === true ||
        isMinPurchase === true ||
        isGroupName === true
      ) {
        body.minimum_purchase = parseInt(body.minimum_purchase);
        if (body.max_amount !== null) {
          body.max_amount = parseInt(body.max_amount);
        }
        await voucherListService.editBeUsableVoucher(
          request,
          accessTokenAdmin,
          idVoucher,
          body
        );
      }
      return voucherCode;
    };

    const paymentViaVA = async (page, isOffer) => {
      let billerCode;
      await midtransSnap.bankLogoOnVirtualAccountButton(bankVA);
      const response = await page.waitForResponse(
        (response) =>
          response.url().includes('/snap/v2/transactions/') &&
          response.status() === 200
      );
      const bodyResponse = await response.json();
      switch (bankVA) {
        case 'Mandiri':
          billerCode = bodyResponse.biller_code;
          VirtualAccountNumber = bodyResponse.bill_key;
          break;
        case 'BCA':
          VirtualAccountNumber = bodyResponse.bca_va_number;
          break;
        case 'Permata':
          VirtualAccountNumber = bodyResponse.permata_va_number;
          break;
        case 'BNI':
          VirtualAccountNumber = bodyResponse.bni_va_number;
          break;
        default:
          VirtualAccountNumber = bodyResponse.bri_va_number;
          break;
      }
      await page.goto(midtransSimulatorUrl);
      await midtransWeb.virtualAccountButtonOnSideBar.click();
      await midtransWeb.bankButtonOnSideBar(bankVA);
      if (bankVA === 'Mandiri') {
        await midtransWeb.billerCodeField.fill(billerCode);
        await midtransWeb.billKeyField.fill(VirtualAccountNumber);
        await midtransWeb.inquireButton.click();
        await midtransWeb.payButton.click();
      } else {
        await midtransWeb.virtualAccountField(bankVA, VirtualAccountNumber);
        await midtransWeb.inquireButton.click();
        await midtransWeb.payButton.click();
      }
      if (!isOffer) {
        await page.goto(`${stagingURL}/invoices/${invoiceNumber}`);
        await homepage.goToBuyingDashboardButton.click();
      } else {
        await page.goto(`${stagingURL}/user_dashboard/order`);
        await profile.getBuyingDashboardButton.click();
      }
    };

    const paymentViaCC = async (page, isOffer) => {
      await midtransSnap.cvvField.fill(CVV);
      await midtransSnap.payNowButton.click();
      await midtransSnap.passwordField.fill(passwordTransactionMidtrans);
      await midtransSnap.submitButton.click();
      await midtransSnap.OKButton.click();
      const instructionButton = await homepage.getSeeInstructionButton;
      if (!isOffer) {
        if (await instructionButton.isVisible()) {
          await page.goto(`${stagingURL}/user_dashboard/order`);
          await profile.getBuyingDashboardButton.click();
        } else {
          await homepage.goToBuyingDashboardButton.click();
        }
      } else {
        await page.goto(`${stagingURL}/user_dashboard`);
        await profile.getBuyingDashboardButton.click();
      }
    };

    let isKickPoint;
    let pathname;

    const responseFindUser = await user.findUser(
      request,
      accessTokenAdmin,
      emailBuyer
    );
    userDetailBuyer = responseFindUser.find(
      (e) => e.typed_email === emailBuyer
    );
    kickKredit = parseInt(userDetailBuyer.balance);
    sellerCredit = parseInt(userDetailBuyer.balance_with_fee);
    kickPoint = parseInt(userDetailBuyer.locked_balance);
    voucher.isVoucher === true
      ? useVoucher(request, voucher.typeOfVoucher, askingPrice, userDetailBuyer)
      : '';

    isKickPoint = false;

    if (paymentMethod.payment !== 'Kick Credit') {
      isKickPoint = false;
    } else if (paymentMethod.hasOwnProperty('isKickPoint')) {
      isKickPoint = paymentMethod.isKickPoint;
    }

    const randomAmountDisbursement = faker.number.int({
      min: Math.ceil(basePrice + (basePrice * processingFee) / 100),
      max: 100000000
    });

    const createDisbursementInKickPoint = async () => {
      await createDisbursementService.createDisbursement(request, {
        accessTokenAdmin,
        userDetailBuyer,
        balance_source: 'LOCKED_BALANCE',
        payoutType: 'MANUAL',
        disbursementType: 'BALANCE_IN',
        amount: randomAmountDisbursement
      });
    };

    const createDisburmentInKickCredit = async () => {
      await createDisbursementService.createDisbursement(request, {
        accessTokenAdmin,
        userDetailBuyer,
        balance_source: 'BALANCE',
        payoutType: 'MANUAL',
        disbursementType: 'BALANCE_IN',
        amount: randomAmountDisbursement
      });
    };

    if (paymentMethod.payment === 'Kick Credit') {
      if (!paymentMethod.isOffer) {
        if (isKickPoint) {
          if (askingPrice > kickPoint) {
            await createDisbursementInKickPoint();
            kickPoint = kickPoint + randomAmountDisbursement;
          }
        } else if (askingPrice > kickKredit) {
          await createDisburmentInKickCredit();
          kickKredit = kickKredit + randomAmountDisbursement;
        }
      } else {
        if (isKickPoint) {
          if (offerPrice > kickPoint) {
            await createDisbursementInKickPoint();
            kickPoint = kickPoint + randomAmountDisbursement;
          }
        } else if (offerPrice > kickKredit) {
          await createDisburmentInKickCredit();
          kickKredit = kickKredit + randomAmountDisbursement;
        }
      }
    } else if (paymentMethod.payment === 'Seller Credit') {
      if (!paymentMethod.isOffer) {
        if (askingPrice > sellerCredit || offerPrice > sellerCredit) {
          await createDisbursementService.createDisbursement(request, {
            accessTokenAdmin,
            userDetailBuyer,
            balance_source: 'BALANCE_WITH_FEE',
            payoutType: 'MANUAL',
            disbursementType: 'BALANCE_IN',
            amount: randomAmountDisbursement
          });
          sellerCredit = sellerCredit + randomAmountDisbursement;
        }
      }
    } else {
      if (kickKredit < 25000) {
        const randomAmountForBid = faker.number.int({ min: 25000 });
        await createDisbursementService.createDisbursement(request, {
          accessTokenAdmin,
          userDetailBuyer,
          balance_source: 'BALANCE',
          payoutType: 'MANUAL',
          disbursementType: 'BALANCE_IN',
          amount: randomAmountForBid
        });
        kickKredit = kickKredit + randomAmountForBid;
      }
    }

    await page.goto(stagingURL);
    await localStorage.setLogin(accessTokenBuyer);
    await homepage.isBanner(request, accessTokenAdmin);
    await homepage.searchButton.click();
    await homepage.searchBar.fill(selectedProduct.display_name);
    await page.keyboard.press('Enter');
    await page.waitForResponse((response) => {
      return response.url().includes('/search') && response.status() === 200;
    });
    await homepage.chooseItem(selectedProduct.display_name);
    await homepage.productCondition(productCondition);

    if (isAddOnProduct) {
      const responseProductAddons =
        await productAddOnListService.selectedProductAddon(
          request,
          accessTokenAdmin
        );
      displayNameProductAddOn = responseProductAddons.display_name;
      priceProductAddOn = parseInt(responseProductAddons.price);
    }
    await homepage.selectSize(sizeUS);

    if (paymentMethod.isOffer) {
      await homepage.makeOfferButton.click();
      await homepage.inputOffer.fill(`${offerPrice}`);
      await homepage.continueButton.click();
      shippingFee = await localStorage.getShippingFee();
    } else if (voucher.isVoucher) {
      await homepage.continueButton.click();
      await page.waitForResponse((response) => {
        return (
          response.url().includes('/user_vouchers') && response.status() === 200
        );
      });
      shippingFee = await localStorage.getShippingFee();
      await homepage.viewVoucherButton.click();
      await homepage.findVoucherField.fill(voucherCode);
      await homepage.checkVoucherAvailabilityButton.click();
      await homepage.useVoucherButton.click();
      let voucherInPaymentSummary;
      voucherInPaymentSummary =
        deductType === 'product_price'
          ? (voucherInPaymentSummary = voucherAmount)
          : (voucherInPaymentSummary = voucherAmount * shippingFee);

      if (voucherInPaymentSummary > 0) {
        if (isCashback === true) {
          await page
            .getByText(
              `IDR ${voucherInPaymentSummary.toLocaleString('en-US')}`,
              { exact: true }
            )
            .waitFor({ state: 'visible' });
        } else {
          await page
            .getByText(
              `- IDR ${voucherInPaymentSummary.toLocaleString('en-US')}`,
              { exact: true }
            )
            .waitFor({ state: 'visible' });
        }
      }
    } else {
      await homepage.continueButton.click();
      shippingFee = await localStorage.getShippingFee();
    }

    if (isAddOnProduct) {
      await homepage.chooseProductAddOnButton(displayNameProductAddOn);
    } else {
      priceProductAddOn = 0;
    }

    if (isCashback !== undefined) {
      if (isCashback === false && deductType !== 'product_price') {
        voucherAmount = Math.min(voucherAmount, shippingFee);
      } else if (isCashback === true) {
        cashback = deductType === 'product_price' ? voucherAmount : shippingFee;
      }
    }

    if (isCashback === false) {
      if (deductType === 'product_price') {
        totalPrice =
          basePrice +
          processingFeeAmount +
          shippingFee -
          voucherAmount +
          priceProductAddOn;
      } else {
        totalPrice = basePrice + processingFeeAmount + priceProductAddOn;
      }
    } else {
      totalPrice =
        basePrice + processingFeeAmount + shippingFee + priceProductAddOn;
    }

    const getTextTotalPrice = await homepage.textTotalPrice.innerText();
    expect(getTextTotalPrice).toBe(`IDR ${totalPrice.toLocaleString('en-US')}`);
    await homepage.choosePayment.click();

    switch (paymentMethod.payment) {
      case 'CC':
        homepage.creditCardPaymentButton(bankCC);
        break;
      case 'VA':
        homepage.virtualAccountPaymentButton(bankVA);
        break;
      default:
        await homepage.kickCreditPaymentButton.click();
        if (!isKickPoint) {
          await homepage.useCreditButton.click();
        } else {
          await homepage.useKickPointButton.click();
        }
    }

    if (paymentMethod.payment === 'VA' || paymentMethod.payment === 'CC') {
      if (paymentMethod.isOffer) {
        pathname = '/users/bids';
      } else {
        pathname = '/users/payments/midtrans';
      }
    } else {
      if (paymentMethod.isOffer) {
        pathname = '/users/bids';
      } else {
        pathname = '/users/payments';
      }
    }

    paymentMethod.payment === 'VA' || paymentMethod.payment === 'CC'
      ? homepage.continueButton.click()
      : homepage.proceedToPaymentButton.click();

    const responseOfferOrBuy = await page.waitForResponse(
      (response) =>
        response.url().includes(pathname) && response.status() === 200
    );

    const bodyResponseOfferOrBuy = await responseOfferOrBuy.json();

    if (paymentMethod.payment === 'VA' || paymentMethod.payment === 'CC') {
      if (
        paymentMethod.isOffer === false ||
        paymentMethod.isOffer === undefined
      ) {
        invoiceNumber = bodyResponseOfferOrBuy.data.invoice_number;
        if (paymentMethod.payment === 'VA') {
          await paymentViaVA(page, paymentMethod.isOffer);
        } else {
          await paymentViaCC(page, paymentMethod.isOffer);
        }
        await page.reload();
        await buyingDashboard.getInProgressTabButton.click();
      } else {
        bidId = bodyResponseOfferOrBuy.data.id;
        await homepage.viewOfferHistoryButton.click();
      }
    } else {
      if (
        paymentMethod.isOffer === false ||
        paymentMethod.isOffer === undefined
      ) {
        invoiceNumber = bodyResponseOfferOrBuy.data.invoice_number;
        await homepage.goToBuyingDashboardButton.click();
        await page.reload();
      } else {
        await homepage.viewOfferHistoryButton.click();
        bidId = bodyResponseOfferOrBuy.data.id;
      }
    }

    if (paymentMethod.payment == 'CC') {
      if (paymentMethod.isOffer) {
        ('');
      }
    } else {
      await page.waitForResponse((response) => {
        return (
          response.url().includes('/users/payments') &&
          response.status() === 200
        );
      });
    }

    let getTextAfterPayment;
    if (paymentMethod.payment === 'Kick Credit') {
      if (isKickPoint) {
        const kickPointAfterPayment = kickPoint - totalPrice;
        getTextAfterPayment = await page
          .locator('.kick-points-container')
          .locator('.value')
          .textContent();
        expect(getTextAfterPayment).toBe(
          kickPointAfterPayment.toLocaleString('de-DE')
        );
      } else {
        const kickCreditAfterPayment = kickKredit - totalPrice;
        getTextAfterPayment = await page
          .locator('.kick-credit-container')
          .locator('.balance-value')
          .textContent();
        expect(getTextAfterPayment).toBe(
          kickCreditAfterPayment.toLocaleString('de-DE')
        );
      }
    } else if (paymentMethod.payment === 'Seller Kredit') {
      const sellerCreditAfterPayment = sellerCredit - totalPrice;
      getTextAfterPayment = await page
        .locator('.seller-credit-container')
        .locator('.balance-value')
        .textContent();
      expect(getTextAfterPayment).toBe(
        `IDR ${sellerCreditAfterPayment.toLocaleString('de-DE')}`
      );
    }

    if (paymentMethod.isOffer) {
      await buyingDashboard.getTable.waitFor({ state: 'visible' });
      await buyingDashboard.getSearchBarOffer.fill(
        selectedProduct.display_name
      );
      await page.keyboard.press('Enter');
      await buyingDashboard.getTable.waitFor({ state: 'visible' });
      const responseSellingCurrentList =
        await sellingDashboardService.sellingCurrentList(
          request,
          accessTokenSeller,
          selectedProduct.display_name
        );
      const dataResponseSellingCurrentList = responseSellingCurrentList.find(
        (product) =>
          product.product_variant.display_name === selectedProduct.display_name
      );
      userSellId = dataResponseSellingCurrentList.id;
      const responseAcceptBid = await sellingDashboardService.acceptBid(
        request,
        accessTokenSeller,
        userSellId,
        bidId
      );
      invoiceNumber = responseAcceptBid.offer.invoice_number;
      if (paymentMethod.payment === 'VA' || paymentMethod.payment === 'CC') {
        await buyingDashboard.getPendingTabButton.click();
        await buyingDashboard.getTable.waitFor({ state: 'visible' });
        await buyingDashboard.getSearchBarInPending.fill(invoiceNumber);
        await page.keyboard.press('Enter');
        await page.waitForResponse((response) => {
          return (
            response.url().includes('/users/payments') &&
            response.status() === 200
          );
        });
        await buyingDashboard.getCompletePaymentButton.click();
        switch (paymentMethod.payment) {
          case 'VA':
            await paymentViaVA(page, paymentMethod.isOffer);
            break;
          default:
            await paymentViaCC(page, paymentMethod.isOffer);
            break;
        }
      }
      await page.reload();
    }
  };

  const refreshProfile = async (page, invoiceNumber) => {
    await page.waitForResponse((response) => {
      return (
        response.url().includes('/users/payments') && response.status() === 200
      );
    });
    await buyingDashboard.getInProgressTabButton.click();
    await page.waitForResponse((response) => {
      return (
        response.url().includes('/users/payments') && response.status() === 200
      );
    });
    await buyingDashboard.getTable.waitFor({ state: 'visible' });
    await buyingDashboard.getSearchBarInProgress.fill(invoiceNumber);
    await page.keyboard.press('Enter');
    await page.waitForResponse((response) => {
      return (
        response.url().includes('/users/payments') && response.status() === 200
      );
    });
    await buyingDashboard.getTable.waitFor({ state: 'visible' });
  };

  const reload = async (page, invoiceNumber) => {
    await page.reload();
    await refreshProfile(page, invoiceNumber);
  };

  test.beforeAll(async ({ playwright }) => {
    const loginService = new LoginService();
    settingListService = new SettingList();
    productVariantService = new ProductVariant();
    stockService = new Stock();
    productAddOnListService = new ProductAddonsList();
    voucherListService = new VoucherList();
    categoriesListService = new CategoriesList();
    createDisbursementService = new CreateDisbursements();
    sellingDashboardService = new SellingDashboard();
    allSalesService = new AllSales();
    outstandingSalesService = new OutstandingSales();
    qualityControlSalesService = new QualityControl();
    legitCheckSalesService = new LegitCheck();
    preDeliveringService = new PreDelivering();
    deliveringService = new Delivering();
    dateTime = new DateTime();

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
    accessTokenQC = await getAccessToken(qualityChecker);
    accessTokenLC = await getAccessToken(legitChecker);
    accessTokenSeller = await getAccessToken(automationUserSeller);
    accessTokenBuyerMidtrans = await getAccessToken(
      automationUserBuyerMidtrans
    );
    accessTokenBuyerKickCredit = await getAccessToken(
      automationUserBuyerKickCredit
    );
    accessTokenBuyerKickPoint = await getAccessToken(
      automationUserBuyerKickPoint
    );
    accessTokenBuyerSellerCredit = await getAccessToken(
      automationUserBuyerSellerCredit
    );

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

    const responseGetProcessingFee =
      await settingListService.settingProcessingFee(
        requestContext,
        accessTokenAdmin
      );
    processingFee = responseGetProcessingFee.percentage;
  });

  test.beforeEach(async ({ page, request }) => {
    homepage = new HomePage(page, request);
    user = new User(page);
    localStorage = new LocalStorage(page);
    midtransSnap = new MidtransSnap(page);
    midtransWeb = new MidtransWeb(page);
    profile = new Profile(page);
    buyingDashboard = new BuyingDashboard(page);

    const responseAddSize = await productVariantService.addSizeOnProduct(
      request,
      accessTokenAdmin,
      category,
      selectedProduct
    );
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
    priceMultipliers = await settingListService.settingMultipliers(
      request,
      accessTokenAdmin
    );
    askingPrice =
      faker.number.int({
        min: 1,
        max: 100000
      }) * priceMultipliers;
    const responseFindUser = await user.findUser(
      request,
      accessTokenAdmin,
      automationUserSeller.emailAddress
    );
    userDetailSeller = responseFindUser.find(
      (e) => e.typed_email === automationUserSeller.emailAddress
    );
  });

  test.afterEach(async ({ page, request }) => {
    await refreshProfile(page, invoiceNumber);
    saleDetail = await allSalesService.searchSale(
      request,
      accessTokenAdmin,
      invoiceNumber
    );
    let textAuthenticationProcess;

    if (isExpress === false || isExpress === undefined) {
      let testStatusOrder = await buyingDashboard.statusOrder.textContent();
      expect(testStatusOrder.toUpperCase()).toBe(
        'AWAITING SELLER CONFIRMATION'
      );
      await sellingDashboardService.sellerConfirmation(
        request,
        accessTokenSeller,
        saleDetail.id
      );
      await reload(page, invoiceNumber);
      testStatusOrder = await buyingDashboard.statusOrder.textContent();
      expect(testStatusOrder.toUpperCase()).toBe(
        'WAITING FOR SELLER TO DELIVER'
      );
      await outstandingSalesService.changeStatusSale(
        request,
        accessTokenAdmin,
        saleDetail,
        adminDapur.emailAddress
      );
      await reload(page, invoiceNumber);
      testStatusOrder = await buyingDashboard.statusOrder.textContent();
      expect(testStatusOrder.toUpperCase()).toBe('AUTHENTICATION PROCESS');
      await qualityControlSalesService.changeStatusSale(
        request,
        accessTokenQC,
        saleDetail.id
      );
      await reload(page, invoiceNumber);
      await legitCheckSalesService.changeStatusSale(
        request,
        accessTokenLC,
        saleDetail.id
      );
      await reload(page, invoiceNumber);
    }

    textAuthenticationProcess = await buyingDashboard.statusOrder.textContent();
    expect(textAuthenticationProcess.toUpperCase()).toBe(
      'AUTHENTICATION PROCESS - SUCCESS'
    );
    const responsePreDelivering = await preDeliveringService.changeStatusSale(
      request,
      accessTokenAdmin,
      saleDetail
    );
    await deliveringService.inputAWB(
      request,
      accessTokenAdmin,
      responsePreDelivering
    );
    await reload(page, invoiceNumber);
    await buyingDashboard.trackYourPackageButton.click();
    expect(await buyingDashboard.IHaveReceivedMyPackageButton).toBeVisible();
    await buyingDashboard.IHaveReceivedMyPackageButton.click();
    await buyingDashboard.getHistoryTabButton.click();
    await buyingDashboard.getTable.waitFor({ state: 'visible' });
    await buyingDashboard.getSearchBarHistory.fill(invoiceNumber);
    await page.keyboard.press('Enter');
    await page.waitForResponse((response) => {
      return (
        response.url().includes('/users/payments') && response.status() === 200
      );
    });
    textAuthenticationProcess = await buyingDashboard.statusOrder.textContent();
    expect(textAuthenticationProcess.toUpperCase()).toBe('DELIVERED');
    await page.reload();
    await page.waitForResponse((response) => {
      return (
        response.url().includes('/users/payments') && response.status() === 200
      );
    });
    let expectedKickPoint;
    const kickPointPromo = await settingListService.kickPointPromo(
      request,
      accessTokenAdmin
    );
    const startedAtKickPointPromo = kickPointPromo.start_time;
    const endedAtKickPointPromo = kickPointPromo.end_time;
    const percentageKickPointPromo = kickPointPromo.percentage / 100;
    let kickPointPercentage = (await dateTime.isDateInRange(
      startedAtKickPointPromo,
      endedAtKickPointPromo
    ))
      ? percentageKickPointPromo
      : 0.003;

    if (params?.paymentMethod?.isKickPoint) {
      expectedKickPoint = kickPoint - totalPrice;
    } else {
      if (params?.voucher) {
        if (deductType === 'product_price') {
          if (cashback) {
            expectedKickPoint = kickPoint + cashback;
          } else {
            expectedKickPoint = Math.ceil(
              kickPoint + (basePrice - voucherAmount) * kickPointPercentage
            );
          }
        }
      } else {
        expectedKickPoint = Math.ceil(
          kickPoint + basePrice * kickPointPercentage
        );
      }
    }
    expect(
      await page
        .locator('.kick-points-container')
        .locator('.value')
        .textContent()
    ).toBe(expectedKickPoint.toLocaleString('de-DE'));
  });

  test('Should be to make an offer for a product Kick Credit', async ({
    page,
    request
  }) => {
    accessTokenBuyer = accessTokenBuyerKickCredit;
    emailBuyer = automationUserBuyerKickCredit.emailAddress;
    params = {
      paymentMethod: {
        payment: 'Kick Credit',
        isOffer: true
      },
      sizeUS
    };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Standard',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });

  test('Should be to make an offer for a product Kick Point', async ({
    page,
    request
  }) => {
    accessTokenBuyer = accessTokenBuyerKickPoint;
    emailBuyer = automationUserBuyerKickPoint.emailAddress;
    params = {
      paymentMethod: {
        payment: 'Kick Credit',
        isOffer: true,
        isKickPoint: true
      },
      sizeUS
    };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Standard',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });

  test('Should be to make an offer for a product Seller Credit', async ({
    page,
    request
  }) => {
    accessTokenBuyer = accessTokenBuyerSellerCredit;
    emailBuyer = automationUserBuyerSellerCredit.emailAddress;
    params = {
      paymentMethod: {
        payment: 'Seller Credit',
        isOffer: true
      },
      sizeUS
    };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Standard',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });

  test('Should be to make an offer for a product Virtual Account', async ({
    page,
    request
  }) => {
    accessTokenBuyer = accessTokenBuyerMidtrans;
    emailBuyer = automationUserBuyerMidtrans.emailAddress;
    params = {
      paymentMethod: {
        payment: 'VA',
        isOffer: true
      },
      sizeUS
    };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Standard',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });

  test('Should be to make an offer for a product Credit Card', async ({
    page,
    request
  }) => {
    accessTokenBuyer = accessTokenBuyerMidtrans;
    emailBuyer = automationUserBuyerMidtrans.emailAddress;
    params = {
      paymentMethod: {
        payment: 'CC',
        isOffer: true
      },
      sizeUS
    };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Standard',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });

  test('Should be to Buy product using Private Voucher', async ({
    page,
    request
  }) => {
    accessTokenBuyer = accessTokenBuyerSellerCredit;
    emailBuyer = automationUserBuyerSellerCredit.emailAddress;
    params = {
      voucher: { isVoucher: true, typeOfVoucher: 'private' },
      sizeUS
    };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Standard',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });

  test('Should be to Buy product using Public Voucher', async ({
    page,
    request
  }) => {
    accessTokenBuyer = accessTokenBuyerSellerCredit;
    emailBuyer = automationUserBuyerSellerCredit.emailAddress;
    params = {
      voucher: { isVoucher: true, typeOfVoucher: 'public' },
      sizeUS
    };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Standard',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });

  test('Should be to Buy product using Public Open Voucher', async ({
    page,
    request
  }) => {
    accessTokenBuyer = accessTokenBuyerSellerCredit;
    emailBuyer = automationUserBuyerSellerCredit.emailAddress;
    params = {
      voucher: { isVoucher: true, typeOfVoucher: 'public_open' },
      sizeUS
    };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Standard',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });

  test('Should be to buy product using Virtual Account', async ({
    page,
    request
  }) => {
    accessTokenBuyer = accessTokenBuyerMidtrans;
    emailBuyer = automationUserBuyerMidtrans.emailAddress;
    params = {
      paymentMethod: {
        payment: 'VA',
        isOffer: false
      },
      sizeUS
    };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Standard',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });

  test('Should be to buy product using Credit Card', async ({
    page,
    request
  }) => {
    accessTokenBuyer = accessTokenBuyerMidtrans;
    emailBuyer = automationUserBuyerMidtrans.emailAddress;
    params = {
      paymentMethod: {
        payment: 'CC',
        isOffer: false
      },
      sizeUS
    };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Standard',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });

  test('Should be to buy product using Kick Credit', async ({
    page,
    request
  }) => {
    accessTokenBuyer = accessTokenBuyerKickCredit;
    emailBuyer = automationUserBuyerKickCredit.emailAddress;
    params = {
      sizeUS,
      paymentMethod: {
        payment: 'Kick Credit',
        isOffer: false
      }
    };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Standard',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });

  test('Should be to buy product using Kick Point', async ({
    page,
    request
  }) => {
    accessTokenBuyer = accessTokenBuyerKickPoint;
    emailBuyer = automationUserBuyerKickPoint.emailAddress;
    params = {
      paymentMethod: {
        payment: 'Kick Credit',
        isOffer: false,
        isKickPoint: true
      },
      sizeUS
    };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Standard',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });

  test('Should be to buy product using Seller Credit', async ({
    page,
    request
  }) => {
    accessTokenBuyer = accessTokenBuyerSellerCredit;
    emailBuyer = automationUserBuyerSellerCredit.emailAddress;
    params = {
      paymentMethod: {
        payment: 'Seller Credit',
        isOffer: false
      },
      sizeUS
    };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Standard',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });

  test('Should be to buy product with "Add On Product"', async ({
    page,
    request
  }) => {
    accessTokenBuyer = accessTokenBuyerSellerCredit;
    emailBuyer = automationUserBuyerSellerCredit.emailAddress;
    params = {
      isAddOnProduct: true,
      sizeUS
    };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Standard',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });

  test('Should be to buy standard product', async ({ page, request }) => {
    accessTokenBuyer = accessTokenBuyerSellerCredit;
    emailBuyer = automationUserBuyerSellerCredit.emailAddress;
    params = { sizeUS };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Standard',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice
    });
    await openWebsiteUntilProductDetail(page, request, { sizeUS });
  });

  test('Should be to buy pre order product', async ({ page, request }) => {
    accessTokenBuyer = accessTokenBuyerSellerCredit;
    emailBuyer = automationUserBuyerSellerCredit.emailAddress;
    params = {
      productCondition: 'Pre Order',
      sizeUS
    };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Pre Order',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });

  test('Should be to buy used product', async ({ page, request }) => {
    accessTokenBuyer = accessTokenBuyerSellerCredit;
    emailBuyer = automationUserBuyerSellerCredit.emailAddress;
    params = {
      productCondition: 'Used',
      sizeUS
    };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Standard',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice,
      isBrandNew: false
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });

  test('Should be to buy express product', async ({ page, request }) => {
    accessTokenBuyer = accessTokenBuyerSellerCredit;
    emailBuyer = automationUserBuyerSellerCredit.emailAddress;
    isExpress = true;
    params = { sizeUS };
    await stockService.addStock(request, {
      accessTokenAdmin,
      shippingMethod: 'Express',
      selectedProduct,
      userDetailSeller,
      sizeId,
      price: askingPrice,
      accessTokenQC,
      accessTokenLC
    });
    await openWebsiteUntilProductDetail(page, request, params);
  });
});
