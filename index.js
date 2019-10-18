const express = require('express')
const app = express()
const cron = require('node-cron')
const port = process.env.PORT || 3000;


const routes = require('./routes/pricesRoutes');
routes.routes(app);


// cron.schedule("* * * * * * *", function() {
 
//     console.log("dddd");
//   });

// cron.schedule("* * * * * *", function() {
//     console.log("running a task every second");
// });

app.listen(port, () => console.log(`listening on port ${port}!`))