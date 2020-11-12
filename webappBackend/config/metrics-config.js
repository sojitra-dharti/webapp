var SDC = require('statsd-client'),
	sdc = new SDC({port: 8125});

  // Timing: sends a timing command with the specified milliseconds
  // Increment: Increments a stat by a value (default is 1)

  //********************* USER APIs *************************

  sdc.timing('User.Create.ApiTime');
  sdc.timing('User.Update.ApiTime');
  sdc.timing('User.View.ApiTime');
  sdc.timing('User.ViewById.ApiTime');

  sdc.timing('User.Create.DbQueryTime');
  sdc.timing('User.Update.DbQueryTime');
  sdc.timing('User.View.DbQueryTime');
  sdc.timing('User.ViewById.DbQueryTime');

  sdc.increment('User.Create.ApiCount');
  sdc.increment('User.Update.ApiCount');
  sdc.increment('User.View.ApiCount');
  sdc.increment('User.ViewById.ApiCount');

  //********************* QUESTION APIs *************************

  sdc.timing('Question.Create.ApiTime');
  sdc.timing('Question.Update.ApiTime');
  sdc.timing('Question.Delete.ApiTime');
  sdc.timing('Question.View.ApiTime');
  sdc.timing('Question.ViewById.ApiTime');
 

  sdc.timing('Question.Create.DbQueryTime');
  sdc.timing('Question.Update.DbQueryTime');
  sdc.timing('Question.Delete.DbQueryTime');
  sdc.timing('Question.View.DbQueryTime');
  sdc.timing('Question.ViewById.DbQueryTime');


  sdc.increment('Question.Create.ApiCount');
  sdc.increment('Question.Update.ApiCount');
  sdc.increment('Question.Delete.ApiCount');
  sdc.increment('Question.View.ApiCount');
  sdc.increment('Question.ViewById.ApiCount');

  //******************* FILE APIs *******************
  sdc.increment('File.Create.ApiTime');
  sdc.increment('File.Delete.ApiTime');

  sdc.increment('File.Create.ApiCount');
  sdc.increment('File.Delete.ApiCount');

  sdc.increment('File.Create.DbQueryTime');
  sdc.increment('File.Delete.DbQueryTime');

  sdc.timing('File.S3Bucket.DeleteFile.Time');
  sdc.timing('File.S3Bucket.CreateFile.Time');


//******************* ANSWER APIs *******************

sdc.timing('Answer.Create.ApiTime');
sdc.timing('Answer.Update.ApiTime');
sdc.timing('Answer.View.ApiTime');
sdc.timing('Answer.ViewById.ApiTime');
sdc.timing('Answer.Delete.ApiTime');

sdc.timing('Answer.Create.DbQueryTime');
sdc.timing('Answer.Update.DbQueryTime');
sdc.timing('Answer.View.DbQueryTime');
sdc.timing('Answer.ViewById.DbQueryTime');
sdc.timing('Answer.Delete.DbQueryTime');

sdc.increment('Answer.Create.ApiCount');
sdc.increment('Answer.Update.ApiCount');
sdc.increment('Answer.View.ApiCount');
sdc.increment('Answer.Delete.ApiCount');
sdc.increment('Answer.ViewById.ApiCount');

  module.exports = sdc;

  
