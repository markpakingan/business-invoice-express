/** Server startup for BizTime. */

// this is the server.js file

const app = require("./app");


app.listen(8000, function () {
  console.log("Listening on 8000");
});