exports.CategoriesList = class CategoriesList {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  }

  async listOfCategories(request, accessTokenAdmin) {
    try {
      const response = await request.get(`${this.lumenURL}/admins/categories`, {
        headers: {
          Authorization: `Bearer ${accessTokenAdmin}`
        },
        params: {
          no_limit: true
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error fetching categories list:', error);
      return null;
    }
  }
};
