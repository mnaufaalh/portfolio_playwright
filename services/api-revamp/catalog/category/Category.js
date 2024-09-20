const { faker } = require('@faker-js/faker');
exports.Category = class Category {
  constructor(page) {
    this.page = page;
    this.apiRevamp = process.env.API_REVAMP_URL;
  }

  async createCategory(request, accessTokenUser) {
    try {
      const body = {
        name: faker.lorem.word() + faker.number.int(),
        sequence: faker.number.int({ min: 1, max: 3 }),
        is_active: faker.helpers.arrayElement([true, false])
      };
      const response = await request.post(
        `${this.apiRevamp}/api/v1/catalog/category/create`,
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
      console.error('Error create category :', error);
      return null;
    }
  }

  async updateCategory(request, accessTokenUser, id) {
    try {
      const body = {
        name: faker.lorem.word() + faker.number.int(),
        sequence: faker.number.int({ min: 1, max: 3 }),
        is_active: faker.helpers.arrayElement([true, false])
      };

      const response = await request.put(
        `${this.apiRevamp}/api/v1/catalog/category/update/${id}`,
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
      console.error('Error update category :', error);
      return null;
    }
  }

  async getCategoryById(request, accessTokenUser, id) {
    try {
      const response = await request.get(
        `${this.apiRevamp}/api/v1/catalog/category/get/${id}`,
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
      console.error('Error get category by id:', error);
      return null;
    }
  }

  async getAllCategory(request, accessTokenUser) {
    try {
      const response = await request.get(
        `${this.apiRevamp}/api/v1/catalog/category/get`,
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
      console.error('Error get all category:', error);
      return null;
    }
  }

  async deleteCategory(request, accessTokenUser, id) {
    try {
      const response = await request.delete(
        `${this.apiRevamp}/api/v1/catalog/category/delete/${id}`,
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
      console.error('Error get all category:', error);
      return null;
    }
  }
};
