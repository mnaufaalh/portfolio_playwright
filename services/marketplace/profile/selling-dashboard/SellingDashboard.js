exports.SellingDashboard = class SellingDashboard {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  }

  async sellingCurrentList(request, accessTokenSeller, keyword) {
    try {
      const response = await request.get(
        `${this.lumenURL}/users/selling/sells`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenSeller}`
          },
          params: {
            keyword: keyword
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data.data;
    } catch (error) {
      console.error('Error fetching selling list :', error);
      return null;
    }
  }

  async acceptBid(request, accessTokenSeller, userSellId, bidId) {
    try {
      const response = await request.post(
        `${this.lumenURL}/users/sells/${userSellId}/bids`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenSeller}`
          },
          data: {
            bid_id: bidId
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error accept bid :', error);
      return null;
    }
  }

  async sellerConfirmation(request, accessTokenSeller, id) {
    try {
      const response = await request.put(
        `${this.lumenURL}/users/sales/approvals/${id}`,
        { headers: { Authorization: `Bearer ${accessTokenSeller}` } }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error accept bid :', error);
      return null;
    }
  }
};
