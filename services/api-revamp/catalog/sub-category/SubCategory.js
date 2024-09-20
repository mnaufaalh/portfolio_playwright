const { Category } = require('@services/api-revamp/catalog/category/Category');

exports.SubCategory = class SubCategory {
  constructor(page) {
    this.page = page;
    this.apiRevamp = process.env.API_REVAMP_URL;
  }

  async createSubCategory(request, accessTokenUser) {
    try {
      const category = new Category();
      const responseCategory = await category.createCategory(
        request,
        accessTokenUser
      );
      const body = {
        name: faker.lorem.word() + faker.number.int(),
        parent_id: responseCategory.Data.id,
        sequence: faker.number.int({ min: 1, max: 3 }),
        complementary_id: [],
        is_active: faker.helpers.arrayElement([true, false])
      };

      const response = await request.post(
        `${this.apiRevamp}/api/v1/catalog/sub-category/create`,
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
      console.error('Error create sub category :', error);
      return null;
    }
  }

  async updateSubCategory(request, accessTokenUser, id) {
    try {
      const body = {
        name: faker.lorem.word() + faker.number.int(),
        parent_id: responseCategory.Data.id,
        sequence: faker.number.int({ min: 1, max: 3 }),
        complementary_id: [],
        is_active: faker.helpers.arrayElement([true, false])
      };

      const response = await request.put(
        `${this.apiRevamp}/api/v1/catalog/sub-category/update/${id}`,
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
      console.error('Error update sub category :', error);
      return null;
    }
  }

  async getSubCategoryById(request, accessTokenUser, id) {
    try {
      const response = await request.get(
        `${this.apiRevamp}/api/v1/catalog/sub-category/get/${id}`,
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
      console.error('Error get sub category by id:', error);
      return null;
    }
  }

  async deleteSubCategoryById(request, accessTokenUser, id) {
    try {
      const response = await request.delete(
        `${this.apiRevamp}/api/v1/catalog/sub-category/delete/${id}`,
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
      console.error('Error delete sub category by id:', error);
      return null;
    }
  }
};
