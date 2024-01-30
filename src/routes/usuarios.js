const { Router } = require("express");
const { check } = require("express-validator");
const { crearUsuario, mostrarUsuarios, loginUsuario, editarUsuario, eliminarUsuario } = require("../controllers/usuarioCRUD");


const router_usuarios=Router();


// endpoints de usuarios
router_usuarios.get("/", mostrarUsuarios)

router_usuarios.post("/",
[
    check("nombre","el nombre es obligatorio").not().isEmpty(),
    check("password","el password es obligatorio").not().isEmpty(),
   
]

,crearUsuario)

router_usuarios.post("/login",
[
    check("nombre","el nombre es obligatorio").not().isEmpty(),
    check("password","el password es obligatorio").not().isEmpty(),
   
]

,loginUsuario)

router_usuarios.put("/", editarUsuario)

router_usuarios.delete("/:id",eliminarUsuario)


module.exports = router_usuarios;