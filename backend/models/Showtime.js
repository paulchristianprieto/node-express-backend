const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const showtimeSchema = new Schema(
	{
		movieId: {
			type: String,
			required: true
		},
		datetime: {
			type: Date,
			required: false
		},
		cinema: {
			type: String,
			required: false
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Showtime", showtimeSchema);
