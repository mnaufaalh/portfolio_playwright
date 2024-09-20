const {
  SellAndConsignmentRequest
} = require('@services/console/operations/sell-and-consignment-request/SellAndConsignmentRequest');
const {
  AllConsignment
} = require('@services/console/operations/consignment/all-consignment/AllConsignment');
const {
  OutstandingConsignment
} = require('@services/console/operations/consignment/outstanding-consignment/OutstandingConsignment');
const {
  QualityControlConsignment
} = require('@services/console/operations/consignment/quality-control-consignment/QualityControlConsignment');
const {
  LegitCheckConsignment
} = require('@services/console/operations/consignment/legit-check-consignment/LegitCheckConsignment');
const {
  RackList
} = require('@services/console/operations/consignment/racks/rack-list/RackList');
const { faker } = require('@faker-js/faker');
const {
  RackAssignment
} = require('@services/console/operations/consignment/rack-assignment/RackAssignment');

exports.Stock = class Stock {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
    this.sellAndConsignmentRequest = new SellAndConsignmentRequest();
    this.allConsignment = new AllConsignment();
    this.outstandingConsignment = new OutstandingConsignment();
    this.qualityControlConsignment = new QualityControlConsignment();
    this.LegitCheckConsignment = new LegitCheckConsignment();
    this.rackList = new RackList();
    this.rackAssignment = new RackAssignment();
  }

  async addStock(request, params) {
    const {
      accessTokenAdmin,
      accessTokenQC,
      accessTokenLC,
      shippingMethod = 'Standard', // Standard, Express, Pre Order
      isBrandNew = true,
      isDefect = false,
      userDetailSeller,
      selectedProduct,
      sizeId,
      price = 1000000,
      quantity = 1,
      preOrder = false,
      preVerified = false,
      missingAccessories = false,
      displayItem = false,
      yellowing = false,
      noTags = false,
      sneakersDefect = false,
      manufactureDefect = false,
      missingOriginal = false,
      discoloration = false,
      scratches = false,
      transferredColor = false,
      signOfWear = false,
      noExtraLaces = false,
      noWrapPaper = false,
      box = false,
      dustBag = false,
      tag = false,
      mirror = false,
      starps = false,
      authenticationCard = false,
      stockStatus = 'KA_STOCK'
    } = params;

    const body = {
      user_id: userDetailSeller.id,
      product_variant_id: selectedProduct.id,
      size_id: sizeId,
      asking_price: price,
      purchase_price: price,
      quantity: quantity,
      pre_order: preOrder,
      pre_verified: preVerified,
      rack: null,
      expiry: null,
      defects: {
        missing_accessories: missingAccessories,
        display_item: displayItem,
        yellowing: yellowing,
        sneakers_defect: sneakersDefect
      },
      missing_accessories_list: {
        no_extra_laces: noExtraLaces,
        no_wrap_paper: noWrapPaper,
        no_tags: noTags
      }
    };

    if (isBrandNew === true) {
      body.sneakers_condition = 'BARU';
    } else {
      body.sneakers_condition = 'BEKAS';
    }

    if (isDefect === false) {
      body.box_condition = 'SEMPURNA';
    } else {
      body.box_condition = 'CACAT';
    }

    const functionAddStock = async (request, accessTokenAdmin, body) => {
      try {
        const response = await request.post(`${this.lumenURL}/admins/sells`, {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          data: body
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseBody = await response.json();
        return responseBody.data;
      } catch (error) {
        console.error('Error adding stock:', error);
        throw error;
      }
    };

    let consignmentNumber;
    let userSell;
    let selectedConsignmentItem;

    switch (shippingMethod) {
      case 'Express':
        body.defects.no_tags = noTags;
        body.defects.manufacture_defect = manufactureDefect;
        body.defects.missing_original = missingOriginal;
        body.defects.discoloration = discoloration;
        body.defects.scratches = scratches;
        body.defects.transferred_color = transferredColor;
        body.defects.sign_of_wear = signOfWear;
        (body.inclusions = {
          box: box,
          dust_bag: dustBag,
          tag: tag,
          mirror: mirror,
          straps: starps,
          authentication_card: authenticationCard
        }),
          (body.pre_verified = true);
        body.rack = '';
        body.note = '';
        body.expiry = '';
        body.consignment = true;
        body.request_type = 'CONSIGNMENT_REQUEST';
        body.stock_status = stockStatus;
        body.hypequarter_display = false;
        userSell = await functionAddStock(request, accessTokenAdmin, body);
        const responseChangeStatus =
          await this.sellAndConsignmentRequest.changeStatusSellAndConsignmentRequest(
            request,
            accessTokenAdmin,
            userSell,
            'consignment_approved'
          );
        consignmentNumber = responseChangeStatus.consignment_id;
        const responseConsignmentList =
          await this.allConsignment.consignmentList(request, accessTokenAdmin);
        selectedConsignmentItem = responseConsignmentList.data.find(
          (e) => e.consignment_number === consignmentNumber
        );
        await this.outstandingConsignment.changeStatusConsignment(
          request,
          accessTokenAdmin,
          selectedConsignmentItem
        );
        await this.qualityControlConsignment.changeStatusConsignment(
          request,
          accessTokenQC,
          selectedConsignmentItem
        );
        await this.LegitCheckConsignment.changeStatusConsignment(
          request,
          accessTokenLC,
          selectedConsignmentItem
        );
        const responseRackList = await this.rackList.rackList(
          request,
          accessTokenAdmin
        );
        const rackId =
          responseRackList[
            faker.number.int({ min: 0, max: responseRackList.length - 1 })
          ].id;
        await this.rackAssignment.assignRack(
          request,
          accessTokenAdmin,
          selectedConsignmentItem,
          userSell,
          rackId
        );
        break;
      case 'Standard':
        body.status = 'approved';
        await functionAddStock(request, accessTokenAdmin, body);
        break;
      default:
        body.status = 'approved';
        body.pre_order = true;
        delete body.defects.yellowing;
        body.missing_accessories_list = false;
        body.sneakers_defect = sneakersDefect;
        await functionAddStock(request, accessTokenAdmin, body);
        break;
    }
  }
};
