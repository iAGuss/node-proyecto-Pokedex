const express = require("express");
const router = express.Router();
const { listaPokemones } = require("../controllers/pokemon");
const { getPokemon } = require("../controllers/pokemon");
const { addpokemon } = require("../controllers/pokemon");
const { deletePokemon } = require("../controllers/pokemon");
router.get("/", listaPokemones);
router.get("/:nombre", getPokemon);
router.post("/", addpokemon);
router.delete("/:nombre", deletePokemon);

module.exports = router;
