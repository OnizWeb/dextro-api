const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.user = require("./user.model.js")(mongoose);
db.analysis = require("./analysis.model.js")(mongoose);
db.insulinProtocol = require("./insulinProtocol.model.js")(mongoose);
db.log = require("./log.model.js")(mongoose);
db.parameterAccount = require("./parameterAccount.model.js")(mongoose);
db.parameter = require("./parameter.model.js")(mongoose);

module.exports = db;
