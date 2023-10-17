const { DataTypes, STRING } = require('sequelize');
const sequelize = require('../database.js');

const User = sequelize.define('accounts',{
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type : DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate : {
        isEmail : true,
      },
    },
    password: DataTypes.STRING,
    account_created: DataTypes.DATE,
    account_updated: DataTypes.DATE,
    //account_updated_1: DataTypes.DATE
  });

module.exports = User;