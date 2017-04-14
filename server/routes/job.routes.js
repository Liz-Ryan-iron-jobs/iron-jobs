const jobRouter = require('express').Router();
const Job = require('../models/Job.model.js');

/**
* Shows an array containing objects defining each job
* @param {Object} req requests a job based on its ID
* @param {Object} res responds with ID based job
* @param {Function} next moves to next function
* @return {Object} the object with the corrected property names.
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

/**
 * Retrieves a single job via ID
 * @param {Object}    req requests the ID from the URL path
 * @param {Object}    res responds with a json
 * @param {function}  next
 */
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

/**
 * Deletes a single job
 * @param {Object} req requests sent from front end
 * @param {Object} res responds back to the front end
 * @param {function} next moves to next function
 * @return {void}
 */
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
* Adds a job to our database
* @param {Object}   req  Must have a body like { "company": String , "link": String, "Notes": String, "createTime": Number}
* @param {Object}   res  The Response will contain a message if added: { message: 'I added it'}
* @param {Function} next moves to next function once reached
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
