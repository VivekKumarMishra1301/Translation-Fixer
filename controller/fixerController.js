

const axios = require('axios');
const cheerio = require('cheerio');

// WordPress REST API base URLs
const wpApiBaseUrl = 'https://staging.recruitcrm.io/wp-json/wp/v2/';
const wpApiBaseUrlJapanese = 'https://staging.recruitcrm.io/wp-json/wp/v2/';

// Function to fetch English blogs
async function fetchEnglishBlogs(page) {
    try {
        const response = await axios.get(`${wpApiBaseUrl}posts?lang=en&page=${page}`);
        // console.log(response.data);
        return response.data; // Return the list of English blogs
    } catch (error) {
        console.error('Error fetching English blogs:', error);
    }
}







// console.log(fetchEnglishBlogs());

// Function to find Japanese blog by slug
async function findJapaneseBlogBySlug(id) {
    try {
        const response = await axios.get(`${wpApiBaseUrlJapanese}posts/${id}?lang=ja`);
        if (response.data.length > 0) {
            return response.data[0]; // Assuming one post per slug
        }
        return null;
    } catch (error) {
        console.error('Error fetching Japanese blog:', error);
    }
}

// Function to extract links from English content
function extractLinksFromContent(content) {
    const $ = cheerio.load(content);
    const links = [];
    $('a').each((i, elem) => {
        links.push($(elem).attr('href')); // Get the href attribute of each link
    });
    return links;
}

// Function to update Japanese blog content with English links
async function updateJapaneseBlogContent(japanesePostId, newContent) {
    try {
        const response = await axios.post(`${wpApiBaseUrlJapanese}posts/${japanesePostId}`, {
            content: newContent
        }, {
            headers: {
                'Authorization': 'Bearer YOUR_JAPANESE_SITE_API_TOKEN',
                'Content-Type': 'application/json'
            }
        });
        console.log(`Updated Japanese blog ID: ${japanesePostId}`);
    } catch (error) {
        console.error('Error updating Japanese blog content:', error);
    }
}

// Main function
async function updateJapaneseBlogs(page) {
    const englishBlogs = await fetchEnglishBlogs(page);
    
    for (const englishBlog of englishBlogs) {
        const slug = englishBlog.slug;
        console.log(slug);
        const englishContent = englishBlog.content.rendered;

        // // Extract links from the English content
        const links = extractLinksFromContent(englishContent);
// console.log(links);
        // // Find the corresponding Japanese blog
        const id=englishBlog.id;
        const japaneseBlog = await findJapaneseBlogBySlug(id);
        console.log(japaneseBlog);
        // if (japaneseBlog) {
        //     let japaneseContent = japaneseBlog.content.rendered;

        //     // Update Japanese content with links found in English content
        //     links.forEach(link => {
        //         japaneseContent += `<p><a href="${link}">Reference: ${link}</a></p>`;
        //     });

        //     // Update the Japanese blog with the modified content
        //     await updateJapaneseBlogContent(japaneseBlog.id, japaneseContent);
        // } else {
        //     console.log(`No Japanese blog found for slug: ${slug}`);
        // }
    }
}





const fixerController=async(req,res)=>{
    // console.log(req.bod)
    const {page}=req.body;
    console.log(page);
    updateJapaneseBlogs(page);
    return res.status(200).send({
        success:true,
        message:"API executed successfully"

    })
}

module.exports=fixerController;