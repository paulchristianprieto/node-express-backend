import { gql } from "apollo-boost";

const createMovieMutation = gql`
	mutation(
		$title: String!
		$duration: Int!
		$description: String!
		$price: Int!
		$imageLocation: String
	) {
		createMovie(
			title: $title
			duration: $duration
			description: $description
			price: $price
			imageLocation: $imageLocation
		) {
			id
			title
			duration
			description
			price
			imageLocation
		}
	}
`;

const updateMovieMutation = gql`
	mutation(
		$id: ID!
		$title: String!
		$duration: Int!
		$description: String!
		$price: Int!
	) {
		updateMovie(
			id: $id
			title: $title
			duration: $duration
			description: $description
			price: $price
		) {
			id
			title
			duration
			description
			price
		}
	}
`;

const deleteMovieMutation = gql`
	mutation($id: ID!) {
		deleteMovie(id: $id)
	}
`;

const createShowtimeMutation = gql`
	mutation($movieId: ID!, $datetime: Date!) {
		createShowtime(movieId: $movieId, datetime: $datetime) {
			id
			movieId
			datetime
			cinema
		}
	}
`;

const updateShowtimeMutation = gql`
	mutation($id: ID!, $movieId: ID!, $datetime: Date!) {
		updateShowtime(id: $id, movieId: $movieId, datetime: $datetime) {
			movieId
			datetime
			cinema
			id
		}
	}
`;

const deleteShowtimeMutation = gql`
	mutation($id: ID!) {
		deleteShowtime(id: $id)
	}
`;

const getNowShowing2Mutation = gql`
	mutation($date: Date!) {
		getNowShowing2(date: $date) {
			movieId
			datetime
			id
			movie {
				id
				title
				duration
				description
				price
			}
		}
	}
`;

const createBookingMutation = gql`
	mutation(
		$name: String!
		$ticket_count: Int!
		$email: String!
		$total: Int!
		$movieId: ID!
		$showtimeId: ID!
		$status: String
		$payment_method: String
	) {
		createBooking(
			name: $name
			ticket_count: $ticket_count
			email: $email
			total: $total
			movieId: $movieId
			showtimeId: $showtimeId
			status: $status
			payment_method: $payment_method
		) {
			id
			name
			ticket_count
			email
			total
			movieId
			showtimeId
			status
			payment_method
		}
	}
`;

const updateBookingStatusMutation = gql`
	mutation($id: ID!, $status: String!) {
		updateBookingStatus(id: $id, status: $status) {
			name
			ticket_count
			email
			payment_method
			total
			status
			movieId
			showtimeId
			showtime {
				id
				datetime
				cinema
			}
			movie {
				title
				duration
				description
				price
			}
		}
	}
`;

const decrementTicketCountMutation = gql`
	mutation($id: ID!) {
		decrementTicketCount(id: $id) {
			ticket_count
			name
		}
	}
`;

const incrementTicketCountMutation = gql`
	mutation($id: ID!) {
		incrementTicketCount(id: $id) {
			ticket_count
			name
		}
	}
`;

export {
	createMovieMutation,
	updateMovieMutation,
	deleteMovieMutation,
	createShowtimeMutation,
	updateShowtimeMutation,
	deleteShowtimeMutation,
	getNowShowing2Mutation,
	createBookingMutation,
	updateBookingStatusMutation,
	decrementTicketCountMutation,
	incrementTicketCountMutation
};
