'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Course extends Model {
		static associate(models) {
			// One-to-one association (belongs to User)
			Course.belongsTo(models.User, {
				foreignKey: 'userId'
			});
		}
	}
	
	Course.init({
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: { msg: 'Title is required' },
				notEmpty: { msg: 'Please provide a title' }
			}
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notNull: { msg: 'Description is required' },
				notEmpty: { msg: 'Please provide a desciption' }
			}
		},
		estimatedTime: DataTypes.STRING,
		materialsNeeded: DataTypes.STRING,
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		sequelize,
		modelName: 'Course',
	});
	
	return Course;
};
