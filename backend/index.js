const express = require("express");
const Database = require("./db");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");
const DBRouter = require("./dbRoute");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(bodyParser());
app.use(express.json());
app.use(cors(corsOptions));
app.use("/db", DBRouter);
app.use(express.static(path.join(__dirname, "dist")));

app.get("/check/:id", async (req, res) => {
  console.log(`Recieved Number:  ${req.params.id}`);
  res.send({
    msg: "ok",
  });
});
app.listen(PORT, () => {
  console.log(`listening on port:${PORT}`);
});

Database();
