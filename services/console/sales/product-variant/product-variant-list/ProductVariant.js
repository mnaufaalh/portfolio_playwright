const { faker } = require('@faker-js/faker');
const {
  ProductList
} = require('@services/console/sales/products/product-list/ProductList');
const {
  BrandList
} = require('@services/console/sales/brands/brand-list/BrandList');

exports.ProductVariant = class ProductVariant {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
    this.productList = new ProductList();
    this.brandList = new BrandList();
  }

  async listOfProductVariant(request, accessTokenAdmin, category, page = 1) {
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
          categoryId = 5;
      }

      const responseGetTotalPage = await request.get(
        `${this.lumenURL}/admins/productvariants`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          params: {
            category_id: categoryId,
            page: page
          }
        }
      );

      const bodyGetTotalPage = await responseGetTotalPage.json();
      const totalPage = bodyGetTotalPage.data.last_page;

      const randomPage = faker.number.int({ min: 1, max: totalPage });
      const responseSelectedProductVariant = await request.get(
        `${this.lumenURL}/admins/productvariants`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          params: {
            category_id: categoryId,
            page: randomPage
          }
        }
      );

      if (!responseSelectedProductVariant.ok) {
        throw new Error(
          `HTTP error! Status: ${responseSelectedProductVariant.status}`
        );
      }

      const bodySelectedProductVariant =
        await responseSelectedProductVariant.json();
      return bodySelectedProductVariant.data.data;
    } catch (error) {
      console.error('Error fetching product variant:', error);
      return null;
    }
  }

  async findBrandSize(request, accessTokenAdmin, categoryId, brandId, sex) {
    try {
      let url;
      let query = {
        no_limit: true,
        brand_id: brandId,
        sex: sex,
        category_id: categoryId
      };

      if (categoryId === 1) {
        url = 'admins/sizes?';
        delete query.category_id;
      } else if (categoryId === 2) {
        url = 'admins/brand_sizes?';
        query.category_id = categoryId;
      } else {
        url = 'admins/brand_sizes?';
        delete query.category_id;
      }

      const response = await request.get(`${this.lumenURL}/${url}`, {
        headers: {
          Authorization: `Bearer ${accessTokenAdmin}`
        },
        params: query
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const body = await response.json();
      return body.data;
    } catch (error) {
      console.error('Error find brand size:', error);
      return null;
    }
  }

  async functionFindAvailableSize(request, brands) {
    try {
      const responseFindBrandSize = this.findBrandSizefindBrandSize(
        request,
        accessTokenAdmin,
        brands[number].category_id,
        brands[number].id,
        sex
      );
      const lengthOfBrandSize = responseFindBrandSize.length;
      if (lengthOfBrandSize === 0) {
        if (number === brands.length - 1) {
          sizes.push([]);
        } else {
          number++;
          await this.functionFindAvailableSize(request, brands);
        }
      } else {
        sizes = lengthOfBrandSize;
        return sizes;
      }
    } catch (error) {
      console.error('Error find available size:', error);
      return null;
    }
  }

  async submitSizeProduct(request, accessTokenAdmin, id, idAvailableSize) {
    try {
      const response = await request.post(
        `${this.lumenURL}/admins/productvariants/sizes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          data: {
            size_id: idAvailableSize
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const body = await response.json();
      return body.data.sizes;
    } catch (error) {
      console.error('Error submit size product:', error);
      return null;
    }
  }

  async addSizeOnProduct(request, accessTokenAdmin, category, selectedProduct) {
    try {
      let categoryId;
      let sizes = [];
      let idAvailableSize = [];
      let sex;
      let number = 0;

      const responseProductDetail = await this.productList.productDetail(
        request,
        accessTokenAdmin,
        category
      );
      categoryId = responseProductDetail.id;
      const responseBrandlist = await this.brandList.brandList(
        request,
        accessTokenAdmin,
        categoryId
      );
      const brands = responseBrandlist;

      switch (selectedProduct.sex) {
        case 'P':
          sex = 'F';
          break;
        case 'M':
          sex = 'M';
          break;
        default:
          sex = 'M';
          break;
      }

      const findAvailableSize = async (request, brands) => {
        try {
          const responseFindBrandSize = await this.findBrandSize(
            request,
            accessTokenAdmin,
            brands[number].category_id,
            brands[number].id,
            sex
          );
          const lengthOfBrandSize = responseFindBrandSize.length;
          if (lengthOfBrandSize === 0) {
            if (number === brands.length - 1) {
              sizes.push([]);
            } else {
              number++;
              await findAvailableSize(request, brands);
            }
          } else {
            sizes = responseFindBrandSize;
            return sizes;
          }
        } catch (error) {
          console.error('Error finding available size:', error);
          return null;
        }
      };

      await findAvailableSize(request, brands);

      if (categoryId !== 1) {
        sizes
          .sort((a, b) => a.size.id - b.size.id)
          .forEach((el, i) => {
            if (i === 0) {
              idAvailableSize.push({
                id: el.size.id,
                size_type: el.alias,
                size_order: el.order
              });
            } else {
              if (
                idAvailableSize[idAvailableSize.length - 1].id !== el.size.id
              ) {
                idAvailableSize.push({
                  id: el.size.id,
                  size_type: el.alias,
                  size_order: el.order
                });
              } else {
                if (
                  idAvailableSize[idAvailableSize.length - 1].order >
                  el.size_order
                ) {
                  idAvailableSize.pop();
                  idAvailableSize.push({
                    id: el.size.id,
                    size_type: el.alias,
                    size_order: el.order
                  });
                }
              }
            }
          });
      } else {
        sizes.forEach((e) => idAvailableSize.push(e.id));
      }

      return await this.submitSizeProduct(
        request,
        accessTokenAdmin,
        selectedProduct.id,
        idAvailableSize
      );
    } catch (error) {
      console.error('Error browse size product:', error);
      return null;
    }
  }

  async setProductVariantToBeActive(
    request,
    accessTokenAdmin,
    selectedProduct
  ) {
    try {
      selectedProduct.active = true;
      const id = selectedProduct.id;
      const response = await request.put(
        `${this.lumenURL}/admins/productvariants/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          data: selectedProduct
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const body = await response.json();
      return body.data;
    } catch (error) {
      console.error('Error set product variant to be active:', error);
      return null;
    }
  }
};
