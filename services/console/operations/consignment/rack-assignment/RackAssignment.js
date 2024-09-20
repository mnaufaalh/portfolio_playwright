exports.RackAssignment = class RackAssignment {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  };
  async assignRack(request, accessTokenAdmin, selectedConsignmentItem, userSell, rackId) {
    try {
      const consignmentId = selectedConsignmentItem.id;
      const response = await request.post(`${this.lumenURL}/admins/sell-consignments/${consignmentId}/racks`, {
        headers: {
          Authorization: `Bearer ${accessTokenAdmin}`
        },
        data: {
          sell_id: userSell.id,
          rack_id: rackId
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      };
      const bodyResponse = response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error assign rack:', error);
      throw error;
    }
  };
};