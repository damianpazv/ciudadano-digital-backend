const notFoundHandler=(req,res)=>{
    return res.status(404).json({
status:404,
method:req.method,
path:req.url,
mge:"not found"
    })
};

module.exports={notFoundHandler}