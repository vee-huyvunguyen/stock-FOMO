import puppeteer from 'puppeteer';
import PuppetMaster from './PuppetShow/TheMaster/PuppetMaster';
import ConsoleWatcher from './PuppetShow/TheWatcher/ConsoleWatcher';

async function main() {
  const url: string = 'https://crawlee.dev/api/puppeteer-crawler/class/PuppeteerCrawler';

  // Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const watcher = new ConsoleWatcher({level:'warn'})
  var puppetMaster = new PuppetMaster(page, browser,{logNullElement:false}, watcher )

  try{
    await puppetMaster.goto(url);
    const titleElement = await puppetMaster.selectElement(
      '.theme-doc-markdown > header:nth-child(1) > h1:nth-child(1)'
    )
    const title = await titleElement?.text()
    console.log(`titleElement is ${title}`)
  }finally{
    await browser.close();
  }
  // Close the browser
}

// Example usage
main();