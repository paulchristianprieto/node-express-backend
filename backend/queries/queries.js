const { ApolloServer, gql } = require("apollo-server-express");
const { GraphQLDateTime } = require("graphql-iso-date");
const moment = require("moment");
const uuid = require("uuid/v1");
const fs = require("fs");

// mongoose models. Import your models here.
const Member = require("../models/Member");
const Booking = require("../models/Booking");
const Movie = require("../models/Movie");
const Showtime = require("../models/Showtime");

// Better to Delete all contents and try to recreate it using your own data.
// Just follow the syntax

const customScalarResolver = {
	Date: GraphQLDateTime
};

const typeDefs = gql`
	# this is a comment
	# the type query is the root of all GraphQL queries
	# this is used for executing GET requests

	#define your schemas

	#create schema for date to use it
	scalar Date

	#To make this work you need to create Models and import it above.

	type MemberType {
		id: ID
		firstName: String!
		lastName: String!
		position: String!
		teamID: ID!
		password: String
		username: String
	}

	type MovieType {
		id: ID
		title: String!
		duration: Int!
		description: String!
		showtimes: [ShowtimeType]
		imageLocation: String
		price: Int!
	}

	type BookingType {
		id: ID
		name: String!
		ticket_count: Int!
		email: String!
		payment_method: String!
		total: Int!
		status: String!
		movieId: ID!
		showtimeId: ID!
		showtime: ShowtimeType
		movie: MovieType
		createdAt: Date
	}

	type ShowtimeType {
		id: ID
		movieId: ID!
		movie: MovieType
		datetime: Date
		cinema: String
	}

	#define our CRUD
	#R - Retrieve. SYNTAX:

	type Query {
		#create a your queries and their return value

		#sample
		getMembers: [MemberType]
		getMovies: [MovieType]
		getBookings: [BookingType]

		#retrieving single item/member
		getMember(id: ID!, name: String): MemberType
		getMovie(id: ID!): MovieType
		getBooking(id: ID!): BookingType

		getShowtimes(movieId: ID!): [ShowtimeType]
		getShowtime(id: ID!): ShowtimeType

		getNowShowing(date: Date!): [ShowtimeType]

		filterBookings(filter: String): [BookingType]
	}

	#C - Create, U - update, D - Delete. SYNTAX:

	type Mutation {
		#Sample for create mutation:
		createMember(
			firstName: String!
			lastName: String!
			position: String!
			teamID: ID
			username: String!
			password: String!
		): MemberType

		createMovie(
			title: String!
			duration: Int!
			description: String!
			price: Int!
			imageLocation: String
		): MovieType

		createShowtime(
			movieId: ID!
			datetime: Date!
			cinema: String
		): ShowtimeType

		createBooking(
			name: String!
			ticket_count: Int!
			email: String!
			payment_method: String
			total: Int!
			status: String
			movieId: ID!
			showtimeId: ID!
		): BookingType

		#Sample for update mutation:
		updateMember(
			id: ID!
			firstName: String!
			lastName: String!
			position: String!
			username: String!
			teamID: ID
			password: String!
		): MemberType

		updateMovie(
			id: ID!
			title: String!
			duration: Int!
			description: String!
			showtimes: [Date]
			price: Int!
		): MovieType

		updateShowtime(
			id: ID!
			movieId: ID!
			datetime: Date!
			cinema: String
		): ShowtimeType

		updateBooking(
			id: ID!
			name: String!
			ticket_count: Int!
			email: String!
			payment_method: String!
			total: Int!
			status: String!
			movieId: ID!
		): BookingType

		#Sample for deleting:
		deleteMember(id: ID!): Boolean
		deleteMovie(id: ID!): Boolean
		deleteBooking(id: ID!): Boolean
		deleteShowtime(id: ID!): Boolean

		#Sample for custom mutations:
		logInMember(username: String!, password: String!): MemberType
		getNowShowing2(date: Date!): [ShowtimeType]

		updateBookingStatus(id: ID!, status: String!): BookingType
		incrementTicketCount(id: ID!): BookingType
		decrementTicketCount(id: ID!): BookingType
	}
`;

