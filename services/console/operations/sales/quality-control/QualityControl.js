exports.QualityControl = class QualityControl {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  }

  async changeStatusSale(request, accessTokenQC, id) {
    try {
      const response = await request.put(
        `${this.lumenURL}/admins/sales/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenQC}`
          },
          data: {
            ka_verified: true,
            status: 'VERIFICATION_PASSED'
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data.data;
    } catch (error) {
      console.error('Error change status sale:', error);
      return false;
    }
  }
};
