const app = require("./src/app.js");
const PORT = 3030;
const server = app.listen(PORT, () => {
  console.log("Server is running on http://localhost:3030");
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server is closed");
  });
});
