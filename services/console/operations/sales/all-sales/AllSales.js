exports.AllSales = class AllSales {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  }

  async allSalesList(request, accessTokenAdmin) {
    try {
      const response = await request.get(`${this.lumenURL}/admins/sales`, {
        headers: {
          Authorization: `Bearer ${accessTokenAdmin}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data.data;
    } catch (error) {
      console.error('Error fetching all sales list:', error);
      return false;
    }
  }

  async searchSale(request, accessTokenAdmin, invoiceNumber) {
    try {
      const response = await request.get(`${this.lumenURL}/admins/sales`, {
        headers: {
          Authorization: `Bearer ${accessTokenAdmin}`
        },
        params: {
          keyword: invoiceNumber
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      const data = bodyResponse.data.data.find(
        (e) => e.invoice_number === invoiceNumber
      );
      return data;
    } catch (error) {
      console.error('Error fetching selected sale:', error);
      return false;
    }
  }
};
