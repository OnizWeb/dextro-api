module.exports = app => {

  const parameterAccount = require("../controllers/parameterAccount.controller.js");
  const { authJwt } = require("../middlewares");

  var router = require('express').Router();

  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/users/:idUser", [authJwt.verifyToken], parameterAccount.getParameterAccount);
  router.put("/:id", [authJwt.verifyToken], parameterAccount.updateParameterAccount);

  app.use('/api/parameterAccount', router);
};
