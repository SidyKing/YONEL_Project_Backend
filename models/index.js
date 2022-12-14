const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: "8889",

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});


//notre base de données
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Definir les tables de la base de données
db.agence = require("../models/agence.model")(sequelize, Sequelize);
db.balance = require("../models/balance.model")(sequelize, Sequelize);
db.client = require("../models/client.model")(sequelize, Sequelize);
db.devise = require("../models/devise.model")(sequelize, Sequelize);
db.paiement = require("../models/paiement.model")(sequelize, Sequelize);
db.pays = require("../models/pays.model")(sequelize, Sequelize);
db.sousAgence = require("../models/sous_agence.model")(sequelize, Sequelize);
db.transaction = require("../models/transaction.model")(sequelize, Sequelize);
db.user = require("../models/user.model")(sequelize, Sequelize);
db.ville = require("../models/ville.model")(sequelize, Sequelize);

//relation agence - sousAgence
db.sousAgence.belongsTo(db.agence);

//relation sousAgence - user
db.user.belongsTo(db.sousAgence);

//relation user - transaction
db.transaction.belongsTo(db.user);

//relation balance - agence
db.balance.belongsTo(db.agence);

//relation pays - ville
db.ville.belongsTo(db.pays);

//relation sousAgence - ville
db.sousAgence.belongsTo(db.ville);

//relation pays - devise
db.devise.belongsTo(db.pays);

//relation paiement - transaction
db.paiement.belongsTo(db.transaction);


//relation transaction - client
db.transaction.belongsTo(db.client, {
  as: 'emetteur'
});
db.transaction.belongsTo(db.client, {
  as: 'recepteur'
});

//relation transaction - devise
db.transaction.belongsTo(db.devise, {
  as: 'devise_origine'
});
db.transaction.belongsTo(db.devise, {
  as: 'devise_destination'
});


module.exports = db;