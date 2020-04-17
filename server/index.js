const http = require("http");
const app = require("./express");

const hostname = "127.0.0.1";
const port = 8443;

const server = http.createServer(app).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});