exports.User = class User {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  }

  async findUser(request, accessTokenAdmin, email) {
    try {
      console.log(this.lumenURL, accessTokenAdmin, email, `.........88888888`)
      const response = await request.get(`${this.lumenURL}/admins/users`, {
        params: {
          'keyword': email
        },
        headers: {
          Authorization: `Bearer ${accessTokenAdmin}`
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      };
      const body = await response.json();
      console.log(body)
      return body.data.data;
    } catch (error) {
      console.error('Error find user:', error);
      return null;
      ;
    }
  };

  async updateUserDetail(request, accessTokenAdmin, userDetail) {
    try {
      const response = await request.put(`${this.lumenURL}/admins/users/${userDetail.id}`, {
        headers: {
          Authorization: `Bearer ${accessTokenAdmin}`
        },
        data: {
          username: userDetail.username,
          typed_email: userDetail.typed_email,
          first_name: userDetail.first_name,
          family_name: userDetail.family_name,
          seller_points: userDetail.seller_points,
          roles: [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 5 }, { "id": 14 }, { "id": 16 }, { "id": 18 }, { "id": 21 }]
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      };
      const body = await response.json()
    } catch (error) {
      console.error('Error update user detail:', error);
      return null;
    }
  }
};