// Sample resolver
const resolvers = {
	// resolver are what are we going to return when the query is executed

	// Include queries inside Query
	Query: {
		// Sample Query
		getMembers: () => {
			return Member.find({});
		},

		getMember: (_, args) => {
			return Member.findById(args.id);
		},

		getMovies: () => {
			return Movie.find({});
		},

		getMovie: (_, args) => {
			return Movie.findById(args.id);
		},

		getBookings: () => {
			return Booking.find({});
		},

		getBooking: (_, args) => {
			return Booking.findById(args.id);
		},

		getShowtimes: (_, args) => {
			return Showtime.find({ movieId: args.movieId });
		},

		getShowtime: (_, args) => {
			return Showtime.findById(args.id);
		},

		getNowShowing: (_, args) => {
			console.log("HELLO");
			console.log(args.date);

			const today = moment(args.date)
				.startOf("day")
				.toDate();
			console.log(today);

			const end = moment(args.date)
				.endOf("day")
				.toDate();

			return Showtime.find({
				datetime: { $gte: today, $lte: end }
			});
		},

		filterBookings: (parent, args, context, info) => {
			// const where = args.filter;
			// {
			// 	status_contains: args.filter;
			// }
			console.log(args);

			if (args.filter === "all") {
				return Booking.find({});
			}

			return Booking.find({
				status: args.filter
			});
		}
	},

	// Include mutations inside Mutation
	Mutation: {
		// Sample Mutation
		createMember: (_, args) => {
			let newMember = new Member({
				firstName: args.firstName,
				lastName: args.lastName,
				position: args.position,
				teamID: args.teamID,
				//Syntax: bcrypt(plain password, salt rounds)
				password: bcrypt.hashSync(args.password, 10),
				username: args.username
			});

			console.log("Creating a member...");
			console.log(args);
			return newMember.save();
		},

		createShowtime: (_, args) => {
			let newShowtime = new Showtime({
				movieId: args.movieId,
				datetime: args.datetime,
				cinema: args.cinema
			});

			console.log("Creating showtime...");
			console.log(args);
			return newShowtime.save();
		},

		createMovie: (_, args) => {
			let imageString = args.imageLocation;

			let imageBase = imageString.split(";base64,").pop();
			console.log(imageBase);

			let imageLocation = "images/" + uuid() + ".png";

			fs.writeFile(
				imageLocation,
				imageBase,
				{ encoding: "base64" },
				err => {}
			);

			let newMovie = new Movie({
				title: args.title,
				duration: args.duration,
				description: args.description,
				showtimes: args.showtimes,
				price: args.price,
				imageLocation: imageLocation
			});

			console.log("Creating a movie...");
			console.log(args);

			return newMovie.save();
		},

		createBooking: (_, args) => {
			let newBooking = new Booking({
				name: args.name,
				ticket_count: args.ticket_count,
				email: args.email,
				payment_method: "cash",
				total: args.total,
				status: "pending",
				movieId: args.movieId,
				showtimeId: args.showtimeId
			});

			console.log("Creating a booking...");
			console.log(args);
			return newBooking.save();
		},

		updateMember: (_, args) => {
			console.log("Updating member info...");
			console.log(args);

			let condition = { _id: args.id };
			let updates = {
				firstName: args.firstName,
				lastName: args.lastName,
				position: args.position,
				teamID: args.teamID,
				password: args.password,
				username: args.username
			};

			return Member.findOneAndUpdate(condition, updates);
		},

		updateShowtime: (_, args) => {
			console.log("Updating showtime...");
			console.log(args);

			let condition = { _id: args.id };
			let updates = {
				datetime: args.datetime,
				cinema: args.cinema
			};

			return Showtime.findOneAndUpdate(condition, updates);
		},

		updateMovie: (_, args) => {
			console.log("Updating movie info...");
			console.log(args);

			let condition = { _id: args.id };
			let updates = {
				title: args.title,
				duration: args.duration,
				description: args.description,
				showtimes: args.showtimes,
				price: args.price
			};

			return Movie.findOneAndUpdate(condition, updates);
		},

		updateBooking: (_, args) => {
			console.log("Updating booking info...");
			console.log(args);

			let condition = { _id: args.id };
			let updates = {
				name: args.name,
				ticket_count: args.ticket_count,
				email: args.email,
				payment_method: args.payment_method,
				total: args.total,
				status: args.status,
				movieId: args.movieId
			};

			return Booking.findOneAndUpdate(condition, updates);
		},

		deleteMember: (_, args) => {
			console.log("Deleting Member...");
			console.log(args);

			return Member.findByIdAndDelete(args.id).then((member, err) => {
				console.log(err);
				console.log(member);

				if (err || !member) {
					console.log("delete failed.");
					return false;
				}

				console.log("Member deleted");
				return true;
			});
		},

		deleteShowtime: (_, args) => {
			console.log("Deleting showtime...");
			console.log(args);

			return Showtime.findByIdAndDelete(args.id).then((showtime, err) => {
				console.log(err);
				console.log(showtime);

				if (err || !showtime) {
					console.log("delete failed.");
					return false;
				}

				console.log("Showtime deleted");
				return true;
			});
		},

		deleteMovie: (_, args) => {
			console.log("Deleting movie...");
			console.log(args);

			return Movie.findByIdAndDelete(args.id).then((member, err) => {
				console.log(err);
				console.log(member);

				if (err || !member) {
					console.log("Delete failed.");
					return false;
				}

				console.log("Movie deleted");
				return true;
			});
		},

		deleteBooking: (_, args) => {
			console.log("Deleting booking...");
			console.log(args);

			return Booking.findByIdAndDelete(args.id).then((member, err) => {
				console.log(err);
				console.log(member);

				if (err || !member) {
					console.log("Delete failed.");
					return false;
				}

				console.log("Booking deleted");
				return true;
			});
		},

		getNowShowing2: (_, args) => {
			const today = moment(args.date)
				.startOf("day")
				.toDate();

			const end = moment(args.date)
				.endOf("day")
				.toDate();

			return Showtime.find({
				datetime: { $gte: today, $lte: end }
			});
		},

		updateBookingStatus: (_, args) => {
			console.log("Updating booking status...");
			console.log(args);

			let condition = { _id: args.id };
			let updates = {
				status: args.status
			};

			return Booking.findOneAndUpdate(condition, updates);
		},

		incrementTicketCount: (_, args) => {
			console.log("Adding ticket...");
			console.log(args);

			return Booking.findById(args.id).then(booking => {
				console.log(booking);
				let newTicketCount = booking.ticket_count + 1;
				let ticketPrice = booking.total / booking.ticket_count;
				let condition = { _id: args.id };
				let updates = {
					ticket_count: newTicketCount,
					total: ticketPrice * newTicketCount
				};
				return Booking.findOneAndUpdate(condition, updates);
			});
		},

		decrementTicketCount: (_, args) => {
			console.log("Decreasing ticket...");
			console.log(args);

			return Booking.findById(args.id).then(booking => {
				let newTicketCount = booking.ticket_count;
				if (booking.ticket_count > 1)
					newTicketCount = booking.ticket_count - 1;
				let ticketPrice = booking.total / booking.ticket_count;
				let condition = { _id: args.id };
				let updates = {
					ticket_count: newTicketCount,
					total: ticketPrice * newTicketCount
				};
				return Booking.findOneAndUpdate(condition, updates);
			});
		}
	},

	// custom resolvers. (you can have many)
	// MemberType : {
	// 	// Sample resolver
	// 	team : (parent, args) => {
	// 		console.log(parent)
	// 		return Team.findById(parent.teamID)
	// 	}
	// }
	// TeamType: {
	// declare a resolver for the tasks field inside TeamType
	// 	tasks: (parent, args) => {
	// 		console.log("getting the tasks assigned for this team..");
	// 		console.log(parent.id);
	// 		return Task.find({ teamId: parent.id });
	// 	}
	// },
	BookingType: {
		movie: (parent, args) => {
			return Movie.findById(parent.movieId);
		},

		showtime: (parent, args) => {
			return Showtime.findById(parent.showtimeId);
		}
	},

	MovieType: {
		showtimes: (parent, args) => {
			return Showtime.find({ movieId: parent.id });
		}
	},

	ShowtimeType: {
		movie: (parent, args) => {
			return Movie.findById(parent.movieId);
		}
	}
};

// Pass the typedefs and resolvers to a variable
// This will be used to communicate with App.js
const server = new ApolloServer({
	typeDefs,
	resolvers
});

module.exports = server;
