const jobRouter = require('express').Router();
const Job = require('../models/Job.model.js');

/**
* Shows jobs array
* @param {Object} req
* @param {Object} res
* @param {Function}
* @type {Array}
*/

jobRouter.get('/', function showAllJobs(req,res,next){
  if (Object.keys(req.query).length){
    // Send back jobs that match a query.
    Job.find({company: {$regex: req.query.query, $options: 'i'}})
    .then(function sendBackMatchingJobs(allMatchingData){
      res.json(allMatchingData.map(function(job){
        return {id: job._id, company: job.company, link: job.link, notes: job.notes, createTime:job.createTime};
      }));
    })
    .catch(function handleIssues(err){
      let ourError = new Error('Unable to retrieve search results');
      ourError.status = 500;
      return next(ourError);
    });
  } else {
    // Send back all jobs.
    Job.find()
    .then(function sendBackAllJobs(allJobs){
      res.json(allJobs.map(function(job){
        return {id:job._id, company:job.company, link: job.link, notes:job.notes, createTime:job.createTime};
      }));
    })
    .catch(function handleIssues(err){
      console.log(err);
      let ourError = new Error('Unable to retrieve jobs');
      ourError.status = 500;
      return next(ourError);
    });
  }
});








jobRouter.get('/:jobid', function retrieveSingleJob(req, res, next){
  Job.findById(req.params.jobid)
  .then(function sendBackSingleJob(data){
    if (!data){
      let ourError = new Error('No job with that ID');
      ourError.status = 404;
      return next(ourError);
    }
    console.info(data);
    res.json({company: data.company, link: data.link, notes: data.notes, id: data._id, createTime: data.createTime});
  })
  .catch(function handleIssues(err){
    console.log(err);
    let ourError = new Error('Unable to retrieve single job');
    ourError.status = 500;
    return next(ourError);
  });
});

jobRouter.delete('/:id', function deleteJob(req,res,next){
  Job.findById({_id: req.params.id})
    .then(function removeTheJob(job){
      if(!job){
        let err = new Error('job to delete not found');
        err.status=404;
        return next(err);
      }
      job.remove();
      res.json(job);
    })
    .catch(function handleIssues(err){
      let ourError = new Error('There was an error finding the job');
      ourError.status = err.status;
      return next(ourError);
    });
});

/**
* Adds a job to our collection
* @param {Object}   req  Must have a body like { "company": String , "link": String}
* @param {Object}   res  The Response will contain a message if added: { message: 'I added it'}
* @param {Function} next [description]
* @return {Void}
*/
function addAJob(req,res,next){
  console.log('incoming data for post', req.body);
  if(!req.body){
    let ourError = new Error('You must provide a job');
    ourError.status = 400;
    return next(ourError);
  }

  let theJobCreated = new Job({company: req.body.company, link: req.body.link, notes: req.body.notes, createTime: new Date()});

  theJobCreated.save()
  .then(function sendBackTheResponse(data){
    res.json(data);
  })
  .catch(function handleIssues(err){
    let ourError = new Error('Unable to save the new Job');
    ourError.status = 422;
    next(ourError);
  });
}

jobRouter.post('/', addAJob);
module.exports = jobRouter;
