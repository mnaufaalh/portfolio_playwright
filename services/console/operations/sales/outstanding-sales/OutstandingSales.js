const { DateTime } = require('@utils/DateTime');

exports.OutstandingSales = class OutstandingSales {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
    this.dateTime = new DateTime();
  }

  async changeStatusSale(request, accessTokenAdmin, sale, email) {
    try {
      const saleId = sale.id;
      const response = await request.put(
        `${this.lumenURL}/admins/sales/${saleId}`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          data: {
            notes: '',
            seller_courier: null,
            seller_courier_option: '',
            seller_courier_price: 0,
            seller_price: sale.seller_price,
            seller_sent: this.dateTime.getCurrentDateAndTime(),
            seller_awb_number: null,
            received_at: this.dateTime.getCurrentDateAndTime(),
            received_by: email,
            status: 'KA_RECEIVED'
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
