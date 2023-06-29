const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const PORT = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.use(require('./routes/user.routes.js'))
app.use(require('./routes/task.routes.js'))


app.listen(3000, () => {
    console.log(`server run in http://localhost:${PORT}`)
});