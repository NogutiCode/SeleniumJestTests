const Page = require('./basePage');
const {By} = require('selenium-webdriver')

const baseUrl = 'https://www.bookdepository.com/'

let searchCountNum;
let searchCountNum2;

//locators
const cookiesConsentBtn = By.css('div.cookie-consent > div.cookie-consent-buttons > button.btn.btn-sm.btn-yes');
const brandLinkHeader = By.xpath('//h1/a[@class="brand-link"]/img');

const searchField = By.css('#book-search-form > div > input[name="searchTerm"]');
const searchBtn = By.className('header-search-btn');
const searchResultHeader = By.css('div.main-content.search-page > h1');
const searchResultCount = By.className('search-count');
const searchResultItemTitle = By.css('div.item-info > h3.title');
const searchResultItemFormat = By.css('div.item-info > p.format');
const searchResultsItemPrice = By.css('span.sale-price');

const sortOptions = By.xpath('//select[@name="searchSortBy"]/option');
const sortByPriceBtn = By.xpath('//select[@name="searchSortBy"]/option[@value="price_high_low"]');

const filterOptions = By.css('form.filter-menu > div > label');
const filterResultsBtn = By.xpath('//button[contains(text(),"Refine results")]');

const firstBook = By.css('div:nth-child(1) > div.item-actions > div > a');
const checkIfAdded = By.css('div.modal.fade.status-success.in > div > div > div.modal-header > h3');
const leaveShopping = By.css(' div.basket-info > a.btn.btn-secondary.pull-left.continue-shopping.string-to-localize');
const secondBook = By.css('div:nth-child(2) > div.item-actions > div > a');
const goBasket = By.css('div.basket-info > a.btn.btn-primary.pull-right.continue-to-basket.string-to-localize.link-to-localize');
const basketText = By.css('div.page-slide > div.content-wrap > div.basket-page > h1');

const basketElements = By.css('div.page-slide > div.content-wrap > div.basket-page > div.grid-container > div.checkout-head-wrap > div.basket-msg');

const audioBooks = By.css("body > div.page-slide > div.secondary-header-wrap > div > ul > li.tbd-dropdown.category-dropdown.mob-nav-shop.dropdown > ul > li.row > ul:nth-child(2) > ul > li:nth-child(1) > a");
const resultTitle = By.css("body > div.page-slide > div.content-wrap > div.main-content.featured-category.category-page > div:nth-child(2) > h1")
const foodDrink = By.css("body > div.page-slide > div.content-wrap > div.sidebar > div.sidebar-section > div > ul > li:nth-child(15) > a")
const bevarages = By.css("body > div.page-slide > div.content-wrap > div.sidebar > div:nth-child(1) > div > ul > li:nth-child(5) > a")
const BevaragesTitle = By.css("body > div.page-slide > div.content-wrap > div.main-content.category-page > div.block-wrap > h1")
//const links = By.className("parent-item");

const links = By.xpath('//li[@class="parent-item"]'); 
const checkForDropdown = By.css("body > div.page-slide > div.secondary-header-wrap > div > ul > li.tbd-dropdown.category-dropdown.mob-nav-shop.dropdown.open");

