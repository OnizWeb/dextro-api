const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const TRANSLATE = require("../translate/fr.json");
const db = require("../models");
const User = db.user;

/**
 * @function verifyToken
 * @description Vérification la validité du token
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {Object} req Argument de demande HTTP
 * @param  {Object} res Argument de réponse HTTP
 * @param  {Object} next argument de rappel
 * @return valide ou non la validité du token
 */
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers['authorization'];

  if (!token) {
    return res.status(403).send({
      message: TRANSLATE.API.TOKEN.NO_TOKEN
    });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: TRANSLATE.API.TOKEN.UNAUTHORIZED
      });
    }

    req.userId = decoded.id;

    next();
  });
};

/**
 * @function isAdmin
 * @description Vérification si l'utilisateur est admin
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {Object} req Argument de demande HTTP
 * @param  {Object} res Argument de réponse HTTP
 * @param  {Object} next argument de rappel
 * @return valide ou non le role d'admin d'un utilisateur
 */
isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(503).send({
        message: TRANSLATE.API.ERROR.USER_NOT_FOUND
      });
      return;
    }

    if (user.role === 'admin') {
      next();
      return;
    }

    res.status(403).send({
      message: TRANSLATE.API.ADMIN.NOT_ADMIN
    });
    return;
  });
};

const authJwt = {
  verifyToken,
  isAdmin
};

module.exports = authJwt;
