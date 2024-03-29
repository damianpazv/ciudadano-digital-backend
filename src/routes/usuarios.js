const { Router } = require("express");
const { check } = require("express-validator");
const { crearUsuario, mostrarUsuarios, loginUsuario, editarUsuario, eliminarUsuario } = require("../controllers/usuarioCRUD");
const { agregarUsuario, validarUsuario, obtenerTodosLosCiudadanos, obtenerCiudadanoPorId, obtenerCiudadanoPorDNI, obtenerCiudadanoPorEMAIL, login, obtenerTodosLosCiudadanosMYSQL, agregarUsuarioMYSQL, obtenerPaisesMYSQL, obtenerCiudadanoPorDNIMYSQL, obtenerCiudadanoPorEmailMYSQL, validarUsuarioMYSQL } = require("../controllers/ditecUsuariosControllers");


const router_usuarios=Router();


// endpoints de usuarios
router_usuarios.get("/",obtenerTodosLosCiudadanosMYSQL);




router_usuarios.get('/dni/:dni', obtenerCiudadanoPorDNIMYSQL);
router_usuarios.get('/email/:email', obtenerCiudadanoPorEmailMYSQL);  

router_usuarios.post("/registro",
// [
//     check("nombre_ciudadano","el nombre es obligatorio").not().isEmpty(),
//     check("clave_ciudadano","el password es obligatorio").not().isEmpty(),
   
// ],
agregarUsuarioMYSQL)

router_usuarios.post("/login",
// [
//     check("nombre","el nombre es obligatorio").not().isEmpty(),
//     check("password","el password es obligatorio").not().isEmpty(),
   
// ]

login)

router_usuarios.put("/", validarUsuarioMYSQL)

router_usuarios.delete("/:id",eliminarUsuario)


module.exports = router_usuarios;