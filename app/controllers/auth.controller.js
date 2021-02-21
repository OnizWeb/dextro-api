const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const TRANSLATE = require("../translate/fr.json");

var jwt = require("jsonwebtoken");
var passwordHash = require("password-hash");

/**
 * @description Connexion d'un utilisateur
 * @module signin
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {Object} req Paramètres envoyés
 * @param  {Object} res Réponse de la requête
 * @return {Object}     Retroune un token valide et informations importante de l'utilisateur
 */
exports.signin = (req, res) => {
  User.findOne({
    login: req.body.login
  }).exec((err, user) => {
    if (err) {
      res.status(503).send({
        message: err || TRANSLATE.API.ERROR.CONNEXION_FAILED
      });
      return;
    }

    if (!user) {
      return res.status(404).send({
        message: TRANSLATE.API.ERROR.CONNEXION_USER_FAILED
      });
    }

    var passwordIsValid = passwordHash.verify(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: TRANSLATE.API.ERROR.CONNEXION_PASSWORD_FAILED
      });
    }

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 3600 // 60 minutes
    });

    res.status(200).send({
      accessToken: token,
      data: user
    });
  });
};
