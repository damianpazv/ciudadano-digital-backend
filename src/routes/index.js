const { Router } = require("express");

const router_usuarios = require("./usuarios");

const router=Router();

//endpoints

router.use("/usuarios",router_usuarios);

module.exports = router;