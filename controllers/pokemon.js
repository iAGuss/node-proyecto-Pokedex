const { Pool } = require("pg");
const client = new Pool({
  user: "postgres",
  database: "Pokemones",
  password: "1234",
});
//--------------------------------------------------------------traer la lista completa para usar en info contendor?--------------------------------------
exports.listaPokemones = async (req, res) => {
  const { rows } = await client.query(
    "SELECT  number,name,color,imagen FROM pokemones WHERE (pokemones.borrado =false) order by number"
  );
  return res.send(rows);
};
//"SELECT pokemones.number,pokemones.name,pokemones.weight,pokemones.height,pokemones.color, pokemones.description,pokemones.imagen, stats.hp, stats.atk,stats.def, stats.spd,stats.satk,stats.sdef,moves.name, moves.name2, tipos.type, tipos.type2, tipos.typecolor1, tipos.typecolor2 FROM public.pokemones JOIN stats on stats.statsid = pokemones.statsid JOIN moves on moves.idpokemon = pokemones.number JOIN tipos on tipos.idpokemon =pokemones.number"
//------------------------------------------------------------Mostrar pokemon segun cual clickes-----------------------------------------------------------
exports.getPokemon = async (req, res) => {
  const { nombre } = req.params;
  const { rows } = await client.query(
    "SELECT pokemones.number,pokemones.name,pokemones.weight,pokemones.height,pokemones.color, pokemones.description,pokemones.imagen, stats.hp, stats.atk,stats.def, stats.spd,stats.satk,stats.sdef,moves.move, moves.move2, tipos.type, tipos.type2, tipos.typecolor1, tipos.typecolor2 FROM public.pokemones JOIN stats on stats.statsid = pokemones.statsid JOIN moves on moves.idpokemon = pokemones.number JOIN tipos on tipos.idpokemon =pokemones.number WHERE REPLACE(lower(pokemones.name), ' ', '') like $1",
    [nombre.toLowerCase()]
  );
  return res.send(rows[0]);
};
//--------------------------------------------------------------borrado de pokemon----------------------------------------------------------------
exports.deletePokemon = async (req, res) => {
  const { nombre } = req.params;
  const { rows } = await client.query(
    "UPDATE pokemones SET borrado =true WHERE REPLACE(lower(name), ' ', '') like $1",
    [nombre.toLowerCase()]
  );
  return res.send(rows[0]);
};
// UPDATE public.pokemones
// 	SET "number"=?, name=?, weight=?, height=?, color=?, description=?, statsid=?, imagen=?, borrado=?
// 	WHERE <condition>;

//----------------------------------------------agregar Pokemon------------------------------------------------------------------------------------------
exports.addpokemon = async (req, res) => {
  const { body } = req;
  const newPokemon = {
    name: body.name,
    height: body.height,
    weight: body.weight,
    type1color: body.type1color,
    type2color: body.type2color,
    description: body.description,
    number: body.number,
    color: body.color,
    imagen: body.imagen,
  };
  //-----------------------------------------insert pokemonstats------------------------------------------
  const { rows: stats } = await client.query(
    "INSERT INTO public.stats (hp,atk,def,spd,satk,sdef) values ($1, $2, $3,$4, $5, $6) returning statsid",
    [body.hp, body.atk, body.def, body.spd, body.satk, body.sdef]
  );

  const statsid = stats[0].statsid;
  const { rows: pokemon } = await client.query(
    "INSERT INTO public.pokemones (name,height,weight,description,number,color,statsid,imagen) values ($1, $2, $3,$4, $5, $6,$7,$8) returning number ",
    [
      newPokemon.name,
      newPokemon.height,
      newPokemon.weight,
      newPokemon.description,
      // newPokemon.type1color,
      // newPokemon.type2color,
      newPokemon.number,
      newPokemon.color,

      statsid,
      newPokemon.imagen,
    ]
  );
  const idpokemon = pokemon[0].number;
  //-----------------------------------------insert moves---------------------------------------------------
  await client.query(
    "INSERT INTO public.moves (move,move2,idpokemon) values ($1, $2,$3) returning id",
    [body.move1, body.move2, idpokemon]
  );

  //---------------------------------------insert types------------------------------------------------------
  await client.query(
    "INSERT INTO public.tipos (type,type2,typecolor1,typecolor2,idpokemon) values ($1, $2,$3,$4,$5) returning id",
    [body.type1, body.type2, body.typecolor1, body.typecolor2, idpokemon]
  );

  return res.json({ success: true, newPokemon });
};

// insert into coso ("hp"	"atk"	"def"	"spd"	"satk"	"sdef")
// values(45,	49,	49,	65,	65,	45,
// 39	,52	,43 ,65	60	50
// 44	,48	,65 ,	43	50	64
// 60	,45	,50 ,	70	90	80
// 35	,55	,40	, 90	50	50
// 30	,35	,30	, 80	100	35
// 48	,48	,48	, 48	48	48
// 100,100,100,	100	100	100
// 50	,70	,100,	30	40	40)

//----------------------------------------------------------------------------------------
// SELECT pokemones.number,pokemones.name,pokemones.weight,pokemones.height,pokemones.color, pokemones.description,pokemones.imagen, stats.hp, stats.atk,stats.def,
// stats.spd,stats.satk,stats.sdef,moves.name,moves.name2,tipos.name,tipos.name2,tipos.typecolor1,tipos.typecolor2

// FROM public.pokemones
// JOIN stats on stats.statsid = pokemones.statsid
// JOIN moves on moves.idpokemon = pokemones.number
// JOIN tipos on tipos.idpokemon =pokemones.number

// "name"	"id"	"idpokemon"	"name2"	"typecolor1"	"typecolor2"
// "Grass"	1	"001"	"Poison"	"#74CB48"	"#A43E9E"
// "Fire"	2	"#004"		"#F57D31"
// "Water"	3	"#007"		"#6493EB"
// "Bug"	4	"#012"	"Flying"	"#A7B723"	"#A891EC"
// "Electric"	5	"#025"		"#F9CF30"
// "Ghost"	6	"#082"	"Poison"	"#70559B"	"#A43E9E"
// "Normal"	7	"#132"		"#AAA67F"
// "Psychic"	8	"#182"		"#FB5584"
// "Steel"	9	"#304"	"Rock"	"#B789D0"	"#B69E31"
// "dfas"	12	"#4231"		"#B7C544"	"##B76FA9"
// "dfsdasas"	13	"#422331"		"#B7C544"	"##B76FA9"
// "Spearow "	14	"#020"		"#eed535"	"#50c4e6"
