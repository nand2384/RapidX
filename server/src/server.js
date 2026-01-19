const dotenv = require('dotenv');
const app = require('./app');
dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Your backend server is running in http://localhost:${port}`);
});