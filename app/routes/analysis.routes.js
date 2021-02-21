module.exports = app => {

  const analysis = require("../controllers/analysis.controller.js");
  const { authJwt } = require("../middlewares");

  var router = require('express').Router();

  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/allAnalysisUser/:idUser", [authJwt.verifyToken], analysis.getAllAnalysis);
  router.get("/:id", [authJwt.verifyToken], analysis.getAnalysis);
  router.post("/users/:id", [authJwt.verifyToken], analysis.setAnalysis);
  router.put("/:id", [authJwt.verifyToken], analysis.updateAnalysis);
  router.delete("/:id", [authJwt.verifyToken], analysis.deleteAnalysis);

  app.use('/api/analysis/', router);
};
