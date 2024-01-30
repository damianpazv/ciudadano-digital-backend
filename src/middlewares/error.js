const errorHandler=(error,req,res,next)=>{
    return res.status(500).json({
status:500,
method:req.method,
path:req.url,
mge:error.message
    })
};

module.exports={errorHandler}