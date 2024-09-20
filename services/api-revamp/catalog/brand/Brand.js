const { faker } = require('@faker-js/faker');
exports.Brand = class Brand {
  constructor(page) {
    this.page = page;
    this.apiRevamp = process.env.API_REVAMP_URL;
  }

  async createBrand(request, accessTokenUser) {
    try {
      const body = {
        name: faker.lorem.word() + faker.number.int(),
        background_image: faker.image.url(),
        logo_image: faker.image.url(),
        description: faker.lorem.text(),
        is_partner: faker.helpers.arrayElement([true, false]),
        is_active: faker.helpers.arrayElement([true, false])
      };
      const response = await request.post(
        `${this.apiRevamp}/api/v1/catalog/brand/create`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenUser}`
          },
          data: body
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse;
    } catch (error) {
      console.error('Error create brand :', error);
      return null;
    }
  }

  async updateBrand(request, accessTokenUser, id) {
    try {
      const body = {
        name: faker.lorem.word() + faker.number.int(),
        background_image: faker.image.url(),
        logo_image: faker.image.url(),
        description: faker.lorem.text(),
        is_partner: faker.helpers.arrayElement([true, false]),
        is_active: faker.helpers.arrayElement([true, false])
      };

      const response = await request.put(
        `${this.apiRevamp}/api/v1/catalog/brand/update/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenUser}`
          },
          data: body
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse;
    } catch (error) {
      console.error('Error update brand :', error);
      return null;
    }
  }

  async getBrandById(request, accessTokenUser, id) {
    try {
      const response = await request.get(
        `${this.apiRevamp}/api/v1/catalog/brand/get/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenUser}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse;
    } catch (error) {
      console.error('Error get brand by id:', error);
      return null;
    }
  }

  async getAllBrand(request, accessTokenUser) {
    try {
      const response = await request.get(
        `${this.apiRevamp}/api/v1/catalog/brand/get`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenUser}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse;
    } catch (error) {
      console.error('Error get all brand:', error);
      return null;
    }
  }

  async deleteBrand(request, accessTokenUser, id) {
    try {
      const response = await request.delete(
        `${this.apiRevamp}/api/v1/catalog/brand/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenUser}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse;
    } catch (error) {
      console.error('Error get all brand:', error);
      return null;
    }
  }
};
