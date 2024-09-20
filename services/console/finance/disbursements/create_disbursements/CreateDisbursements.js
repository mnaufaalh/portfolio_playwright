exports.CreateDisbursements = class CreateDisbursements {
  constructor(page) {
    this.page = page;
    this.lumenURL = process.env.LUMEN_URL;
  }
  async createDisbursement(request, params) {
    try {
      const {
        accessTokenAdmin,
        userDetailBuyer,
        balance_source,
        payoutType,
        disbursementType,
        amount = 1000000000
      } = params;
      const userId = userDetailBuyer.id;
      const response = await request.post(
        `${this.lumenURL}/admins/disbursements`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenAdmin}`
          },
          data: {
            disburse_to: userId,
            balance_source: balance_source,
            payout_type: payoutType,
            disbursement_type: disbursementType,
            total_amount: amount,
            validate_bank_account: true,
            fee: 0,
            note: '',
            status: 'COMPLETED'
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const bodyResponse = await response.json();
      return bodyResponse.data;
    } catch (error) {
      console.error('Error create disbursement:', error);
      return null;
    }
  }
};
