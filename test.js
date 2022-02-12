

const puppeteer = require('puppeteer');

async function test(){
  const browser = await puppeteer.launch(
    {
      executablePath: 'CHROMEPATH',
      headless: false
    }
  );

  const page = await browser.newPage();
  await page.goto('https://opensea.io/assets/0xd2f668a8461d6761115daf8aeb3cdf5f40c532c6/4389',
  {
    waitUntil: 'networkidle2'
  });

  const html = await page.content();
  await browser.close();
  return html;
}


Promise.all([test()])
.then(
  ([result]) => console.log(result)
);

