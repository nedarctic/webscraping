import puppeteer from 'puppeteer';
import * as diff from 'diff';

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();
const url = 'https://22bet.co.ke/othergames?product=849&game=68089';

await page.goto(url);

await page.waitForSelector('iframe');
const iframeSelector = await page.$('iframe');
const iframe = await iframeSelector.contentFrame();

// Title
const iframeTitle = await iframe.title();
console.log('iframe title:', iframeTitle);

// iframe URL
const iframeURL = await iframe.evaluate(() => window.location.href);
// console.log('iframe URL:', iframeURL);

// iframe Content
const iframeContent = await iframe.content();
// console.log('iframe content:', iframeContent);

// iframe images
await iframe.waitForSelector('img');
const iframeImages = await iframe.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt
    }));
});
// console.log('iframe images:', iframeImages);

// iframe HTML
await iframe.waitForSelector('body');
const iframeHTML = await iframe.evaluate(() => document.body.innerHTML);
// console.log('iframe HTML:', iframeHTML);

// iframe links
await iframe.waitForSelector('a');
const iframeLinks = await iframe.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(link => ({
        text: link.innerText,
        href: link.href
    }));
});
// console.log('iframe links', iframeLinks);

// Multipliers
let previousMultipliers = await iframe.evaluate(() => {
    return Array.from(document.querySelectorAll('app-bubble-multiplier')).map(multiplier => multiplier?.innerText.trim() || 'N/A');
});
console.log('Previous multipliers:', previousMultipliers);

// Poll for new multipliers
/*
setInterval(async () => {
    const currentMultipliers = await iframe.evaluate(() => {
        return Array.from(document.querySelectorAll('app-bubble-multiplier')).map(multiplier => multiplier?.innerText.trim() || 'N/A');
    });

    let newMultipliers = currentMultipliers.filter(multiplier => !previousMultipliers.includes(multiplier));
    if (newMultipliers.length > 0) {
        console.log('New multipliers: ', newMultipliers);
        previousMultipliers = [...previousMultipliers, ...newMultipliers];
    }
}, 1000);
*/

// HTML changes
let previousIframeHTML = await iframe.evaluate(() => document.body.innerHTML);
setInterval(async() => {
    const currentIframeHTML = await iframe.evaluate(() => document.body.innerHTML);
    const changes = diff.diffLines(previousIframeHTML, currentIframeHTML);

    changes.forEach(part => {
        if(part.added){
            console.log('Added:', part.value);
        }else if(part.removed){
            console.log('Removed', part.value);
        }
    });

    previousIframeHTML = currentIframeHTML;
}, 2000);

console.log('Polling for new multipliers.');
console.log('Hold Ctrl + C to manually kill the browser.')