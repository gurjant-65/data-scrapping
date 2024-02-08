// const axios = require("axios");
// const cheerio = require("cheerio");
// const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// const baseUrl = "https://www.yellowpages.com";
// const searchTerm = "restaurant";
// const locationTerm = "Sebring, FL";

// // Function to scrape data from a single page
// async function scrapePage(url) {
//   try {
//     const response = await axios.get(url);
//     const $ = cheerio.load(response.data);

//     const data = [];

//     // Replace this selector with the appropriate one for the data you want to scrape
//     $(".result").each((index, element) => {
//       const name = $(element).find(".business-name").text().trim();
//       const address = $(element).find(".street-address").text().trim();
//       const phone = $(element).find(".phones.phone.primary").text().trim();
//       const website = $(element)
//         .find(".links a.track-visit-website")
//         .attr("href");

//       data.push({ name, address, phone, website });
//     });

//     return data;
//   } catch (error) {
//     console.error("Error:", error);
//     throw error;
//   }
// }

// // Function to get the URLs of all pages in the search results
// async function getPageUrls() {
//   const initialUrl = `${baseUrl}/search?search_terms=${searchTerm}&geo_location_terms=${locationTerm}`;
//   const pageUrls = [initialUrl];

//   try {
//     const response = await axios.get(initialUrl);
//     const $ = cheerio.load(response.data);

//     // Replace this selector with the appropriate one for pagination
//     const nextPageLink = $('.pagination a:contains("Next")');

//     while (nextPageLink.length) {
//       const nextPageUrl = `${baseUrl}${nextPageLink.attr("href")}`;
//       pageUrls.push(nextPageUrl);

//       const nextPageResponse = await axios.get(nextPageUrl);
//       $ = cheerio.load(nextPageResponse.data);
//       nextPageLink = $('.pagination a:contains("Next")');
//     }

//     return pageUrls;
//   } catch (error) {
//     console.error("Error:", error);
//     throw error;
//   }
// }

// // Function to save data to CSV
// async function saveToCsv(data) {
//   const csvWriter = createCsvWriter({
//     path: "yellowpages_data.csv",
//     header: [
//       { id: "name", title: "Name" },
//       { id: "address", title: "Address" },
//       { id: "phone", title: "Phone" },
//       { id: "website", title: "Website" },
//     ],
//   });

//   await csvWriter.writeRecords(data);
//   console.log("Data saved to yellowpages_data.csv");
// }

// // Main function
// async function main() {
//   const pageUrls = await getPageUrls();
//   const allData = [];

//   for (const url of pageUrls) {
//     const pageData = await scrapePage(url);
//     allData.push(...pageData);
//   }

//   await saveToCsv(allData);
// }

// main();

const axios = require("axios");
const cheerio = require("cheerio");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const baseUrl = "https://www.yellowpages.com";
const searchTerm = "restaurant";
const locationTerm = "Sebring, FL";

// Function to scrape data from a single page
async function scrapePage(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const data = [];

    // Replace this selector with the appropriate one for the data you want to scrape
    $(".result").each((index, element) => {
      const name = $(element).find(".business-name").text().trim();
      const address = $(element).find(".street-address").text().trim();
      const phone = $(element).find(".phones.phone.primary").text().trim();
      const website = $(element)
        .find(".links a.track-visit-website")
        .attr("href");

      data.push({ name, address, phone, website });
    });

    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Function to get the URLs of all pages in the search results
async function getPageUrls() {
  const initialUrl = `${baseUrl}/search?search_terms=${searchTerm}&geo_location_terms=${locationTerm}`;
  const pageUrls = [initialUrl];

  try {
    const response = await axios.get(initialUrl);
    const $ = cheerio.load(response.data);

    // Replace this selector with the appropriate one for pagination
    const nextPageLink = $('.pagination a:contains("Next")');

    while (nextPageLink.length) {
      const nextPageUrl = `${baseUrl}${nextPageLink.attr("href")}`;
      pageUrls.push(nextPageUrl);

      const nextPageResponse = await axios.get(nextPageUrl);
      $ = cheerio.load(nextPageResponse.data);
      nextPageLink = $('.pagination a:contains("Next")');
    }

    return pageUrls;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Function to save data to CSV
async function saveToCsv(data) {
  const csvWriter = createCsvWriter({
    path: "yellowpages_data.csv",
    header: [
      { id: "name", title: "Name" },
      { id: "address", title: "Address" },
      { id: "phone", title: "Phone" },
      { id: "website", title: "Website" },
    ],
  });

  await csvWriter.writeRecords(data);
  console.log("Data saved to yellowpages_data.csv");
}

// Main function
async function main() {
  const pageUrls = await getPageUrls();
  const allData = [];

  for (const url of pageUrls) {
    const pageData = await scrapePage(url);
    allData.push(...pageData);
  }

  await saveToCsv(allData);
}

main();
