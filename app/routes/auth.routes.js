module.exports = app => {

  const auth = require("../controllers/auth.controller.js");

  var router = require('express').Router();

  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post("/signin", auth.signin);

  app.use('/api/auth', router);
};
