const db = require("../models");
const TRANSLATE = require("../translate/fr.json");
const User = db.user;


/**
 * @function checkDuplicateLoginOrEmail
 * @description Vérification doublon login ou email
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {Object} req Argument de demande HTTP
 * @param  {Object} res Argument de réponse HTTP
 * @param  {Object} next argument de rappel
 * @return valide ou non la présence de doublon     
 */
checkDuplicateLoginOrEmail = (req, res, next) => {
  User.findOne({
    login: req.body.login
  }).exec((err, user) => {

    if (err) {
      res.status(503).send({
        message: TRANSLATE.API.ERROR.CHECK_EXIST
      });
      return;
    }

    if (user) {
      res.status(404).send({
        message: TRANSLATE.API.ERROR.USER_EXIST
      });
      return;
    }

    User.findOne({
      mail: req.body.mail
    }).exec((err, user) => {
      if (err) {
        res.status(503).send({
          message: TRANSLATE.API.ERROR.CHECK_EXIST
        });
        return;
      }

      if (user) {
        console.log('trouvé:', user);
        res.status(404).send({
          message: TRANSLATE.API.ERROR.MAIL_EXIST
        });
        return;
      }

      next();
    });
  });
};

const verifySignUp = {
  checkDuplicateLoginOrEmail
};

module.exports = verifySignUp;
