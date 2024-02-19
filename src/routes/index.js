const { Router } = require("express");

const router_usuarios = require("./usuarios");
const { obtenerPaisesMYSQL, obtenerProvinciasMYSQL, obtenerGeneroMYSQL, obtenerDocumentoMYSQL } = require("../controllers/ditecUsuariosControllers");

const router=Router();

//endpoints

router.use("/usuarios",router_usuarios);


router.get("/paises",obtenerPaisesMYSQL); 
router.get("/provincias",obtenerProvinciasMYSQL); 
router.get("/genero",obtenerGeneroMYSQL); 
router.get("/documento",obtenerDocumentoMYSQL); 

module.exports = router;