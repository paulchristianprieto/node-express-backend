import { gql } from "apollo-boost";

const getMoviesQuery = gql`
	{
		getMovies {
			id
			title
			duration
			description
			price
			imageLocation
			showtimes {
				id
				movieId
				datetime
				cinema
			}
		}
	}
`;

const getMovieQuery = gql`
	query($id: ID!) {
		getMovie(id: $id) {
			id
			title
			duration
			description
			price
			imageLocation
			showtimes {
				id
				movieId
				datetime
				cinema
			}
		}
	}
`;

const getShowtimeQuery = gql`
	query($id: ID!) {
		getShowtime(id: $id) {
			movieId
			datetime
			cinema
			id
		}
	}
`;

const getNowShowingQuery = gql`
	query($date: Date!) {
		getNowShowing(date: $date) {
			movieId
			datetime
			id
			movie {
				id
				title
				duration
				description
				imageLocation
				price
			}
		}
	}
`;

const getBookingsQuery = gql`
	{
		getBookings {
			id
			name
			ticket_count
			email
			total
			payment_method
			status
			movieId
			showtimeId
			movie {
				id
				title
				duration
				description
				imageLocation
				price
			}
			showtime {
				id
				datetime
			}
			createdAt
		}
	}
`;

const getBookingQuery = gql`
	query($id: ID!) {
		getBooking(id: $id) {
			id
			name
			ticket_count
			email
			payment_method
			total
			status
			movieId
			movie {
				id
				title
				duration
				description
				imageLocation
				price
			}
			showtimeId
			showtime {
				id
				datetime
				cinema
			}
		}
	}
`;

const filterBookingsQuery = gql`
	query($filter: String!) {
		filterBookings(filter: $filter) {
			id
			name
			ticket_count
			email
			total
			payment_method
			status
			movieId
			showtimeId
			movie {
				id
				title
				duration
				description
				imageLocation
				price
			}
			showtime {
				id
				datetime
			}
			createdAt
		}
	}
`;

export {
	getMoviesQuery,
	getMovieQuery,
	getShowtimeQuery,
	getNowShowingQuery,
	getBookingsQuery,
	getBookingQuery,
	filterBookingsQuery
};
