import { setDefaultTimeout } from '@cucumber/cucumber';
setDefaultTimeout(30000); 

import puppeteer from 'puppeteer';
import { setTimeout } from "node:timers/promises";
import { Given, When, Then} from '@cucumber/cucumber';

let browser, page, newPage;

Given('I navigate to {string}', async (url) => {
    browser = await puppeteer.launch({ headless: false, defaultViewport: false });
    page = await browser.newPage();
    await page.goto(url);
});

When('I click the login button', async () => {
    await page.waitForSelector('#action-oc5b26');
    await page.evaluate(() => document.querySelector('#action-oc5b26').click());

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
    newPage = await newPagePromise;
});

When('I log in with email {string} and password {string}', async (email, password) => {
    await newPage.waitForSelector('#i0116');
    await newPage.type('#i0116', email, { delay: 100 });
    await newPage.click('#idSIButton9');

    await newPage.waitForSelector('#i0118');
    await newPage.type('#i0118', password, { delay: 100 });

    await Promise.all([
        newPage.waitForNavigation(),
        newPage.click('#idSIButton9')
    ]);
});

Then('I decline to stay logged in', async () => {
    await newPage.waitForSelector('#declineButton');
    await newPage.click('#declineButton');
});

When('I click the New message button', async () => {
    await newPage.waitForSelector('.splitPrimaryButton');
    await newPage.click('.splitPrimaryButton');
});

When('I send an email to {string} with subject {string}', async (recipient, subject) => {
    await newPage.waitForSelector('.___1mtnehv');
    await newPage.evaluate((recipient) => {
        const addressElement = document.querySelector('.___1mtnehv');
        if (addressElement) {
            addressElement.textContent = recipient;
        }
    }, recipient);
    await newPage.type('.ADopl', subject, { delay: 100 });

    await newPage.waitForSelector('.aFWR_');
    await newPage.click('.aFWR_');
});

When('I navigate to sent mails', async () => {
    await newPage.waitForSelector('#folderPaneDroppableContainer > div > div:nth-child(4) > div > div > div:nth-child(4) > div');
    await newPage.click('#folderPaneDroppableContainer > div > div:nth-child(4) > div > div > div:nth-child(4) > div');
    await setTimeout(5000);
});

When('I delete the sent email', async () => {
    await newPage.waitForSelector('.splitPrimaryButton');
    const toolsButtons = await newPage.$$('.splitPrimaryButton');
    await newPage.evaluate((element) => {
        element.click();
    }, toolsButtons[1]);

    await newPage.waitForSelector('.jya0z');
    await newPage.click('.jya0z');
    await setTimeout(3000);
});

Then('I close the browser', async () => {
    await browser.close();
});
