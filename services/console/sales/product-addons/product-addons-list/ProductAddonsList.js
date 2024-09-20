const { faker } = require('@faker-js/faker');

exports.ProductAddonsList = class ProductAddonsList {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  }

  async listOfProductAddons(request, accessTokenAdmin) {
    try {
      const response = await request.get(
        `${this.lumenURL}/admins/products/addons`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          params: {
            per_page: 25
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error fetching product addon list:', error);
      return null;
    }
  }

  async productAddOnDetail(request, accessTokenAdmin, id) {
    try {
      const response = await request.get(
        `${this.lumenURL}/admins/products/addons/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error fetching product addon detail:', error);
      return null;
    }
  }

  async editProductAddOn(request, accessTokenAdmin, productAddOnDetail) {
    const id = productAddOnDetail.id;
    productAddOnDetail.quantity = faker.number.int();
    if (productAddOnDetail.order < 24) {
      productAddOnDetail.order = 0;
    }
    try {
      const response = request.put(
        `${this.lumenURL}/admins/products/addons/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          data: productAddOnDetail
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error edit product addon:', error);
      return null;
    }
  }

  async selectedProductAddon(request, accessTokenAdmin) {
    try {
      const listOfProductAddons = await this.listOfProductAddons(
        request,
        accessTokenAdmin
      );
      const selectedProductOn =
        listOfProductAddons.data[faker.number.int(listOfProductAddons.to - 1)];
      if (selectedProductOn.quantity === 0) {
        const idSelectedProductAddOn = selectedProductOn.id;
        const selectedProductAddOnDetail = await this.productAddOnDetail(
          request,
          accessTokenAdmin,
          idSelectedProductAddOn
        );
        await this.editProductAddOn(
          request,
          accessTokenAdmin,
          selectedProductAddOnDetail
        );
      }
      return selectedProductOn;
    } catch (error) {
      console.error('Error selected product addon:', error);
      return null;
    }
  }
};
