//Sample Model

//Always import these two 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const memberSchema = new Schema(
	{	
		// list of types:
		// String
		// Number
		// Date
		// Buffer
		// Boolean
		// Mixed
		// ObjectId
		// Array
		// Decimal128
		// Map



		firstName: {
			type:String,
			required: true
			//lowercase: true // Always convert `test` to lowercase
		},
		lastName: {
			type: String,
			required: true
		},
		position: {
			type:String,
			required: true
			//Showtimes: [{ Title: String, date: Date }]
		},
		teamID: {
			type:String,
			required: false
		}, 
		password: {
			type:String,
			required: false
		},
		username: {
			type: String,
			required: false,
			unique: true
		}
	},
	{
		timestamps: true
	}
);



// Export Model and import it to your queries.js to use it
module.exports = mongoose.model("Member", memberSchema)