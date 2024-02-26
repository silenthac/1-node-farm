const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");
// const textIn = fs.readFileSync("starter/txt/input.txt", "utf-8");
// console.log(textIn);

// const textout = `This is what we know about the avacados:  ${textIn}.\n Created on ${Date.now()}`;
// fs.writeFileSync("starter/txt/output.txt", textout);
// console.log("file Written!");

//Non-blocking Asynchronous way

// fs.readFile("starter/txt/start.txt", "utf-8", (err, data) => {
//   console.log(data);
//   fs.readFile(`starter/txt/${data}.txt`, "utf-8", (err, data1) => {
//     console.log(data1);
//     fs.readFile("starter/txt/append.txt", "utf-8", (err, data2) => {
//       console.log(data2);
//       fs.writeFile("starter/txt/final.txt", `${data1}\n${data2}`, (err) => {
//         console.log("check final.txt file");
//       });
//     });
//   });
// });

const replaceTemplate = function (temp, product) {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTSNAME%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};

const tempOverview = fs.readFileSync(
  "starter/templates/template-overview.html",
  "utf-8"
);
const tempCard = fs.readFileSync(
  "starter/templates/template-card.html",
  "utf-8"
);
const tempproduct = fs.readFileSync(
  "starter/templates/template-product.html",
  "utf-8"
);

const data = fs.readFileSync("starter/dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  console.log(req.url);
  //const pathname = req.url;

  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardHtml = dataObj
      .map((ele) => replaceTemplate(tempCard, ele))
      .join("");
    const output = tempOverview.replace(/{%PRODUCTCARDS%}/g, cardHtml);

    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });

    const product = dataObj[query.id];
    console.log(product);
    console.log(query);
    const output = replaceTemplate(tempproduct, product);
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "helloWorld",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on port 8000");
});
