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
  
  
  
  fs.readFile(`./datastore/data/${id}`, (err, fileData) => {
    //console.log('filedata: ', fileData);
    if (err) {
      callback(null, 0);
    } else {
      if (!fileData) {
        callback(new Error(`No item with id: ${id}`));
      } else {   
        callback(null, {id: id, text: String(fileData)});
      }   
    }
  });  
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
  console.log('id', id);
  fs.writeFile(`./datastore/data/${id}`, text, (err) => {
    if (err) {
      throw ('error writing file');
    } else {
      callback(null, {id: id, text: text});
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(`./datastore/data/${id}`, (err) => {
    if (!id) {
      // report an error if item not found
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
