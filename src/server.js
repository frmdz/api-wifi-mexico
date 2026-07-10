// Imports the express routes lo
const app = require('./index.js');

const port = 8080;

// start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
