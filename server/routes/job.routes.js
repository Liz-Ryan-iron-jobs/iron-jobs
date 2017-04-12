const jobRouter = require('express').Router();

let allJobs = [
  {'id': '15', 'company': 'United Airlines', 'link': 'https://www.united.com', 'notes': 'passenger puller needed', 'createTime': Date.now()},
  {'id': '17', 'company': 'Whataburger', 'link': 'https://www.whataburger.com', 'notes': 'burger flipper needed', 'createTime': Date.now()},
  {'id': '20', 'company': 'In-N-Out', 'link': 'https://www.fiveguys.com', 'notes': 'drive thru lacky needed', 'createTime': Date.now()}
];

jobRouter.get('/', function showAllJobs(req,res,next){
  let jobCollection = [];
  allJobs.forEach(function(job){
    jobCollection.push({id: job.id, company: job.company, link: job.link});
  });
  console.log(jobCollection, allJobs);
  res.json(jobCollection);
});


/**
 * Adds a job to our collection
 * @param {Object}   req  Must have a body like { "company": String}
 * @param {Object}   res  The Response will contain a message if added: { message: 'I added it'}
 * @param {Function} next [description]
 */
function addAJob(req,res,next){
  if(!req.body){
    let err = new Error('You must provide a job');
    err.status = 400;
    next(err);
    return;
  }
  req.body.createTime = Date.now();
  req.body.id = '122333' + Math.random();
  allJobs.push(req.body);

  res.json({message: 'I added it!', theJobIAdded: req.body});
}
jobRouter.post('/', addAJob);



module.exports = jobRouter;
