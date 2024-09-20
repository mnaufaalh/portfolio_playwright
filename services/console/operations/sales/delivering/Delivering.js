const { faker } = require('@faker-js/faker');
const { DateTime } = require('@utils/DateTime');

exports.Delivering = class Delivering {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
    this.dateTime = new DateTime();
  }

  async inputAWB(request, accessTokenAdmin, sale) {
    try {
      const saleId = sale.id;
      const response = await request.put(
        `${this.lumenURL}/admins/sales/${saleId}/awb_number`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          data: {
            notes: '',
            ka_courier: sale.sale_shipping.ka_courier,
            ka_courier_option: '',
            ka_courier_price: faker.number.int(),
            awb_number: faker.string.alpha(10),
            ka_sent: this.dateTime.getCurrentDateAndTime()
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data.data;
    } catch (error) {
      console.error('Error change status:', error);
      throw error;
    }
  }
};
