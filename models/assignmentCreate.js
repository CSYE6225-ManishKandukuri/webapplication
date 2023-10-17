const { DataTypes, STRING } = require('sequelize');
const sequelize = require('../database.js');



const AssignmentCreator = sequelize.define('assignmentCreator', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId : {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    assignmentId : {
      type : DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    }
  })

  module.exports = AssignmentCreator;