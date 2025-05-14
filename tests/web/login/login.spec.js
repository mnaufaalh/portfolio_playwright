const { test, expect } = require('@playwright/test');
const { HomePage } = require('@pages/home-page/HomePage');
const { LoginPage } = require('@pages/login-page/LoginPage');
const {
  automationUserBuyerKickCredit,
  adminDapur
} = require('@fixtures/json/user.json');
const { LoginService } = require('@services/console/LoginService.js');
const { User } = require('@services/console/sales/users/user-list/User');

test.describe('Login', () => {
  let accessTokenAdmin;
  const stagingURL = process.env.STAGING_URL;

  test.beforeAll(async ({ playwright }) => {
    const loginService = new LoginService();
    const requestContext = await playwright.request.newContext();
    accessTokenAdmin = await loginService.userLogin(
      requestContext,
      adminDapur.emailAddress,
      adminDapur.password
    );
  });

  test.beforeEach(async ({ page, request }) => {
    const homepage = new HomePage(page, request);
    const loginpage = new LoginPage(page);
    await page.goto(stagingURL);
    await homepage.isBanner(request, accessTokenAdmin);
    await homepage.loginButton.click();
    await loginpage.emailAddressField.fill(
      automationUserBuyerKickCredit.emailAddress
    );
  });

  test('Should be to reset the password if failed to login in 5 times in a row', async ({
    request,
    page
  }) => {
    const loginpage = new LoginPage(page);
    const loginService = new LoginService();
    const user = new User(page);
    await loginpage.passwordField.fill('salah password');
    const attemptFailedLogin = 5;
    for (let i = 0; i < attemptFailedLogin; i++) {
      await loginpage.loginButton.click();
      if (i === attemptFailedLogin - 1) {
        await expect(loginpage.buttonResetPassword).toBeVisible();
      } else {
        await loginpage.buttonOkOnInvalidCredentialModal.click();
      }
    }
    const responseUserLogin = await loginService.userLogin(
      request,
      adminDapur.emailAddress,
      adminDapur.password
    );
    const accessTokenAdmin = responseUserLogin;
    const responseFindUser = await user.findUser(
      request,
      accessTokenAdmin,
      automationUserBuyerKickCredit.emailAddress
    );
    const userDetail = responseFindUser.find(
      (e) => e.typed_email === automationUserBuyerKickCredit.emailAddress
    );
    await user.updateUserDetail(request, accessTokenAdmin, userDetail);
    await loginService.userLogin(
      request,
      automationUserBuyerKickCredit.emailAddress,
      automationUserBuyerKickCredit.password
    );
  });

  test('Should unable to login with invalid credential', async ({ page }) => {
    const loginpage = new LoginPage(page);
    await loginpage.passwordField.fill('salah password');
    await loginpage.loginButton.click();
    await expect(loginpage.modalFailedLogin).toBeVisible();
  });

  test('Should able to login with valid credential', async ({
    page,
    request
  }) => {
    const loginpage = new LoginPage(page);
    const homepage = new HomePage(page, request);
    await loginpage.passwordField.fill(automationUserBuyerKickCredit.password);
    await loginpage.loginButton.click();
    await expect(homepage.userNameInHomepage).toBeVisible();
    const emailText = await homepage.userNameInHomepage.innerText();
    expect(emailText).toEqual(automationUserBuyerKickCredit.emailAddress);
  });
});
