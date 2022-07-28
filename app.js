const express = require("express");

const pokemonruta = require("./routes/pokemon");
const authRouter = require("./routes/auth");

const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3010;
app.use(cors());
app.use(bodyParser.json());
app.use("/", pokemonruta, authRouter);

app.listen(PORT, () =>
  console.log(`Server listening in http://localhost:${PORT}`)
);
