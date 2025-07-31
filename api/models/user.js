'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// One-to-many association
			User.hasMany(models.Course, {
				foreignKey: 'userId'
			});
		}
	}
	
	User.init({
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: { msg: 'First name is required' },
				notEmpty: { msg: 'Please provide your first name' }
			}
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: { msg: 'Last name is required' },
				notEmpty: { msg: 'Please provide your last name' }
			}
		},
		emailAddress: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true, // Extra credit
			validate: {
				notNull: { msg: 'Email address is required' },
				notEmpty: { msg: 'Please provide your Email address' },
				isEmail: { msg: 'Please provide a valid email address' } // Extra credit
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: { msg: 'A password is required' },
				notEmpty: { msg: 'Please provide a password' },
			}
		}
	}, {
		sequelize,
		modelName: 'User',
	});
	
	return User;
};
