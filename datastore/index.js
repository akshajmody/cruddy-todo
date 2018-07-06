const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////
 
exports.create = (text, callback) => {
  counter.getNextUniqueId(function(string) {
    var id = string;
    items[id] = text;
    
    fs.writeFile(`./datastore/data/${id}.txt`, text, (err) => {
      if (err) {
        throw ('error writing file');
      }
    });
    
    callback(null, {id: id, text: text});
    
  });
    
};

exports.readOne = (id, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, {id: id, text: item});
  }
};

exports.readAll = (callback) => {
  var data = [];
  // _.each(items, (item, idx) => {
  //   data.push({ id: idx, text: items[idx] });
  // });
  
  fs.readdir('./datastore/data/', function(err, files) {
    if (err) {
      throw ('error reading files');
    } else {
      files.forEach(function(fileName) {
        data.push({ id: fileName, text: fileName });
      });
      callback(null, data);
    }
  });
  
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, {id: id, text: text});
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
