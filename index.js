const express = require('express')
const app = express()
const cron = require('node-cron')
const port = process.env.PORT || 3000;
const admin = require('firebase-admin');
const serviceAccount = require('./bankpricesstore-firebase-cred.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const routes = require('./routes/pricesRoutes');
routes.routes(app);


cron.schedule("* * * * * *", function() {
    db.collection('banksprices').doc('banks ' + Math.random()).set({name: Math.random()}).then(() =>{
        console.log('in db alreadhy');
    });
  });

// cron.schedule("* * * * * *", function() {
//     console.log("running a task every second");
// });

app.listen(port, () => console.log(`listening on port ${port}!`))