exports.BrandList = class BrandList {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  }

  async brandList(request, accessTokenAdmin, categoryId) {
    try {
      if (categoryId === 4) {
        categoryId = 5;
      }
      const response = await request.get(`${this.lumenURL}/admins/brands?`, {
        headers: {
          Authorization: `Bearer ${accessTokenAdmin}`
        },
        params: {
          category_id: categoryId
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const body = await response.json();
      return body.data;
    } catch (error) {
      console.error('Error brand detail:', error);
      return null;
    }
  }
};
