const db = require("../models");
const TRANSLATE = require("../translate/fr.json");
const User = db.user;

var passwordHash = require('password-hash');

/**
 * @function checkOldPasswordBeforeChange
 * @description Vérification de l'ancien mot de passe
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {Object} req Argument de demande HTTP
 * @param  {Object} res Argument de réponse HTTP
 * @param  {Object} next argument de rappel
 * @return valide ou non l'équivalence     
 */
checkOldPasswordBeforeChange = (req, res, next) => {
  if (!req.body || !req.body.passwordOld) {
    res.status(400).send({ message: TRANSLATE.API.ERROR.OLD_PASSWORD });
    return;
  }

  const id = req.params.id;

  User.findById(id).exec((err, user) => {
    if (err) {
      res.status(400).send({ message: TRANSLATE.API.ERROR.USER_NOT_FOUND });
      return;
    }

    if (user) {
      var passwordIsValid = passwordHash.verify(req.body.passwordOld, user.password);

      if (!passwordIsValid) {
        res.status(404).send({ message: TRANSLATE.API.ERROR.OLD_PASSWORD_VERIFY });
        return;
      } else {
        next();
      }
    }
  });
};

const verifyUpdate = {
  checkOldPasswordBeforeChange
};

module.exports = verifyUpdate;
