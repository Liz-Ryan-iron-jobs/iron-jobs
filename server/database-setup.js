const mongoose = require('mongoose');

if(!process.env.MONGO_DB){
  console.log('no database detected!');
  process.exit(128);
}
mongoose.connect(process.env.MONGO_DB);

mongoose.connection.on('error', function handleDBErrors(err){
  console.log('DB Error', err);
  process.exit(128);
});
