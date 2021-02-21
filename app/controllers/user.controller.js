const db = require("../models");
const TRANSLATE = require("../translate/fr.json");
const User = db.user;

const log = require("./log.controller.js");
const insulinProtocol = require("./insulinProtocol.controller.js");
const parameter = require("./parameter.controller.js");
const parameterAccount = require("./parameterAccount.controller.js");

var jwt = require("jsonwebtoken");
var passwordHash = require('password-hash');

/**
 * @module setUser
 * @description Création d'un utilisateur
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {Object} req Récupération des paramètres envoyés
 * @param  {Object} res Réponse de la requête
 * @return {Object}     Retourne l'utilisateur créé
 */
exports.setUser = (req, res) => {
  const body = req.body;
  if (!body.firstname || !body.lastname || !body.login || !body.password || !body.mail || !body.passwordConfirm) {
    res.status(400).send({ message: TRANSLATE.API.ERROR.NEED_ELEMENT });
    return;
  }

  if (body.password != body.passwordConfirm) {
    res.status(400).send({ message: TRANSLATE.API.ERROR.PASSWORD_CONFIRM });
    return;
  }

  const hashedPassword = passwordHash.generate(body.password);

  const user = new User({
    firstname: body.firstname,
    lastname: body.lastname,
    mail: body.mail,
    birthday: body.birthday ? body.birthday : null,
    login: body.login,
    password: hashedPassword,
    role: 'user',
    active: true,
    myAnalysis: []
  });

  user
    .save(user)
    .then(data => {
      insulinProtocol.setInsulinProtocol(data._id);
      parameter.setParameter(data._id);
      parameterAccount.setParameterAccount(data._id);
      log.setLog("setUser", "user.controller.js", data._id, true);
      res.status(200).send({ message: TRANSLATE.API.SUCCESS.ADD_USER });
    })
    .catch(err => {
      log.setLog("setUser", "user.controller.js", user._id, false);
      res.status(503).send({
        message: err.message || TRANSLATE.API.ERROR.ADD_USER
      });
    });
};

/**
 * @module findAllUsers
 * @description Chercher tous les utilisateurs (ADMIN)
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {Object} req Paramètres envoyés
 * @param  {Object} res Réponse de la requête
 * @return {Object[]}   Retourne la liste de tous les utilisateurs
 */
exports.findAllUsers = (req, res) => {

  var condition = {active: true};

  User.find(condition)
    .then(data => {
      if (data && data.length > 0) {
        data.forEach(d => {
          delete d.password;
        });
        res.status(200).send(data);
      } else {
        res.status(404).send({
          message: TRANSLATE.API.ERROR.USERS_NOT_FOUND
        });
      }

    })
    .catch(err => {
      res.status(503).send({
        message: err.message || TRANSLATE.API.ERROR.FIND_ALL
      });
    });
};

/**
 * @description Récupération des informations d'un utilisateur
 * @module findOneUser
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {Object} req Paramètres envoyés
 * @param  {Object} res Réponse de la requête
 * @return {Object}     Retourne un utilisateur
 */
exports.findOneUser = (req, res) => {

  const id = req.params.id;

  User.findById(id)
    .then(data => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).send({
          message: TRANSLATE.API.ERROR.USER_NOT_FOUND
        });
      }
    })
    .catch(err => {
      res.status(503).send({
        message: err.message || TRANSLATE.API.ERROR.FIND_ONE
      })
    });

};

/**
 * @description Modification de l'utilisateur
 * @module updateUser
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {Object} req Paramètres envoyés
 * @param  {Object} res Réponse de la requête
 * @return {Object}     Retourne un code 200
 */
exports.updateUser = (req, res) => {
  if (!req.body) {
    res.status(405).send({
      message: TRANSLATE.API.ERROR.EMPTY_UPDATE
    });
  }

  if (req.body.password) {
    delete req.body.password;
  }

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (data) {
        log.setLog("updateUser", "user.controller.js", data._id, true);
        res.status(200).send({
          message: TRANSLATE.API.SUCCESS.MODIFY_USER
        });
      } else {
        log.setLog("updateUser", "user.controller.js", id, false);
        res.status(404).send({
          message: TRANSLATE.API.ERROR.MODIFY_USER
        });
      }
    })
    .catch(err => {
      log.setLog("updateUser", "user.controller.js", id, false);
      res.status(503).send({
        message: err.message || TRANSLATE.API.ERROR.UPDATE
      });
    });
};

/**
 * @description Suppression d'un utilisateur
 * @module deleteUser
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {Object} req Paramètres envoyés
 * @param  {Object} res Réponse de la requête
 * @return {Object}     Retroune un code 200
 */
exports.deleteUser = (req, res) => {
  const id = req.params.id;
  const option = {active: false}

  User.findByIdAndUpdate(id, option, { useFindAndModify: false })
    .then(data => {
      if (data) {
        log.setLog("deleteUser", "user.controller.js", data._id, true);
        res.status(200).send({
          message: TRANSLATE.API.SUCCESS.DELETE_USER
        });
      } else {
        log.setLog("deleteUser", "user.controller.js", id, false);
        res.status(404).send({
          message: TRANSLATE.API.ERROR.DELETE_USER
        });
      }
    })
    .catch(err => {
      log.setLog("deleteUser", "user.controller.js", id, false);
      res.status(503).send({
        message: err.message || TRANSLATE.API.ERROR.DELETE
      });
    });
};

/**
 * @description Modification du mot de passe
 * @module changePasswordUser
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {Object} req Paramètres envoyés
 * @param  {Object} res Réponse de la requête
 * @return {Object}     Retourne un code 200
 */
exports.changePasswordUser = (req, res) => {
  if (!req.body || !req.body.passwordNew || !req.body.passwordConfirm || !req.body.passwordOld) {
    res.status(405).send({
      message: TRANSLATE.API.ERROR.EMPTY_UPDATE
    });
  }

  if (req.body.passwordNew != req.body.passwordConfirm ) {
    res.status(400).send({
      message: TRANSLATE.API.ERROR.EMPTY_UPDATE
    });
  }

  const id = req.params.id;

  const changePassword = {
    password: passwordHash.generate(req.body.passwordNew)
  };

  User.findByIdAndUpdate(id, changePassword, { useFindAndModify: false })
    .then(data => {
      if (data) {
        log.setLog("changePasswordUser", "user.controller.js", data._id, true);
        res.status(200).send({
          message: TRANSLATE.API.SUCCESS.PASSWORD_CHANGE
        });
      } else {
        log.setLog("changePasswordUser", "user.controller.js", id, false);
        res.status(404).send({
          message: TRANSLATE.API.ERROR.MODIFY_USER
        });
      }
    })
    .catch(err => {
      log.setLog("changePasswordUser", "user.controller.js", id, false);
      res.status(503).send({
        message: err.message || TRANSLATE.API.ERROR.UPDATE
      });
    });


};
