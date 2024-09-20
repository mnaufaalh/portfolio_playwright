exports.RackList = class RackList {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  }
  async rackList(request, accessTokenAdmin) {
    try {
      const response = await request.get(`${this.lumenURL}/admins/sell_racks`, {
        headers: {
          Authorization: `Bearer ${accessTokenAdmin}`
        },
        params: {
          availables: true,
          no_limit: true
        }
      });
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
