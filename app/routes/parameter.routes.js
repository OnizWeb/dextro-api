module.exports = app => {

  const parameter = require("../controllers/parameter.controller.js");
  const { authJwt } = require("../middlewares");

  var router = require('express').Router();

  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/users/:idUser", [authJwt.verifyToken], parameter.getParameter);
  router.put("/:id", [authJwt.verifyToken], parameter.updateParameter);

  app.use('/api/parameter', router);
};
