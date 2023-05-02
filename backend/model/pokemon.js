const mongoose = require("mongoose");

const pokeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  link: {
    type: String,
    required: true,
  },

  type: {
    type: [],
  },
  evolutionStage: {
    type: Number,
  },
});

const PokemonModel = mongoose.model("Pokemons", pokeSchema);

module.exports = PokemonModel;
