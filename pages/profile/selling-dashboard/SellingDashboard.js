exports.SellingDashBoard = class SellingDashBoard {
  constructor(page) {
    this.page = page;
    this.sellAProductButton = page.locator('.sell-request');
    this.getSortByButton = page.locator('.sort-parent');
    this.getOptionSortByButton = page.locator('.sort-item', {
      hasText: 'Latest'
    });
    this.getTable = page.locator('.item-table').first();
    this.getTitle = page.locator('.product-container.selling .title').first();
    this.getStatusItem = this.getTable.locator(
      '.Current_flex-row__18yAn .normal'
    );
    this.getPriceItem = this.getTable.locator('.price-container .red');

    // this.getInProgressTabButton = page.getByText('In Progress');
    // this.getHistoryTabButton = page.getByText('History', { exact: true });
    // this.getSearchBarInProgress = page.locator(
    //   'input[placeholder="Search your buying in progress here"]'
    // );
    // this.getSearchBarHistory = page.locator(
    //   'input[placeholder="Search your buying history here"]'
    // );
    // this.getSearchBarOffer = page.locator(
    //   'input[placeholder="Search your buying offer here"]'
    // );
    // this.getPendingTabButton = page.getByText('Pending', { exact: true });
    // this.getSearchBarInPending = page.locator(
    //   'input[placeholder="Search your buying pending here"]'
    // );
    // this.getCompletePaymentButton = page.getByText('Complete Payment');
    // this.statusOrder = page.locator('.status-text');
    // this.trackYourPackageButton = page.getByText('Track your package');
    // this.IHaveReceivedMyPackageButton = page.locator('button', {
    //   hasText: 'I have received my package'
    // });
  }

  async getTitle(name) {
    return this.page.locator('.title', { hasText: name }).textContent();
  }
};
