module.exports = app => {

  const insulinProtocol = require("../controllers/insulinProtocol.controller.js");
  const { authJwt } = require("../middlewares");

  var router = require('express').Router();

  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/users/:idUser", [authJwt.verifyToken], insulinProtocol.getInsulinProtocol);
  router.put("/:id", [authJwt.verifyToken], insulinProtocol.updateInsulinProtocol);

  app.use('/api/insulinProtocols', router);
};
