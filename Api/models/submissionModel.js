const { DataTypes } = require('sequelize');
const sequelize = require('../config/databaseConfig.js');

const submission = sequelize.define("submissions", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        readOnly: true
    },
    assignment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        readOnly: true
    },
    submission_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        },
        readOnly: true
    },
    submission_date: {
        type: DataTypes.DATE,
        allowNull: false,
        readOnly: true
    },
    submission_updated: {
        type: DataTypes.DATE,
        allowNull: false,
        readOnly: true
    },
    submission_attempt: {
        type: DataTypes.INTEGER,
        defaultValue: 0, 
        allowNull: false
        
    }
}, {
    timestamps: false
});

module.exports = submission;
