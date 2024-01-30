const { Schema, model} = require("mongoose");

const usuarioSchema=Schema(
    {
nombre:{ type: String,
          required:true,
        },
password:{ type: String,
         required:true,
       },
                
});

module.exports=model("Usuario",usuarioSchema);