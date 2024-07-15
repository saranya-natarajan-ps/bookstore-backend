// models/index.js

const { Sequelize, DataTypes } = require("sequelize");

// Replace with your actual database credentials
const sequelize = new Sequelize("bookstore", "xxxx", "xxxxxxxx", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

// Define Author model
const Author = sequelize.define("Author", {
  author_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  biography: {
    type: DataTypes.TEXT,
  },
});

// Define Genre model
const Genre = sequelize.define("Genre", {
  genre_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  genre_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define Book model
const Book = sequelize.define("Book", {
  book_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  publication_date: {
    type: DataTypes.DATE,
  },
  image: {
    type: DataTypes.STRING,
  },
});

// Define associations
Author.hasMany(Book, { foreignKey: "author_id" });
Genre.hasMany(Book, { foreignKey: "genre_id" });
Book.belongsTo(Author, { foreignKey: "author_id" });
Book.belongsTo(Genre, { foreignKey: "genre_id" });

// Sync all defined models to the database
sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });

module.exports = {
  Author,
  Genre,
  Book,
  sequelize,
};
