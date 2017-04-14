const mongoose = require('mongoose');

let jobSchema = mongoose.Schema({
  id: String,
  company: String,
  link: String,
  notes: String,
  createTime: Date
});
module.exports = mongoose.model('Job', jobSchema);
