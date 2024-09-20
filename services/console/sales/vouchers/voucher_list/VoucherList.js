const { faker } = require('@faker-js/faker');
const {
  SettingList
} = require('@services/console/setting/setting-list/SettingList');
exports.VoucherList = class VoucherList {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
    this.settingList = new SettingList();
  }

  async listOfVoucher(request, accessTokenAdmin, typeOfVoucher) {
    try {
      const response = await request.get(`${this.lumenURL}/admins/vouchers`, {
        headers: {
          Authorization: `Bearer ${accessTokenAdmin}`
        },
        params: {
          voucher_type: typeOfVoucher //public, private, public_open
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      const lastPage = bodyResponse.data.last_page;
      const secondResponse = await request.get(
        `${this.lumenURL}/admins/vouchers`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          params: {
            voucher_type: typeOfVoucher, //public, private, public_open,
            page: faker.number.int({ min: 1, max: lastPage })
          }
        }
      );
      const bodySecondResponse = await secondResponse.json();
      return bodySecondResponse.data.data;
    } catch (error) {
      console.error('Error fetching voucher list:', error);
      return null;
    }
  }
  async totalVoucherUsage(request, accessTokenAdmin, id) {
    try {
      const response = await request.get(
        `${this.lumenURL}/admins/vouchers/${id}/usages`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data.total_usages;
    } catch (error) {
      console.error('Error fetching total voucher usage:', error);
      return null;
    }
  }
  async editVariantVoucher(request, accessTokenAdmin, id) {
    try {
      const response = await request.put(
        `${this.lumenURL}/admins/vouchers/${id}/voucher_variants`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          data: { product_variants: ['*'] }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error edit variant voucher:', error);
      return null;
    }
  }
  async voucherDetail(request, accessTokenAdmin, id) {
    try {
      const response = await request.get(
        `${this.lumenURL}/admins/vouchers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error fetching voucher detail:', error);
      return null;
    }
  }
  async addUserInVoucher(request, accessTokenAdmin, id, userDetailBuyer) {
    try {
      const userId = userDetailBuyer.id;
      return await request.post(
        `${this.lumenURL}/admins/vouchers/uservouchers`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          data: {
            used: false,
            used_count: 0,
            used_at: null,
            voucher_id: id,
            user_id: [userId],
            quantity: 1,
            started_at: null,
            ended_at: null
          }
        }
      );
    } catch (error) {
      console.error('Error add user in voucher:', error);
      return null;
    }
  }
  async editPaymentMethodInVoucher(request, accessTokenAdmin, id) {
    try {
      const responsePaymentList = await this.settingList.paymentList(
        request,
        accessTokenAdmin
      );
      const body = await responsePaymentList.json();
      const response = await request.post(
        `${this.lumenURL}/admins/vouchers/payment_methods/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          data: body
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error edit payment method in voucher:', error);
      return null;
    }
  }
  async editCategoriesInVoucher(
    request,
    accessTokenAdmin,
    idVoucher,
    categoriesId
  ) {
    try {
      const response = await request.post(
        `${this.lumenURL}/admins/vouchers/${idVoucher}/categories`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          data: { categories: categoriesId }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error edit categories in voucher:', error);
      return null;
    }
  }
  async userUsageVoucher(request, accessTokenAdmin, id, userDetailBuyer) {
    try {
      const userId = userDetailBuyer.id;
      const response = await request.get(
        `${this.lumenURL}/admins/vouchers/${id}/users`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data.data.length;
    } catch (error) {
      console.error('Error fetch user usage voucher:', error);
      return null;
    }
  }
  async removeBrandsInVoucher(request, accessTokenAdmin, id) {
    try {
      const response = await request.put(
        `${this.lumenURL}/admins/vouchers/${id}/voucher_brands`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          data: { brands: ['*'] }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error to remove brands in voucher:', error);
      return null;
    }
  }
  async editBeUsableVoucher(request, accessTokenAdmin, id, bodyVoucher) {
    try {
      const response = await request.put(
        `${this.lumenURL}/admins/vouchers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          data: bodyVoucher
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error edit be useable voucher:', error);
      return null;
    }
  }

  async userListUseVoucher(request, accessTokenAdmin, id) {
    try {
      const response = await request.get(
        `${this.lumenURL}/admins/vouchers/${id}/users`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.total;
    } catch (error) {
      console.error('Error get user list use voucher:', error);
      return null;
    }
  }
};
