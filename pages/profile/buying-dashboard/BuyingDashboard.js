exports.BuyingDashboard = class BuyingDashboard {
  constructor(page) {
    this.page = page;
    this.getTable = page.locator('.item-table').first();
    this.getInProgressTabButton = page.getByText('In Progress');
    this.getHistoryTabButton = page.getByText('History', { exact: true });
    this.getSearchBarInProgress = page.locator(
      'input[placeholder="Search your buying in progress here"]'
    );
    this.getSearchBarHistory = page.locator(
      'input[placeholder="Search your buying history here"]'
    );
    this.getSearchBarOffer = page.locator(
      'input[placeholder="Search your buying offer here"]'
    );
    this.getPendingTabButton = page.getByText('Pending', { exact: true });
    this.getSearchBarInPending = page.locator(
      'input[placeholder="Search your buying pending here"]'
    );
    this.getCompletePaymentButton = page.getByText('Complete Payment');
    this.statusOrder = page.locator('.status-text');
    this.trackYourPackageButton = page.getByText('Track your package');
    this.IHaveReceivedMyPackageButton = page.locator('button', {
      hasText: 'I have received my package'
    });
  }
};
