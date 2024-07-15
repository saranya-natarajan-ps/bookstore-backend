const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");
const booksRouter = require("./routes/books");
const authorsRouter = require("./routes/authors");
const genresRouter = require("./routes/genres");
const nocache = require("nocache");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(nocache());
app.use(bodyParser.json());

app.use("/books", booksRouter);
app.use("/authors", authorsRouter);
app.use("/genres", genresRouter);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
