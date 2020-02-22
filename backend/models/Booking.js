const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		ticket_count: {
			type: Number,
			required: true
		},
		total: {
			type: Number,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		payment_method: {
			type: String,
			required: true
		},
		status: {
			type: String,
			required: true
		},
		movieId: {
			type: String,
			required: false
		},
		showtimeId: {
			type: String,
			required: false
		},
		createdAt: {
			type: Date,
			required: false
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Booking", bookingSchema);
