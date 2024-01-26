import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import hbs from "handlebars";
import dayjs from "dayjs";


hbs.registerHelper("dateFormat", function (value, format) {
  return dayjs(value).format(format);
});

// Assuming you are using a JavaScript environment
hbs.registerHelper('isFirst', function(index) {
  return index === 0;
});

hbs.registerHelper("isLast", function (index, array) {
  // Check if 'array' is defined and is an array before accessing its length
  return array && Array.isArray(array) && index === array.length - 1;
});

const compile = async <T>(templateName: string, data: T) => {
  const filePath = path.join(
    process.cwd(),
    "src",
    "templates",
    `${templateName}.hbs`
  );
  const html = fs.readFileSync(filePath, "utf-8");
  return hbs.compile(html)({
    ...data,
    tailwindcss: "http://localhost:5000/styles/styles.css",
    bluesvgBiggest: "http://localhost:5000/assets/bluesvg-biggest.svg",
    bluesvgBig: "http://localhost:5000/assets/bluesvg-big.svg",
    bluesvgSmall: "http://localhost:5000/assets/bluesvg-small.svg",
  });
};

export const generatePDF = async <T>(
  templateName: string,
  data: T,
  removeMargins?: boolean,
  // withHeader?: boolean,
  notes?: string
) => {
  // Create a browser instance
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
  });

  // Create a new page
  const page = await browser.newPage();

  const content = await compile(templateName, data);

  await page.setContent(content, { waitUntil: "networkidle2" });

  await page.emulateMediaType("screen");

  const pdf = await page.pdf({
    path: undefined,
    margin: {
      ...(!removeMargins && {
        top: "100px",
        right: "50px",
        bottom: "100px",
        left: "50px",
      }),
    },
    printBackground: true,
    format: "A4",
    displayHeaderFooter: true,
    footerTemplate: `<div
          style="border: 0.6px solid #ebeff6; border-radius: 10px; padding: 20px 16px; width: 100%; margin: 0 40px 20px 40px;"
        >
          <p style="color: #5d6481; font-size: 10px; font-weight: 600;">Notes:</p>
          <p style="color: #EBEFF6; font-size: 10px; font-weight: 400;">
            ${notes}
          </p>
        </div>`,
  });

  await browser.close();

  return pdf.toString("base64");
  // return pdf
};
