exports.AllConsignment = class AllConsignment {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  }

  async consignmentList(request, accessTokenAdmin) {
    try {
      const response = await request.get(
        `${this.lumenURL}/admins/sell-consignments`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          params: {
            type: 'outstanding',
            sort_by: 'updatedAt_desc'
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error consignment list:', error);
      throw error;
    }
  }
};
