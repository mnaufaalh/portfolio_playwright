exports.ProductList = class ProductList {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  }

  async productDetail(request, accessTokenAdmin, category) {
    try {
      let categoryId;

      switch (category) {
        case 'sneakers':
          categoryId = 1;
          break;
        case 'apparels':
          categoryId = 2;
          break;
        case 'handbags':
          categoryId = 3;
          break;
        default:
          categoryId = 4;
      }

      const response = await request.get(
        `${this.lumenURL}/products/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const body = await response.json();
      return body.data;
    } catch (error) {
      console.error('Error product detail:', error);
      return null;
    }
  }
};
