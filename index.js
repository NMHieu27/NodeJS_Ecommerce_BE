// const bodyParser = require("body-parser");
const express = require("express");
const db = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;

const route = require("./routes");
const morgan = require("morgan");

db.connect();
app.use(morgan("dev"));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  express.urlencoded({
    extended: true,
  })
); //Xử lý lấy dữ liệu từ formdata thay vì dùng bodyparser

app.use(express.json());

route(app);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running  at PORT ${PORT}`);
});
