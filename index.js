const app = require("./src/app");

const port = 3000;

app.listen(port, (err) => {
  if (err) {
    console.log("something went wrong");
    return;
  }
  console.log("Now your server is runnnig for the process");
});
