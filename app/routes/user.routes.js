module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const { verifySignUp, authJwt, verifyUpdate } = require("../middlewares");

  var router = require('express').Router();

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-type, Accept"
    );
    next();
  });

  // Mettre l'ensemble des routes pour les utilisateurs
  router.post('/', [verifySignUp.checkDuplicateLoginOrEmail], users.setUser);
  router.get('/', [authJwt.verifyToken], users.findAllUsers);
  router.get('/:id', [authJwt.verifyToken], users.findOneUser);
  router.put('/:id', [authJwt.verifyToken], users.updateUser);
  router.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], users.deleteUser);
  router.post('/changePassword/:id', [authJwt.verifyToken, verifyUpdate.checkOldPasswordBeforeChange], users.changePasswordUser);

  app.use('/api/users', router);
}
