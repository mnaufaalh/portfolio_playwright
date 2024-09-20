exports.QualityControlConsignment = class QualityControlConsignment {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  };
  async changeStatusConsignment(request, accessTokenQC, selectedConsignmentItem) {
    try {
      const consignmentId = selectedConsignmentItem.id;
      const response = await request.put(`${this.lumenURL}/admins/sell-consignments/${consignmentId}`, {
        headers: {
          Authorization: `Bearer ${accessTokenQC}`
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