module.exports = class HomePage extends Page {
    constructor(driver) {
        super(driver);
    }

    async openUrl() {
        await super.openUrl(baseUrl);
    }

    async agreeWithCookies() {
        await super.waitForElementVisible(cookiesConsentBtn);
        await super.clickButton(cookiesConsentBtn);
    }

    async verifyPageTitleContains(pageTitle) {
        const pageTitleElement = await super.getElementAttribute(brandLinkHeader, 'alt');
        expect(pageTitleElement).toContain(pageTitle)
    }

    async searchForText(text) {
        await super.sendText(searchField, text);        
        await super.clickButton(searchBtn);
    }

    async verifySearchResultText(text) {
        const searchResultTitle = await super.getElementText(searchResultHeader);
        expect(searchResultTitle).toContain('Search results for ' + text)
    }

    async verifyAllSearchItemsContainText(text) {
        let itemFormats = await super.getElements(searchResultItemTitle);

        for(let item of itemFormats) {
            expect(await item.getText()).toContain(text);
        }
    }

    async verifySearchResultContainsMoreItemsThan(number) {
        const searchCount = await super.getElementText(searchResultCount)
        searchCountNum = parseInt(searchCount.replace(',', ''))
        expect(searchCountNum).toBeGreaterThan(number)
    }

    async verifyProductSortOptions() {
        let sortByOptions = await super.getElements(sortOptions);
        expect(sortByOptions).toHaveLength(5)
    }

    async sortResultsByPrice() {
        await super.clickButton(sortByPriceBtn);
    }

    async verifyResultsAreSorted() {
        let searchItems = await super.getElements(searchResultsItemPrice);
        
        //Verify that the products are sorted correctly.
        let price1 = parseFloat((await searchItems[0].getText()).replace(/[^\d,.]/, '').replace(',', '.'))
        let price2 = parseFloat((await searchItems[1].getText()).replace(/[^\d,.]/, '').replace(',', '.'))

        expect(price1).toBeGreaterThanOrEqual(price2)
    }

    async verifyProductFilters() {
        let filterByOptions = await super.getElements(filterOptions)
        expect(filterByOptions).toHaveLength(6)
    }

    async filterResultsByText(text) {
        await super.clickButton(By.xpath('//*[@id="filterFormat"]/option[contains(text(),"' + text + '")]'));
        await super.clickButton(filterResultsBtn);
    }

    async verifyResultsFilter(text) {  
        let itemFormats = await super.getElements(searchResultItemFormat)

        for(let item of itemFormats) {
            expect(await item.getText()).toContain(text)
        }
    }

    async verifyResultsAreFiltered() {
        const searchCountFiltered = await super.getElementText(searchResultCount)
        const searchCountFilteredNum = parseInt(searchCountFiltered.replace(',', ''))
        expect(searchCountFilteredNum).toBeLessThan(searchCountNum)
    }
    async addFirstBook() {
        await super.clickButton(firstBook)
        
    }
    async getAddedText(text) {
        await super.waitForElementVisible(checkIfAdded)
        const getText = await super.getElementText(checkIfAdded)
        console.log(getText)
        expect(getText).toContain(text)  
    }
    async leaveToSearch() {
        await super.clickButton(leaveShopping)
    }
    async addSecondBook(){ 
        await super.clickButton(secondBook)
    }
    async clickToBasket(){
        await super.clickButton(goBasket)
    }
    async getBasketText(text) {
        await super.waitForElementVisible(basketText)
        const getTextOfBasket = await super.getElementText(basketText)
        expect(getTextOfBasket).toContain(text)  
    }
    async getBusketElements(text){
        await super.waitForElementVisible(basketElements)
        const busketElem = await super.getElementText(basketElements)
        console.log(busketElem)
        expect(busketElem).toContain(text)  
    }
    async deleteBusketElem(text){
        await super.clickButton(By.css('body > div.page-slide > div.content-wrap > div.basket-page > div.grid-container > div.basket-items-wrap > div:nth-child('+text+') > div.item-checkout-info > form.remove-item > button'))
    }
    async openUrl() {
        await super.openUrl(baseUrl);
    }

    async agreeWithCookies() {
        await super.waitForElementVisible(cookiesConsentBtn);
        await super.clickButton(cookiesConsentBtn);
    }

    async verifyPageTitleContains(pageTitle) {
        const pageTitleElement = await super.getElementAttribute(brandLinkHeader, 'alt');
        expect(pageTitleElement).toContain(pageTitle)
    }

    async verifySearchResultContainsMoreItemsThan(number) {
        const searchCount = await super.getElementText(searchResultCount)
        searchCountNum = parseInt(searchCount.replace(',', ''))
        expect(searchCountNum).toBeGreaterThan(number)
    }

    async dropdown(){
        const actions = driver.actions({bridge: true}); 
        console.log(actions)
        await this.driver.actions().move({duration:5000,origin:dropdownMenu,x:0,y:0}).perform();

    }

    async verifyThatDropdownIsOpened() {
        expect(checkForDropdown).not.toBeNull()
    }

    async clickOnAudioBooks() {
        await super.clickButton(audioBooks);
    }

    async verifyResultTitleContainsAudioBooks() {
        const searchResultTitle = await super.getElementText(resultTitle);
        expect(searchResultTitle).toContain('Featured Audio Books')

    }
    async clickOnFoodDrink() {
        await super.clickButton(foodDrink);
    }

    async verifySearchResultContainsMoreItemsThan(number) {
        searchCountNum = await super.getElementText(searchResultCount)
        searchCountNum = parseInt(searchCountNum.replace(',', ''))
        expect(searchCountNum).toBeGreaterThan(number)
    }


    async clickOnBevarages() {
        await super.clickButton(bevarages);
    }
    async verifyResultTitleContainsBevarages() {
        const searchResultTitle = await super.getElementText(BevaragesTitle);
        expect(searchResultTitle).toContain('All Beverages Audio Books')
    }
    async verifySearchResultContainsMoreItemsThanOther() {
        const searchCount2 = await super.getElementText(searchResultCount)
        searchCountNum2 = parseInt(searchCount2.replace(',', ''))
        expect(searchCountNum).toBeGreaterThan(searchCountNum2)
    }
    async veirfyThatPaginationIsCorrect() {
        let count = 0
        let paginator = await super.getElements(links);
        for (let item of paginator) {
            count++
        }
        expect(count).toEqual(3);
    }

}