const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../../pages/home-page/index.js');
const { LoginPage } = require('../../../pages/login-page/index.js');
const { automationUserBuyerKickCredit, adminDapur } = require('../../../fixtures/json/user.json');
const { Login } = require('../../../services/console/login.js');
const { User } = require('../../../services/console/sales/users/user_list/user.js');

test.describe('Login', () => {
  let homepage;
  let loginpage;
  let loginConsole;
  let user;
  const stagingURL = process.env.STAGING_URL;

  test.beforeEach(async ({ page, request }) => {
    homepage = new HomePage(page);
    loginpage = new LoginPage(page);
    loginConsole = new Login(page);
    user = new User(page);
    await page.goto(stagingURL);
    await homepage.isBanner(request);
    await homepage.loginButton.click();
    await loginpage.emailAddressField.fill(automationUserBuyerKickCredit.emailAddress);
  });

  test('Should be to reset the password if failed to login in 5 times in a row', async ({ request }) => {
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
    const responseUserLogin = await loginConsole.userLogin(request, adminDapur.emailAddress, adminDapur.password);
    const accessTokenAdmin = responseUserLogin;
    const responseFindUser = await user.findUser(request, accessTokenAdmin, automationUserBuyerKickCredit.emailAddress);
    const userDetail = responseFindUser.find(e => e.typed_email === automationUserBuyerKickCredit.emailAddress);
    await user.updateUserDetail(request, accessTokenAdmin, userDetail);
    await loginConsole.userLogin(request, automationUserBuyerKickCredit.emailAddress, automationUserBuyerKickCredit.password);
  });

  test('Should unable to login with invalid credential', async () => {
    await loginpage.passwordField.fill('salah password');
    await loginpage.loginButton.click();
    await expect(loginpage.modalFailedLogin).toBeVisible();
  });

  test('Should able to login with valid credential', async () => {
    await loginpage.passwordField.fill(automationUserBuyerKickCredit.password);
    await loginpage.loginButton.click();
    await expect(homepage.userNameInHomepage).toBeVisible();
    const emailText = await homepage.userNameInHomepage.innerText();
    await expect(emailText).toEqual(automationUserBuyerKickCredit.emailAddress);
  });

});