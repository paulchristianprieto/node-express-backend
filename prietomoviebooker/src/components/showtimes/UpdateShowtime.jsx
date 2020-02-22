import React, { useState } from "react";
import { Modal, Button } from "react-bulma-components";
import DatePicker from "react-datepicker";
import { setHours, setMinutes, parseISO } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";

import { updateShowtimeMutation } from "./../../queries/mutations";
import { getMoviesQuery, getShowtimeQuery } from "./../../queries/queries";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import Swal from "sweetalert2";

const UpdateShowtime = props => {
	// console.log(props);

	const [startDate, setStartDate] = useState();

	const dateChangeHandler = date => {
		setStartDate(date);
	};

	let showtime = props.getShowtimeQuery.getShowtime
		? props.getShowtimeQuery.getShowtime
		: {};

	// console.log(showtime);

	if (!props.getShowtimeQuery.loading) {
		const setDefaultVaules = () => {
			setStartDate(parseISO(showtime.datetime));
		};

		if (!startDate) {
			setDefaultVaules();
		}
	}

	const updateShowtimeHandler = e => {
		e.preventDefault();

		let updatedShowtime = {
			id: props.showtimeId,
			movieId: props.movieId,
			datetime: startDate
		};

		props.updateShowtimeMutation({
			variables: updatedShowtime,
			refetchQueries: [
				{
					query: getMoviesQuery
				}
			]
		});

		Swal.fire(
			"Showtime Updated!",
			"Showtime successfully updated.",
			"success"
		);

		props.show();
	};

	// let exclude = [parseISO("11/30/2019")];

	// I would create a function that utilizes the excludeTimes parameter
	// combined with your onChange event and/or selected parameter. If
	// selected date === today's date then your excludeTimes will be an
	// array of interval times you do not want displayed for this date.
	// This function would have to run every time a date is selected on
	// your onChange event and return null or and empty array when any
	// other date other than the desired date is selected.

	return (
		<Modal.Card>
			<div className="modal-card-head MyModalTitle">
				<strong>Update Showtime</strong>
			</div>

			<Modal.Card.Body>
				<form onSubmit={updateShowtimeHandler}>
					<div className="field">
						<label className="label" htmlFor="title">
							Showtime:
						</label>
						<DatePicker
							selected={startDate}
							onChange={dateChangeHandler}
							showTimeSelect
							className="input is-block"
							minDate={new Date()}
							dateFormat="MMMM d, yyyy @ h:mm aa"
							minTime={setHours(setMinutes(new Date(), 0), 8)}
							maxTime={setHours(setMinutes(new Date(), 0), 23)}
							withPortal
							placeholderText="Please select Date and Time"
						/>
					</div>

					<Button color="dark" fullwidth>
						Update Showtime
					</Button>
				</form>
			</Modal.Card.Body>
			<Modal.Card.Foot
				style={{ alignItems: "center", justifyContent: "center" }}
			>
				<p>Press escape to cancel.</p>
			</Modal.Card.Foot>
		</Modal.Card>
	);
};

export default compose(
	graphql(updateShowtimeMutation, {
		name: "updateShowtimeMutation"
	}),
	graphql(getShowtimeQuery, {
		options: props => {
			return {
				variables: {
					id: props.showtimeId
				}
			};
		},
		name: "getShowtimeQuery"
	})
)(UpdateShowtime);
