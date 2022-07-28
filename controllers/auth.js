const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../middlewares/validar");

const { Pool } = require("pg");
const client = new Pool({
  user: "postgres",
  database: "Pokemones",
  password: "1234",
});
//-----------------------------------------------------Login Usuario--------------------------------------------------------------------------
exports.loginUsuario = async (req, res) => {
  const { rows } = await client.query(
    "SELECT*FROM public.usuarios WHERE mail =$1",
    [req.body.mail]
  );
  if (!rows[0]) {
    return res.status(400).json({ error: "Usuario no encontrado" });
  }
  const validPassword = await bcrypt.compare(
    req.body.password,
    rows[0].password
  );
  if (!validPassword) {
    return res.status(400).json({ error: "Contraseña no válida" });
  }

  // Crear el token
  const token = jwt.sign(
    {
      name: rows[0].name,
      id: rows[0].id,
    },
    TOKEN_SECRET
  );

  res.json({ error: null, data: "Login exitoso", token });
};
//------------------------------------------------------Registro Usuario--------------------------------------------------------------------------------
exports.registrarUsuario = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const newUser = {
    nombre: req.body.nombre,
    mail: req.body.mail,
    password: password,
  };
 
  await client.query(
    "INSERT INTO public.usuarios (nombre,mail,password) values ($1, $2, $3) ",
    [newUser.nombre, newUser.mail, newUser.password]
  );
  return res.json({ success: true, newUser });
};
//----------------------------------------------------------------------------------------------------------------------------------------------------
