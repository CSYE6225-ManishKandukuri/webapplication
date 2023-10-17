const { DataTypes, STRING } = require('sequelize');
const sequelize = require('../database.js');


const Assignment = sequelize.define('assignments', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    points: DataTypes.STRING,
    num_of_attempts: DataTypes.INTEGER,
    deadline: DataTypes.DATE,
    assignment_created: DataTypes.DATE ,
    assignment_updated: DataTypes.DATE
})

module.exports = Assignment;

