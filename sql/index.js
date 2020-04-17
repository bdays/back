const fs = require('fs');
const path = require('path');
const procedure = require('./procedure');

module.exports = {
  procedure,
  getListBdays: fs.readFileSync(path.resolve(__dirname, 'getListBdays.sql')).toString(),
  getListUsers: fs.readFileSync(path.resolve(__dirname, 'getListUsers.sql')).toString(),
  getScheduleTemplates: fs.readFileSync(path.resolve(__dirname, 'getScheduleTemplates.sql')).toString(),
};
