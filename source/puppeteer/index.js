import puppeteer from 'puppeteer';
import { setTimeout } from "node:timers/promises";

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: false, defaultViewport: false });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto('https://outlook.com/');

    // Click "Login"
    await page.waitForSelector('#action-oc5b26');
    await page.evaluate(() => document.querySelector('#action-oc5b26').click())

    // Get new page object
    const getNewPageWhenLoaded = async () => {
        return new Promise(x =>
            browser.on('targetcreated', async target => {
                if (target.type() === 'page') {
                    const newPage = await target.page();
                    const newPagePromise = new Promise(y =>
                        newPage.once('domcontentloaded', () => y(newPage))
                    );
                    const isPageLoaded = await newPage.evaluate(
                        () => document.readyState
                    );
                    return isPageLoaded.match('complete|interactive')
                        ? x(newPage)
                        : x(newPagePromise);
                }
            })
        );
    };

    const newPagePromise = getNewPageWhenLoaded();
    const newPage = await newPagePromise;

    // Declare and initialize login credentials
    const accountAddress = 'Mateszonline2002@gmail.com';
    const accountPassword = 'Matesz20020215';

    // Wait for input field to load and fill
    await newPage.waitForSelector('#i0116');
    await newPage.type('#i0116', accountAddress, { delay: 100 });

    // Click Submit button
    await newPage.click('#idSIButton9');

    // Wait for input field to load and fill
    await newPage.waitForSelector('#i0118');
    await newPage.type('#i0118', accountPassword, { delay: 100 });

    // Click Submit button
    await Promise.all([
        newPage.waitForNavigation(),
        newPage.click('#idSIButton9')
    ]);

    // Click "No" on "remain logged in?"
    await newPage.waitForSelector('#declineButton');
    await newPage.click('#declineButton');

    // Click on "New message" button
    await newPage.waitForSelector('.splitPrimaryButton');
    await newPage.click('.splitPrimaryButton'); 

    // Wait for the input fields to be available and insert data
    await newPage.waitForSelector('.___1mtnehv');
    await newPage.evaluate(() => {
        const addressElement = document.querySelector('.___1mtnehv');
        if (addressElement) {
            addressElement.textContent = 'Mateszonline2002@gmail.com';
        }
    });
    await newPage.type('#TextField255', 'random', { delay: 100 });

    // Hit send
    await newPage.waitForSelector('.aFWR_');
    await newPage.click('.aFWR_');

    // Navigate to sent mails and wait for mail to appear
    await newPage.waitForSelector('#folderPaneDroppableContainer > div > div:nth-child(4) > div > div > div:nth-child(4) > div');
    await newPage.click('#folderPaneDroppableContainer > div > div:nth-child(4) > div > div > div:nth-child(4) > div');
    await setTimeout(5000);

    // Delete items from directory
    await newPage.waitForSelector('.splitPrimaryButton');
    const toolsButtons = await newPage.$$('.splitPrimaryButton');
    await newPage.evaluate((element) => {
        element.click()
    }, toolsButtons[1]) 

    // Click confirm and wait for browser to clear directory
    await newPage.waitForSelector('.jya0z');
    await newPage.click('.jya0z');
    await setTimeout(3000);

    // Close browser
    await browser.close();

})();
