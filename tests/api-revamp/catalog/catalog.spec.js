const { test, expect } = require('@playwright/test');
const { userApiRevamp } = require('@fixtures/json/user.json');
const { Auth } = require('@services/api-revamp/auth/auth');
const { Brand } = require('@services/api-revamp/catalog/brand/Brand');
const { Category } = require('@services/api-revamp/catalog/category/Category');

test.describe('Catalog', () => {
  let accessTokenUser;

  test.beforeAll(async ({ playwright }) => {
    const authService = new Auth();
    const requestContext = await playwright.request.newContext();
    accessTokenUser = await authService.login(requestContext, userApiRevamp);
  });

  test('Brand ', async ({ request }) => {
    const brand = new Brand();
    const responseCreateBrand = await brand.createBrand(
      request,
      accessTokenUser
    );
    expect(responseCreateBrand.Status).toBe('success');
    expect(responseCreateBrand.Code).toBe(0);

    const responseUpdateBrand = await brand.updateBrand(
      request,
      accessTokenUser,
      responseCreateBrand.Data.id
    );
    expect(responseUpdateBrand.Status).toBe('success');
    expect(responseUpdateBrand.Code).toBe(0);

    const responseGetBrandById = await brand.getBrandById(
      request,
      accessTokenUser,
      responseCreateBrand.Data.id
    );
    expect(responseGetBrandById.Status).toBe('success');
    expect(responseGetBrandById.Code).toBe(0);
    expect(responseGetBrandById.Data.name).toBe(responseUpdateBrand.Data.name);
    expect(responseGetBrandById.Data.background_image).toBe(
      responseUpdateBrand.Data.background_image
    );
    expect(responseGetBrandById.Data.logo_image).toBe(
      responseUpdateBrand.Data.logo_image
    );
    expect(responseGetBrandById.Data.description).toBe(
      responseUpdateBrand.Data.description
    );
    expect(responseGetBrandById.Data.is_active).toBe(
      responseUpdateBrand.Data.is_active
    );

    const responseGetAllBrand = await brand.getAllBrand(
      request,
      accessTokenUser
    );
    expect(responseGetAllBrand.Status).toBe('success');
    expect(responseGetAllBrand.Code).toBe(0);

    const responseDeleteBrand = await brand.deleteBrand(
      request,
      accessTokenUser,
      responseCreateBrand.Data.id
    );

    expect(responseDeleteBrand).toBe(null);
  });

  test('Category ', async ({ request }) => {
    const category = new Category();
    const responseCreateCategory = await category.createCategory(
      request,
      accessTokenUser
    );
    expect(responseCreateCategory.Status).toBe('success');
    expect(responseCreateCategory.Code).toBe(0);

    const responseUpdateCategory = await category.updateCategory(
      request,
      accessTokenUser,
      responseCreateCategory.Data.id
    );
    expect(responseUpdateCategory.Status).toBe('success');
    expect(responseUpdateCategory.Code).toBe(0);

    const responseGetCategoryById = await category.getCategoryById(
      request,
      accessTokenUser,
      responseCreateCategory.Data.id
    );
    expect(responseGetCategoryById.Status).toBe('success');
    expect(responseGetCategoryById.Code).toBe(0);
    expect(responseGetCategoryById.Data.name).toBe(
      responseUpdateCategory.Data.name
    );
    expect(responseGetCategoryById.Data.sequence).toBe(
      responseUpdateCategory.Data.sequence
    );
    expect(responseGetCategoryById.Data.is_active).toBe(
      responseUpdateCategory.Data.is_active
    );

    const responseDeleteCategory = await category.getAllCategory(
      request,
      accessTokenUser,
      responseCreateCategory.Data.id
    );
    expect(responseDeleteCategory).toBe(null);
  });

  test('Sub Category ', async ({ request }) => {
    const category = new Category();
    const responseCreateCategory = await category.createCategory(
      request,
      accessTokenUser
    );
    expect(responseCreateCategory.Status).toBe('success');
    expect(responseCreateCategory.Code).toBe(0);

    const responseUpdateCategory = await category.updateCategory(
      request,
      accessTokenUser,
      responseCreateCategory.Data.id
    );
    expect(responseUpdateCategory.Status).toBe('success');
    expect(responseUpdateCategory.Code).toBe(0);

    const responseGetCategoryById = await category.getCategoryById(
      request,
      accessTokenUser,
      responseCreateCategory.Data.id
    );
    expect(responseGetCategoryById.Status).toBe('success');
    expect(responseGetCategoryById.Code).toBe(0);
    expect(responseGetCategoryById.Data.name).toBe(
      responseUpdateCategory.Data.name
    );
    expect(responseGetCategoryById.Data.sequence).toBe(
      responseUpdateCategory.Data.sequence
    );
    expect(responseGetCategoryById.Data.is_active).toBe(
      responseUpdateCategory.Data.is_active
    );

    const responseDeleteCategory = await category.getAllCategory(
      request,
      accessTokenUser,
      responseCreateCategory.Data.id
    );
    expect(responseDeleteCategory).toBe(null);
  });
});
