const express = require("express");
const Model = require("./model/pokemon");
const router = new express.Router();

//save list
router.post("/", async (req, res) => {
  const data = req.body;
  try {
    // if (Model.findOne(data.name))
    //   return res.status(201).send({
    //     err: "entry exists",
    //   });
    const newPokemon = new Model(data);

    await newPokemon.save();
    res.status(201).send(newPokemon);
    console.log(`Pokemon Saved : ${newPokemon}`);
  } catch (err) {
    console.log(err);

    res.status(400).send({
      error: err,
    });
  }
});

//get pokemon
router.get("/:id", async (req, res) => {
  const name = req.params.id;
  try {
    var pokemon = await Model.find({
      name: name,
    });

    return res.status(201).send(pokemon);
  } catch (err) {
    console.log(err);

    res.status(400).send({
      error: err,
    });
  }
});

//update pokemon
router.post("/updateEvo", async (req, res) => {
  try {
    const data = req.body;
    console.log(`Recieved Body:`);
    console.log(data);
    const newPokemon = await Model.findOneAndUpdate(
      {
        name: data.name,
      },
      {
        evolutionStage: data.evolutionStage,
      },
      {
        new: true,
      }
    );

    console.log(`Updated Pokemon: ${newPokemon}`);
    return res.status(201).send(newPokemon);
  } catch (err) {
    console.log(err);

    res.status(400).send({
      error: err,
    });
  }
});
router.post("/updateType", async (req, res) => {
  try {
    const data = req.body;
    console.log(`Recieved Body:`);
    console.log(data);
    const newPokemon = await Model.findOneAndUpdate(
      {
        name: data.name,
      },
      {
        type: data.type,
      },
      {
        new: true,
      }
    );

    console.log(`Updated Pokemon: ${newPokemon}`);
    return res.status(201).send(newPokemon);
  } catch (err) {
    console.log(err);

    res.status(400).send({
      error: err,
    });
  }
});

//search database

router.post("/search", async (req, res) => {
  try {
    const data = req.body;
    const type = data.type;
    console.log(type);
    const stage = data.stage;
    const response = await Model.find({
      type: type,
      evolutionStage: stage,
    });
    console.log(`Result of search: `);
    console.log(response);
    res.status(201).send(response);
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(400).send({
      error: err,
    });
  }
});

module.exports = router;
