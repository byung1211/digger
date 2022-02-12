
/**
 * 2022.02.12 
 * Author: Byung1211
 * Description: 
 */


const fs = require('fs');
const https = require('https');
const puppeteer = require('puppeteer');

// Taget to Download
const projectName = "Zipcy's SuperNormal";
const projectPrefix = "ZIPS #";
const fileExtension = "png"
const projectUrl = "https://opensea.io/assets/0xd532b88607b1877fe20c181cba2550e3bbd6b31c/";
const startNumber = 1;
const endNumber = 1;
const sizeOfFolder = 100;



function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const download = (url, destination) => new Promise((resolve, reject) => {
  const file = fs.createWriteStream(destination);

  https.get(url, response => {
    response.pipe(file);

    file.on('finish', () => {
      file.close(resolve(true));
    });
  }).on('error', error => {
    fs.unlink(destination);

    reject(error.message);
  });
});


function run () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch(
            {
                headless: false
            });

            const page = await browser.newPage();
 
            let downloadUrl = '';

            for(let i = startNumber; i <= endNumber; i++) {      //// for loop 1 - start
              
              downloadUrl = projectUrl + i;
              
              console.log(i+": Download URL: "+downloadUrl);

              await page.goto(downloadUrl, { waitUntil: 'networkidle2' });

              let urls = await page.evaluate(() => {
                  let results = [];
                  let items = document.querySelectorAll('img[class="Image--image"]');
                  items.forEach((item) => {
                      results.push({
                          url:  item.getAttribute('src')
                      });
                  });
                  return results;
              });

              // Set a delay
              sleep(3000);
              
              const images = urls;

              // Check the folder to store images
              const dir = `./${projectName}`;
              if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
              }
              
              // Download images
              for (let i = 0; i < images.length; i++) {
              
                result = await download(images[i].url.replace("w600", "s0"), `${dir}/${projectPrefix}${i}.${fileExtension}`);
            
                if (result === true) {
                  console.log('Success:', images[i], 'has been downloaded successfully.');
                } else {
                  console.log('Error:', images[i], 'was not downloaded.');
                  console.error(result);
                }
              }

            } //// for loop 1 - end

            browser.close();

            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}


run().catch(console.error);
//run().then(console.log).catch(console.error);

