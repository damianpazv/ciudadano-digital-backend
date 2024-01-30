const { validationResult } = require("express-validator");
const Usuario = require("../model/usuario");
const bcrypt= require("bcrypt");

const crearUsuario= async (req, res,next)=>{
const usuario=req.body;
const {nombre,password}=usuario;
const errors=validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.mapped(),});
}

try {

usuarioExistente= await Usuario.findOne({nombre});
if(usuarioExistente){
    return res.status(400).json({ok:false,mge:"un usuario ya existe con ese nombre"});
}
const nuevoUsuario =usuario;

 const salt =bcrypt.genSaltSync(10);
 nuevoUsuario.password=bcrypt.hashSync(password, salt);

await Usuario.create(nuevoUsuario); 
res.status(200).json({ok:true, mge:"usuario creado correctamente"})
    
} 
catch (error) {
     next(error);
}    
}

const mostrarUsuarios= async(req, res,next)=>{

    try {
        const usuarios= await Usuario.find();
        res.status(200).json({ok:true, usuarios})    
        } 
        catch (error) {
            next(error);
        }  
}

const loginUsuario= async (req, res,next)=>{
    const usuario=req.body;
    const {nombre,password}=usuario;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.mapped(),});
    }
    
    try {
    
   const usuario= await Usuario.findOne({nombre});
    
    if(!usuario){
        return res.status(200).json({ok:false,mge:"alguno de los datos es incorrecto"});
    }
  
   const validarPassword=bcrypt.compareSync(password,usuario.password);
   if(!validarPassword){
    return res.status(200).json({ok:false,mge:"alguno de los datos es incorrecto"});
   }
    
   
    res.status(200).json({ok:true, mge:"usuario logueado correctamente"})
        
    } 
    catch (error) {
        next(error);
    }    
    }

const editarUsuario=async (req, res,next)=>{
        try {
            const usuarioEdit= await Usuario.findById(req.body._id);
    
            if(!usuarioEdit)
            {
                return res.status(404).json({ok:false, mge:"no existe usuario con ese id"});
            }
    
    await Usuario.findByIdAndUpdate(req.body._id, req.body)
    
    res.status(200).json({ok:true, mge:"usuario editado"})    
            } 
            catch (error) {
                next(error);
            }  
    }
    
const eliminarUsuario=async(req, res,next)=>{

        try {
            const usuarioDelete= await Usuario.findById(req.params.id);
    
            if(!usuarioDelete)
            {
                return res.status(404).json({ok:false, mge:"no existe usuario con ese id"});
            }
    
    await Usuario.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ok:true, mge:"usuario eliminado"})    
            } 
            catch (error) {
                next(error);
            }  
    }
    

module.exports={crearUsuario,mostrarUsuarios,loginUsuario,editarUsuario,eliminarUsuario};