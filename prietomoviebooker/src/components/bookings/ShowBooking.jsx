import React, { useEffect, useState } from "react";
import {
	Modal,
	Section,
	Columns,
	Image,
	Heading,
	Button
} from "react-bulma-components";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { format, parseISO } from "date-fns";
import Swal from "sweetalert2";

import { getBookingQuery, getBookingsQuery } from "./../../queries/queries";
import { updateBookingStatusMutation } from "./../../queries/mutations";
import { nodeServer } from "./../../function.js";

const ShowBooking = props => {
	// console.log(props);

	const [showtime, setShowtime] = useState();
	const [movie, setMovie] = useState();

	let booking = props.getBookingQuery.getBooking
		? props.getBookingQuery.getBooking
		: {};

	let bookingShowtime = showtime ? showtime : {};
	let bookingMovie = movie ? movie : {};
	let bookingDatetime = bookingShowtime.datetime
		? bookingShowtime.datetime
		: "2019-12-17T07:00:00.000Z";

	useEffect(() => {
		setShowtime(booking.showtime);
		setMovie(booking.movie);
	});

	const closeHandler = () => {
		props.show();
	};

	const statusChangeHandler = bookingId => {
		let updatedBooking = {
			id: bookingId,
			status: "paid"
		};

		props.updateBookingStatusMutation({
			variables: updatedBooking,
			refetchQueries: [
				{
					query: getBookingsQuery
				}
			]
		});

		Swal.fire("Status Updated!", "Status successfully updated.", "success");
	};

	return (
		<Modal.Card>
			<div className="modal-card-head MyModalTitle">
				<strong>Booking Details</strong>
			</div>

			<Modal.Card.Body>
				<Section>
					<Heading>Movie:</Heading>
					<Columns>
						<Columns.Column size={3}>
							<Image
								src={nodeServer() + bookingMovie.imageLocation}
								size={"3by4"}
							/>
						</Columns.Column>
						<Columns.Column size={9}>
							<Heading>{bookingMovie.title}</Heading>
							<Heading subtitle>
								<strong>PHP</strong> {bookingMovie.price}
								<p>{bookingMovie.duration} minutes</p>
							</Heading>
						</Columns.Column>
					</Columns>
				</Section>
				<Section>
					<Heading>Reservation:</Heading>
					<Heading subtitle>
						<p>Customer Name: {booking.name}</p>
						<p>Email: {booking.email}</p>
						<p>
							Status:{" "}
							<span className="text-capitalize">
								{booking.status}
							</span>
						</p>
						<p>
							Payment:{" "}
							<span className="text-capitalize">
								{booking.payment_method}
							</span>
						</p>
						<p>Ticket Count: {booking.ticket_count}</p>
						<p>
							Total: <strong>PHP {booking.total}</strong>
						</p>
						<p>
							Time: {format(parseISO(bookingDatetime), "h:mm aa")}
						</p>
						<p>
							Date:{" "}
							{format(parseISO(bookingDatetime), "MMMM d, yyyy")}
						</p>
						<br />
						<Button.Group>
							<Button
								renderAs="span"
								color="success"
								disabled={
									booking.status === "paid" ? true : false
								}
								onClick={() => {
									statusChangeHandler(booking.id);
								}}
							>
								{booking.status === "paid"
									? "Already Paid"
									: "Mark as Paid"}
							</Button>
							<Button
								renderAs="span"
								color="danger"
								onClick={closeHandler}
							>
								Close
							</Button>
						</Button.Group>
					</Heading>
				</Section>
			</Modal.Card.Body>
			<Modal.Card.Foot
				style={{ alignItems: "center", justifyContent: "center" }}
			>
				<p>Press escape to exit.</p>
			</Modal.Card.Foot>
		</Modal.Card>
	);
};

export default compose(
	graphql(updateBookingStatusMutation, {
		name: "updateBookingStatusMutation"
	}),
	graphql(getBookingQuery, {
		options: props => {
			return {
				variables: {
					id: props.bookingId
				}
			};
		},
		name: "getBookingQuery"
	})
)(ShowBooking);
