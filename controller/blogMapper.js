const puppeteer = require('puppeteer');
const axios=require('axios');

const cheerio=require('cheerio');


async function visitUrl(url){

    const browser = await puppeteer.launch({ headless: false, args: [
        '--start-maximized', // This will open Chrome in full screen mode
        '--window-size=1920,1080' // Set a default resolution, adjust as needed
    ],
    defaultViewport: null }); // Launch the browser
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.js-wpml-ls-item-toggle', { visible: true });
    await page.click('.js-wpml-ls-item-toggle');
    
    // Wait for the sub-menu to appear after the dropdown is clicked
    await page.waitForSelector('.wpml-ls-sub-menu', { visible: true });

    // Select the specific language option by its class or inner text (example for French)
    const langSelector = 'li.icl-fr a'; // Modify to target different languages
    await page.click(langSelector);

    console.log('Language option clicked successfully!');
    


    const pguri=page.url();
    console.log(pguri);
    await browser.close();

    return pguri;



}


async function extractUrls(htmlContent) {
    const $ = cheerio.load(htmlContent);
    const urls = [];
    $('a').each((i, elem) => {
      urls.push({
        url: $(elem).attr('href'),
        text: $(elem).text().trim(),
      });
    });
    return urls;
  }




async function fixAnchorUrls(slug) {

//step:1 get content in english url
const response=await axios.get(`https://recruitcrm.io/wp-json/wp/v2/posts/?slug=${slug}`);
// console.log(response.data);

const url=`https://recruitcrm.io/blogs/${slug}`
   
//step:2 extract urls associated with texts
const urlsInEnglishPost=await extractUrls(response.data[0].content.rendered);
console.log(urlsInEnglishPost); 


//step:3 visit blog page in translated language and get slug
const pguri= await visitUrl(url);    
const lastSegment = pguri.split('/').filter(Boolean).pop();
// const lastSegment="blogs-fr/les-signaux-dalerte-lors-dun-entretien/"
console.log(lastSegment);


//step:4 get content of translated page

const translatedPageResponse=await axios.get(`https://recruitcrm.io/wp-json/wp/v2/posts/?slug=${lastSegment}&lang=fr`);
// console.log(translatedPageResponse.data);


//step:5 get urls with text for translated post

const urlInTranslatedPost=await extractUrls(translatedPageResponse.data[0].content.rendered);
console.log(urlInTranslatedPost);
    // await page.waitForNavigation();


    // Step 5: Extract content in another language (Japanese, for example)
    // const translatedContent = await page.evaluate(() => document.body.innerHTML);
// console.log(translatedContent);
    // Step 6: Get all anchors in the translated version
    // const translatedAnchors = await page.evaluate(() => {
    //     return Array.from(document.querySelectorAll('a')).map(anchor => ({
    //         href: anchor.href,
    //         text: anchor.textContent
    //     }));
    // });

    // // Step 7: Iterate over English anchors and fix incorrect URLs in the translated version
    // for (let i = 0; i < englishAnchors.length; i++) {
    //     const englishAnchor = englishAnchors[i];

    //     // Open each English anchor in a new tab
    //     const newPage = await browser.newPage();
    //     await newPage.goto(englishAnchor.href);

    //     // Change the language of the opened page
    //     await newPage.select('selector-for-language-dropdown', 'desired-language-code'); // Adjust selector
    //     await newPage.waitForNavigation();

    //     // Get the new URL in the translated language
    //     const newTranslatedUrl = newPage.url();

    //     // Update the corresponding translated anchor with the correct URL
    //     translatedAnchors[i].href = newTranslatedUrl;

    //     await newPage.close();
    // }

    // Step 8: Use the updated translated content with fixed anchor URLs
    // You can either save this content to a file, update your database, or perform another task
    // console.log('Updated Translated Anchors:', translatedAnchors);

    // await browser.close();
    console.log("all done")
}



const blogMapper=async(req,res)=>{
const {url}=req.body;

fixAnchorUrls('interview-red-flags');

}


module.exports=blogMapper;
