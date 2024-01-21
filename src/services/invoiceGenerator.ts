import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import hbs from "handlebars";
import dayjs from "dayjs";


hbs.registerHelper("dateFormat", function (value, format) {
  return dayjs(value).format(format);
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
    tailwindcss: ``,
    logo: ``,
  });
};

export const generatePDF = async <T>(
  templateName: string,
  data: T,
  removeMargins?: boolean,
  withHeader?: boolean
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
    displayHeaderFooter: withHeader,
    headerTemplate: `<div style="display: flex; justify-content: flex-end; padding-left: 40px; padding-right: 40px;" class="flex justify-end px-10">
    <img
      src=""
      style="width: 30%"
      alt="logo"
    />
  </div>`,
    footerTemplate: ``,
  });

  await browser.close();

  return pdf.toString("base64");
};
