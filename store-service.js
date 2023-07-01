const fs = require("fs");
const handlebars = require('handlebars');


let items = [];
let categories = [];
function escapeHTML(html) {
  if (html === undefined || html === null) {
    return '';
  }
  return html
  .toString()
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
}
handlebars.registerHelper('safeHTML', function (content) {
  return new handlebars.SafeString(escapeHTML(content));
});
module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/items.json", "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        items = JSON.parse(data);
        fs.readFile("./data/categories.json", "utf8", (err, data) => {
          if (err) {
            reject(err);
          } else {
            categories = JSON.parse(data);
            resolve();
          }
        });
      }
    });
  });
};

module.exports.getAllItems = () => {
  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      reject("Items array is empty");
    } else {
      resolve(items);
    }
  });
};
module.exports.getPublishedItems = () => {
  return new Promise((resolve, reject) => {
    let pubItems = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].published == true) {
        pubItems.push(items[i]);
      }
    }
    if (pubItems.length == 0) {
      reject("No published items");
    } else {
      resolve(pubItems);
    }
  });
};

module.exports.getPublishedItemsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    let pubItemsByCategory = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].published == true && items[i].category == category) {
        pubItemsByCategory.push(items[i]);
      }
    }
    if (pubItemsByCategory.length == 0) {
      reject("No published items in the specified category");
    } else {
      resolve(pubItemsByCategory);
    }
  });
};

module.exports.getCategories = () => {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject("Categories array is empty");
    } else {
      resolve(categories);
    }
  });
};

module.exports.addItem = (itemData) => {
  return new Promise((resolve, reject) => {
    itemData.published = itemData.published === undefined ? false : true;
    itemData.id = items.length + 1;
    items.push(itemData);
    resolve(itemData);
  });
};

module.exports.getItemsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    const filteredItems = items.filter((item) => item.category === category);
    if (filteredItems.length === 0) {
      reject("No results returned");
    } else {
      resolve(filteredItems);
    }
  });
};

module.exports.getItemById = (id) => {
  return new Promise((resolve, reject) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      resolve(item);
    } else {
      reject("Item not found");
    }
  });
};

module.exports.getItemsByMinDate = (minDateStr) => {
  return new Promise((resolve, reject) => {
    const minDate = new Date(minDateStr);
    const filteredItems = items.filter(
      (item) => new Date(item.postDate) >= minDate
    );
    if (filteredItems.length === 0) {
      reject("No results returned");
    } else {
      resolve(filteredItems);
    }
  });
};
