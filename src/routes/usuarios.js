const { Router } = require("express");
const { check } = require("express-validator");
const { crearUsuario, mostrarUsuarios, loginUsuario, editarUsuario, eliminarUsuario } = require("../controllers/usuarioCRUD");
const { agregarUsuario, validarUsuario, obtenerTodosLosCiudadanos, obtenerCiudadanoPorId, obtenerCiudadanoPorDNI, obtenerCiudadanoPorEMAIL, login } = require("../controllers/ditecUsuariosControllers");


const router_usuarios=Router();


// endpoints de usuarios
router_usuarios.get("/",obtenerTodosLosCiudadanos)
router_usuarios.get('/dni/:dni', obtenerCiudadanoPorDNI);
router_usuarios.get('/email/:email', obtenerCiudadanoPorEMAIL);

router_usuarios.post("/",
// [
//     check("nombre_ciudadano","el nombre es obligatorio").not().isEmpty(),
//     check("clave_ciudadano","el password es obligatorio").not().isEmpty(),
   
// ],
agregarUsuario)

router_usuarios.post("/login",
// [
//     check("nombre","el nombre es obligatorio").not().isEmpty(),
//     check("password","el password es obligatorio").not().isEmpty(),
   
// ]

login)

router_usuarios.put("/", validarUsuario)

router_usuarios.delete("/:id",eliminarUsuario)


module.exports = router_usuarios;