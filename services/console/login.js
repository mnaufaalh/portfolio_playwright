exports.Login = class Login {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  }

  async userLogin(request, email, password) {
    try {
      const response = await request.post(`${this.lumenURL}/auth`, {
        data: {
          email: email,
          password: password
        }
      });
      const body = await response.json();
      return body.data.token;
    } catch (error) {
      console.error('Error login:', error);
      return null;
      ;
    }
  };
};