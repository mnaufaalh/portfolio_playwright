exports.Auth = class Auth {
  constructor(page) {
    this.page = page;
    this.apiRevamp = process.env.API_REVAMP_URL;
  }

  async login(request, user) {
    try {
      const body = {
        email: user.email,
        password: user.password
      };
      const response = await request.post(
        `${this.apiRevamp}/api/v1/auth/login`,
        {
          data: body
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.Data.access_token;
    } catch (error) {
      console.error('Error login :', error);
      return null;
    }
  }
};
