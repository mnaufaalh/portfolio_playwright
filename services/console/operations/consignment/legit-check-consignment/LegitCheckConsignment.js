exports.LegitCheckConsignment = class LegitCheckConsignment {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  };
  async changeStatusConsignment(request, accessTokenLC, selectedConsignmentItem) {
    try {
      const consignmentId = selectedConsignmentItem.id;
      const response = await request.put(`${this.lumenURL}/admins/sell-consignments/${consignmentId}`, {
        headers: {
          Authorization: `Bearer ${accessTokenLC}`
        },
        data: {
          status: 'VERIFICATION_PASSED',
          ka_verified: true
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      };
      const bodyResponse = response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error change status:', error);
      throw error;
    }
  };
};