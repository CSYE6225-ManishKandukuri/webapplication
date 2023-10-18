//import { DataTypes } from 'sequelize';
//import { Sequelize } from 'sequelize';

const { DataTypes, STRING, Op } = require('sequelize');

const sequelize = require('../database.js');


function validatePoints(value)
{
  if (value < 1 || value > 100 )
  {
    throw new Error('Points must be from 1 to 100');
  }
  return true;
}

function validateAttempts(value)
{

  if (!Number.isInteger(value)) {
    throw new Error('num_of_attempts must be an integer');
  }
  else if (value < 1 || value > 100 )
  {
    throw new Error('Attempts must be from 1 to 100');
  }
  return true;
}


async function syncAndAlterTable(Model) {
  try {
    await Model.sync({ alter: true });
    console.log('Table altered successfully');
  } catch (error) {
    console.error(`Error altering table: ${Model}`, error);
  }
}




const User = sequelize.define('accounts',{
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    first_name: {
      type : DataTypes.STRING,
      allowNull:false
    },
    last_name: {
      type : DataTypes.STRING,
      allowNull:false
    },
    email: {
      type : DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate : {
        isEmail : true,
      },
    },
    password: {
      type : DataTypes.STRING,
      allowNull:false
    },
    account_created: DataTypes.DATE,
    account_updated: DataTypes.DATE,
    //accountNew: DataTypes.DATE,
  },{
    timestamps: false, // Disable timestamps
    createdAt: false,  // Disable createdAt
    updatedAt: false
  }); // Disable timestamps*/);

  syncAndAlterTable(User);

  const Assignment = sequelize.define('assignments', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type : DataTypes.STRING,
      allowNull:false
    },
    points: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate:{validatePoints}
    },
    num_of_attempts: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate: {validateAttempts}
    },
    deadline: {
      type : DataTypes.DATE,
      allowNull:false
    },
    assignment_created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Set the default value to the current timestamp
    },
    assignment_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
    });


  //   assignment_created: DataTypes.DATE ,
  //   assignment_updated: DataTypes.DATE,
  //   //assignment_delete: DataTypes.DATE,
  // },{
  //   timestamps: false, // Disable timestamps
  //   createdAt: false,  // Disable createdAt
  //   updatedAt: false
  // });


syncAndAlterTable(Assignment);

//Assignment.sync({alter:true});

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
  },
  //assignment_delete: DataTypes.DATE,
},{
  timestamps: false, // Disable timestamps
  createdAt: false,  // Disable createdAt
  updatedAt: false
})

syncAndAlterTable(AssignmentCreator);


module.exports = {
  User, 
  Assignment,
  AssignmentCreator
};