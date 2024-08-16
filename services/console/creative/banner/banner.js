exports.Banner = class Banner {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  }
  async isBanner(request, accessTokenAdmin) {
    try {
      const response = await request.get(`${this.lumenURL}/popup_banners`, {
        headers: {
          Authorization: `Bearer ${accessTokenAdmin}`
        },
        data: {
          keyword: 'home'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const body = await response.json()
      return body.data;
    } catch (error) {
      console.error('Error fetching banner:', error);
      return null;
    }
  }
};