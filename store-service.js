const fs = require("fs");
const handlebars = require('handlebars');
const Sequelize = require('sequelize');
const helpers = require('./handlebars-helpers');

handlebars.registerHelper(helpers);

const sequelize = new Sequelize('ceowxqjs', 'ceowxqjs', 'tmTn53kZqBI5ve5Sq_ZS-4p65ih0rTj0', {
  host: 'mahmud.db.elephantsql.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false }
  },
  query: { raw: true }
});

const Category = sequelize.define('Category', {
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Item = sequelize.define('Item', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  postDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  featureImage: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  published: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
});

Item.belongsTo(Category, { foreignKey: 'category' });

// Initialize function to sync database models
const initialize = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Models synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
};

// Export the sequelize instance, models, and the initialize function
module.exports = {
  sequelize,
  Category,
  Item,
  initialize, // Export the initialize function
};
