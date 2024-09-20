exports.SellAndConsignmentRequest = class SellAndConsignmentRequest {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  };

  async changeStatusSellAndConsignmentRequest(request, accessTokenAdmin, userSell, status) {
    try {
      const response = await request.put(`${this.lumenURL}/admins/sells/${userSell.id}/status`, {
        headers: {
          Authorization: `Bearer ${accessTokenAdmin}`
        },
        data: {
          status: status
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      };
      const responseBody = await response.json();
      return responseBody.data;
    } catch (error) {
      console.error('Error change status:', error);
      throw error;
    };
  };
};