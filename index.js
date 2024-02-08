const axios = require("axios");
const cheerio = require("cheerio");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const baseUrl = "https://www.yellowpages.com";
const searchTerm = "restaurant";
const locationTerm = "Sebring, FL";
async function scrapePage(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const data = [];

    // Replace this selector with the appropriate one for the data you want to scrape
    $(".info").each((index, element) => {
      const name = $(element).find(".business-name").text().trim();
      const address = $(element).find(".adr").text().trim();
      const phone = $(element).find(".phones.phone").text().trim();

      // Extract the website URL
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
    let nextPageUrl = initialUrl;

    while (nextPageUrl) {
      const response = await axios.get(nextPageUrl);
      const $ = cheerio.load(response.data);

      // Replace this selector with the appropriate one for pagination
      const nextPageLink = $('.pagination a:contains("Next")');

      if (nextPageLink.length) {
        nextPageUrl = nextPageLink.attr("href");
        nextPageUrl = nextPageUrl.startsWith("http")
          ? nextPageUrl
          : baseUrl + nextPageUrl;
        pageUrls.push(nextPageUrl);
      } else {
        nextPageUrl = null;
      }
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
    path: "files/yellowpages_data.csv",
    header: [
      { id: "name", title: "Name" },
      { id: "address", title: "Address" },
      { id: "phone", title: "Phone" },
      { id: "website", title: "Website" }, // Added 'Website' column
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
