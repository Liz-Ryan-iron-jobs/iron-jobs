const express = require('express');
const bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.json());
app.use(require('./middleware/auth.middleware.js'));

app.use('/api/job', require('./routes/job.routes.js'));
app.listen(3000, function doSomethingOnceServerIsUp(){
  console.log('The server is now up!');
});
