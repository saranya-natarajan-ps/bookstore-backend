const { Sequelize, DataTypes } = require("sequelize");
const axios = require("axios");

const sequelize = new Sequelize("bookstore", "xxxx", "xxxxxxx", {
  host: "localhost",
  dialect: "mysql",
});

const Book = sequelize.define("Book", {
  book_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Authors",
      key: "author_id",
    },
  },
  genre_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Genres",
      key: "genre_id",
    },
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  publication_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const Author = sequelize.define("Author", {
  author_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  biography: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

const Genre = sequelize.define("Genre", {
  genre_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  genre_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const clearTables = async () => {
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  await Book.destroy({ where: {}, truncate: false });
  await Author.destroy({ where: {}, truncate: false });
  await Genre.destroy({ where: {}, truncate: false });
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
};

const seedData = async (googleBooksApiKey) => {
  const genres = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Fantasy",
    "Science Fiction",
    "Biography",
    "Thriller",
    "Comedy",
    "Romance",
  ];

  const genreInstances = await Promise.all(
    genres.map((genre) => Genre.create({ genre_name: genre }))
  );

  const genreMap = {};
  genres.forEach((genre, index) => {
    genreMap[genre] = genreInstances[index].genre_id;
  });

  const fetchBooks = async (query, genre) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${googleBooksApiKey}&maxResults=40&langRestrict=en,hi,ta,te,kn,ml,mr,bn&maturityRating="NOT MATURE`;
    const response = await axios.get(url);
    const books = response.data.items;

    for (const book of books) {
      const {
        title,
        authors,
        publishedDate,
        imageLinks,
        listPrice,
        description,
      } = book.volumeInfo;

      if (!authors || !authors.length) continue; // Skip books without authors

      let authorInstance = await Author.findOne({
        where: { name: authors[0] },
      });
      if (!authorInstance) {
        authorInstance = await Author.create({
          name: authors[0],
          biography: description || "Biography not available",
        });
      }

      const image = imageLinks
        ? imageLinks.thumbnail
        : "http://example.com/default-image.jpg";
      const price = listPrice
        ? listPrice.amount
        : Math.floor(Math.random() * 500) + 100;

      await Book.create({
        title,
        author_id: authorInstance.author_id,
        genre_id: genreMap[genre],
        price,
        publication_date: publishedDate,
        image,
      });
    }
  };

  const queries = [
    "fiction",
    "non-fiction",
    "mystery",
    "fantasy",
    "science fiction",
    "biography",
    "thriller",
    "comedy",
    "romance",
  ];

  let totalBooksFetched = 0;

  for (let i = 0; i < queries.length && totalBooksFetched < 350; i++) {
    await fetchBooks(queries[i], genres[i]);
    totalBooksFetched += 40; // 40 is the maxResults per fetchBooks call
  }
};

const main = async () => {
  try {
    await sequelize.sync({ force: true });
    await clearTables();
    const googleBooksApiKey = "";
    await seedData(googleBooksApiKey);
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    await sequelize.close();
  }
};

main();
