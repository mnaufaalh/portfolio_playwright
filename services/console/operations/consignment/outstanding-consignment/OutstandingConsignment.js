const { DateTime } = require('@utils/DateTime');

exports.OutstandingConsignment = class OutstandingConsignment {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
    this.dateTime = new DateTime();
  }
  async changeStatusConsignment(
    request,
    accessTokenAdmin,
    selectedConsignmentItem
  ) {
    try {
      const consignmentId = selectedConsignmentItem.id;
      const response = await request.put(
        `${this.lumenURL}/admins/sell-consignments/${consignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          data: {
            status: 'KA_RECEIVED',
            notes: '',
            seller_courier_option: '',
            seller_courier: '',
            seller_awb_number: '',
            received_at: this.dateTime.getCurrentDateAndTime(),
            seller_sent: this.dateTime.getCurrentDateAndTime(),
            received_by: ''
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error change status:', error);
      throw error;
    }
  }
};
