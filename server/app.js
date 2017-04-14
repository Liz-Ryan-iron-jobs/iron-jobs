const express = require('express');
const bodyParser = require('body-parser');
require('./database-setup.js');
let app = express();
// console.log('process id', process.pid);
// console.log('Enviroment Variables', process.env);
console.log('Database Location', process.env.MONGO_DB);

app.use(express.static(__dirname + '/../client/public'));
app.use(bodyParser.json());
app.use(require('./middleware/auth.middleware.js'));

app.use('/api/jobs', require('./routes/job.routes.js'));


app.use(require('./middleware/error-handler.middleware.js'));
app.listen(3000, function doSomethingOnceServerIsUp(){
  console.log('The server is now up!');
});
