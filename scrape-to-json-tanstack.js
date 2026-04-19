import fs from 'fs';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

// Extract URLs from markdown file
function extractUrlsFromMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const urlRegex = /https:\/\/tanstack\.com[^\s)]+/g;
  return content.match(urlRegex) || [];
}

// Extract main H1 heading and heading IDs from HTML
function extractHeadingData(html) {
  const dom = new JSDOM(html);

  // Get main H1 heading
  const h1 = dom.window.document.querySelector('h1');
  const mainHeading = h1 ? h1.textContent.trim() : '';

  // Get h2 and h3 headings with IDs
  const headings = dom.window.document.querySelectorAll('h2[id], h3[id]');
  const ids = Array.from(headings).map(h => ({
    text: h.textContent.trim(),
    id: h.id
  }));

  return { mainHeading, ids };
}

// Main scraping function
async function scrapeToJsArray() {
  const inputFile = './tanstack.md';
  const outputFile = './tanstack-jump-links.json';

  console.log('Extracting URLs...');
  const urls = extractUrlsFromMarkdown(inputFile);
  console.log(`Found ${urls.length} URLs\n`);

  const dataArray = [];
  let successCount = 0;
  let failureCount = 0;

  for (const url of urls) {
    try {
      console.log(`Fetching: ${url}`);
      const response = await fetch(url);
      const html = await response.text();

      const { mainHeading, ids } = extractHeadingData(html);

      // Add main h1 as separate object
      dataArray.push({
        url: url,
        heading: mainHeading
      });

      // Create objects for each heading
      ids.forEach(heading => {
        dataArray.push({
          url: `${url}#${heading.id}`,
          heading: heading.text
        });
      });

      successCount++;

      // Add delay to be respectful to the server
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`Error fetching ${url}: ${error.message}`);
      failureCount++;
    }
  }

  // Write to JSON file
  const jsonContent = JSON.stringify(dataArray, null, 2) + '\n';
  fs.writeFileSync(outputFile, jsonContent);

  console.log(`\n✅ Done! Scraped ${successCount} pages (${failureCount} failures)`);
  console.log(`📄 Output saved to: ${outputFile}`);
  console.log(`📊 Total links extracted: ${dataArray.length}`);
}

scrapeToJsArray().catch(console.error);
