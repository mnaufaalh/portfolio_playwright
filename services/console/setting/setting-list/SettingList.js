exports.SettingList = class SettingList {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  }

  async settingProcessingFee(request, accessTokenAdmin) {
    try {
      const response = await request.get(
        `${this.lumenURL}/admins/settings/85`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const body = await response.json();
      return JSON.parse(body.data.value);
    } catch (error) {
      console.error('Error setting processing fee:', error);
      return null;
    }
  }

  async settingMultipliers(request, accessTokenAdmin) {
    try {
      const response = await request.get(
        `${this.lumenURL}/admins/settings/69`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const body = await response.json();
      return JSON.parse(body.data.value).priceMultipliers.IDR;
    } catch (error) {
      console.error('Error setting multipliers:', error);
      return null;
    }
  }

  async paymentList(request, accessTokenAdmin) {
    try {
      const response = await request.get(`${this.lumenURL}/admins/settings`, {
        headers: {
          Authorization: `Bearer ${accessTokenAdmin}`
        },
        params: {
          name: 'payment_methods'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      const data = JSON.parse(bodyResponse.data.data[0].value);
      let paymentList = [];
      data.forEach((e) => {
        paymentList.push({ payment_method: e.value });
      });
      return paymentList;
    } catch (error) {
      console.error('Error fetch payment list in setting:', error);
      return null;
    }
  }

  async kickPointPromo(request, accessTokenAdmin) {
    try {
      const response = await request.get(
        `${this.lumenURL}/admins/settings/84`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      const data = JSON.parse(bodyResponse.data.value);
      return data;
    } catch (error) {
      console.error('Error fetch kick point promo in setting:', error);
      return null;
    }
  }
};
