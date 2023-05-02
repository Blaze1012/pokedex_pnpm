const mongoose = require("mongoose");

async function Database() {
  mongoose.set("strictQuery", true);

  mongoose.connection.once("open", () => {
    console.log("MongoDB connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error(err);
  });

  // mongodb+srv://nasa-api:6ybvrxwT4vmnuCkV@cluster0.pdd585k.mongodb.net/e-commerce
  await mongoose.connect(
    "mongodb+srv://nasa-api:6ybvrxwT4vmnuCkV@cluster0.pdd585k.mongodb.net/pokedex",
    {
      useNewUrlParser: true,
    }
  );
}

module.exports = Database;
