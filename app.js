const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require("./app/models");

const app = express();

const PORT = process.env.PORT || 3201;

var allowlist = ['http://localhost:4200', 'https://web.postman.co', 'http://localhost'];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
}

app.use(cors(corsOptionsDelegate));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

db.mongoose
  .connect(db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connexion à la base de données réussie');
  })
  .catch(err => {
    console.log('Impossible de se connecter à la base de données', err);
    process.exit();
  });

app.get('/', (req, res) => {
  res.json({ message: 'ApiREST de Dextro fonctionnelle' });
});

require("./app/routes/user.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/analysis.routes")(app);
require("./app/routes/parameter.routes")(app);
require("./app/routes/parameterAccount.routes")(app);

app.listen(PORT, () => {
  console.log(`Serveur tourne sur le port ${PORT}`);
});
