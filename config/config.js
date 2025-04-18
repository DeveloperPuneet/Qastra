// * config variables from .env files
require("dotenv").config();

// * extracting data
const { PORT, SECRET, DB, EMAIL, PASSWORD } = process.env;

// * exporting data
module.exports = {
    port: PORT,
    secret: SECRET,
    db: DB,
    email: EMAIL,
    password: PASSWORD
}