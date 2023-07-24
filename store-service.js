const fs = require("fs");
const handlebars = require('handlebars');
const Sequelize = require('sequelize');
const helpers = require('./handlebars-helpers');

handlebars.registerHelper(helpers);

const sequelize = new Sequelize('jgygufri', 'jgygufri', 'vWnjpS7vydomOTcW3JAYIzhWXu_EcJuC', {
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

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Models synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
})();

module.exports.deletePostById = (id) => {
  return Item.destroy({
    where: {
      id: id
    }
  });
};

module.exports.initialize = () => {
  return sequelize.sync();
};

module.exports.getAllItems = () => {
  return Item.findAll();
};

module.exports.getItemsByCategory = (category) => {
  return Item.findAll({
    where: {
      category: category
    }
  });
};

module.exports.getItemsByMinDate = (minDateStr) => {
  const { Op } = Sequelize;
  return Item.findAll({
    where: {
      postDate: {
        [Op.gte]: new Date(minDateStr)
      }
    }
  });
};

module.exports.getItemById = (id) => {
  return Item.findByPk(id);
  };

module.exports.addItem = (itemData) => {
  itemData.published = itemData.published ? true : false;
  for (let key in itemData) {
    if (itemData.hasOwnProperty(key) && itemData[key] === "") {
      itemData[key] = null;
    }
  }
  itemData.postDate = new Date();
  return Item.create(itemData);
};

module.exports.getPublishedItems = () => {
  return Item.findAll({
    where: {
      published: true
    }
  });
};

module.exports.getPublishedItemsByCategory = (category) => {
  return Item.findAll({
    where: {
      published: true,
      category: category
    }
  });
};

module.exports.getCategories = () => {
  return Category.findAll();
};
module.exports.addCategory = (categoryData) => {
  for (let key in categoryData) {
    if (categoryData.hasOwnProperty(key) && categoryData[key] === "") {
      categoryData[key] = null;
    }
  }
  return Category.create(categoryData);
};

module.exports.deleteCategoryById = (id) => {
  return Category.destroy({
    where: {
      id: id
    }
  });
};

module.exports.deletePostById = (id) => {
  return Item.destroy({
    where: {
      id: id
    }
  });
};