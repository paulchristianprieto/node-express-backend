import React, { useState } from "react";
import { Modal, Button } from "react-bulma-components";
import DatePicker from "react-datepicker";
import { setHours, setMinutes } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";

import { createShowtimeMutation } from "./../../queries/mutations";
import { getMoviesQuery } from "./../../queries/queries";
import { graphql } from "react-apollo";

import Swal from "sweetalert2";

const AddShowtime = props => {
	// console.log(props);

	const [startDate, setStartDate] = useState();
	// new Date(setHours(setMinutes(new Date(), 0), 8))
	// console.log(startDate);

	const dateChangeHandler = date => {
		setStartDate(date);
		// console.log(typeof date);

		// console.log();

		// console.log(parse(date, "MM/DD/YYYY", new Date()));
		// console.log(toDate(date));
	};

	const addShowtimeHandler = e => {
		e.preventDefault();

		// let date = startDate.toString();
		// console.log(date);
		// console.log(typeof date);
		// let x = new Date(date);
		// console.log(typeof x);

		let newShowtime = {
			movieId: props.movieId,
			datetime: startDate
		};

		props.createShowtimeMutation({
			variables: newShowtime,
			refetchQueries: [
				{
					query: getMoviesQuery
				}
			]
		});

		Swal.fire(
			"Showtime Added!",
			"Showtime successfully created.",
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
				<strong>Add Showtime</strong>
			</div>

			<Modal.Card.Body>
				<form onSubmit={addShowtimeHandler}>
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
							// excludeTimes={[
							// 	setHours(setMinutes(new Date(), 0), 1),
							// 	setHours(setMinutes(new Date(), 0), 2),
							// 	setHours(setMinutes(new Date(), 0), 3),
							// 	setHours(setMinutes(new Date(), 30), 18),
							// 	setHours(setMinutes(new Date(), 30), 19),
							// 	setHours(setMinutes(new Date(), 30), 17)
							// ]}
							// excludeDates={[
							// 	parseISO("11/4/2019"),
							// 	(parseISO("11/4/2019"), 1)
							// ]}
						/>
					</div>

					<Button color="dark" fullwidth>
						Add Showtime
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

export default graphql(createShowtimeMutation, {
	name: "createShowtimeMutation"
})(AddShowtime);
