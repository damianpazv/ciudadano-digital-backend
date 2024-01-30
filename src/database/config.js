const  mongoose = require("mongoose");
  

const dbconection= async ()=>{
    try{

       await mongoose.connect(process.env.DB_CONECTION)
        console.log("db conected");
    }

catch{

    console.log("error al conectar");
}

};

module.exports = dbconection;