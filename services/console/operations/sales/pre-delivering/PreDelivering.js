const { faker } = require('@faker-js/faker');

exports.PreDelivering = class PreDelivering {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  }

  async changeStatusSale(request, accessTokenAdmin, sale) {
    try {
      const courier = faker.helpers.arrayElement([
        'JNT',
        'POS',
        'GOSEND',
        'WAREHOUSE',
        'PAXEL',
        'JNE'
      ]);
      const saleId = sale.id;
      const response = await request.put(
        `${this.lumenURL}/admins/sales/${saleId}`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          data: {
            notes: '',
            ka_courier: courier,
            ka_courier_option: '',
            status: 'PENDING_DELIVERING'
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error change status:', error);
      throw error;
    }
  }
};
