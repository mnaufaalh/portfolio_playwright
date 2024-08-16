exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailAddressField = page.locator('input[type="email"]');
    this.passwordField = page.locator('input[type="password"]');
    this.loginButton = page.locator('input[type="submit"]');
    this.modalFailedLogin = page.locator('[id="failed-login-attempt"]')
    this.buttonResetPassword = page.locator('button:has-text("Reset Password")');
    this.buttonOkOnInvalidCredentialModal = page.locator('button:has-text("OK")');
  }
};