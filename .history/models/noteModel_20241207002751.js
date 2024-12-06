import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const Note = db.define('notes', {
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'notes',
    freezeTableName: true
});

export default Note;
