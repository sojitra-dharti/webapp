var SDC = require('statsd-client'),
	sdc = new SDC({port: 8125});

  // Timing: sends a timing command with the specified milliseconds
  
  sdc.timing('User.Create.ApiTime');
  sdc.timing('User.Update.ApiTime');
  sdc.timing('User.View.ApiTime');
  sdc.timing('User.ViewById.ApiTime');

  sdc.timing('User.Create.DbQueryTime');
  sdc.timing('User.Update.DbQueryTime');
  sdc.timing('User.View.DbQueryTime');
  sdc.timing('User.ViewById.DbQueryTime');

  // Increment: Increments a stat by a value (default is 1)

  sdc.increment('User.Create.ApiCount');
  sdc.increment('User.Update.ApiCount');
  sdc.increment('User.View.ApiCount');
  sdc.increment('User.ViewById.ApiCount');

  module.exports = sdc;

  
