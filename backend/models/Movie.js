const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		duration: {
			type: Number,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		showtimes: {
			type: [Date],
			required: false
		},
		price: {
			type: Number,
			required: true
		},
		imageLocation: {
			type: String,
			required: false
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Movie", movieSchema);
