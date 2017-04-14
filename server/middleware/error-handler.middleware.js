module.exports = function errHandler(err,req,res,next){
  res.status(err.status || 500);
  res.json({messahe: err.message});
};
