import React, { useState } from "react";
import { Modal, Button } from "react-bulma-components";

import { updateMovieMutation } from "./../../queries/mutations";
import { getMoviesQuery, getMovieQuery } from "./../../queries/queries";

import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";

import Swal from "sweetalert2";

const UpdateMovie = props => {
	// console.log(props);

	const [title, setTitle] = useState("");
	const [duration, setDuration] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");

	const durationChangeHandler = e => {
		setDuration(parseInt(e.target.value));
	};

	const titleChangeHandler = e => {
		setTitle(e.target.value);
	};

	const priceChangeHandler = e => {
		setPrice(parseInt(e.target.value));
	};

	const descriptionChangeHandler = e => {
		setDescription(e.target.value);
	};

	const updateMovie = e => {
		e.preventDefault();

		// setDuration(parseInt(duration));
		// setPrice(parseInt(price));

		let updatedMovie = {
			id: props.movieId,
			title: title,
			duration: duration,
			price: price,
			description: description
		};

		props.updateMovieMutation({
			variables: updatedMovie,
			refetchQueries: [
				{
					query: getMoviesQuery
				}
			]
		});

		Swal.fire("Movie Updated!", "Movie successfully updated.", "success");

		props.show();
	};

	// let member = props.getMemberQuery.getMember
	// 	? props.getMemberQuery.getMember
	// 	: {};

	let movie = props.getMovieQuery.getMovie
		? props.getMovieQuery.getMovie
		: {};

	if (!props.getMovieQuery.loading) {
		const setDefaultVaules = () => {
			setTitle(movie.title);
			setDuration(movie.duration);
			setDescription(movie.description);
			setPrice(movie.price);
		};

		if (!price) {
			setDefaultVaules();
		}
	}

	return (
		<Modal.Card>
			<div className="modal-card-head MyModalTitle">
				<strong>Update Movie Information</strong>
			</div>
			<Modal.Card.Body>
				<form onSubmit={updateMovie}>
					<div className="field">
						<label className="label" htmlFor="title">
							Title
						</label>
						<input
							id="title"
							className="input"
							type="text"
							onChange={titleChangeHandler}
							value={title}
						/>
					</div>

					<div className="field">
						<label className="label" htmlFor="duration">
							Duration
						</label>
						<input
							id="duration"
							className="input"
							type="number"
							min="1"
							value={duration}
							onChange={durationChangeHandler}
						/>
					</div>

					<div className="field">
						<label className="label" htmlFor="description">
							Description
						</label>
						<input
							id="description"
							className="input"
							type="text"
							onChange={descriptionChangeHandler}
							value={description}
						/>
					</div>

					<div className="field">
						<label className="label" htmlFor="price">
							Price
						</label>
						<input
							id="price"
							className="input"
							type="number"
							min="1"
							onChange={priceChangeHandler}
							value={price}
						/>
					</div>

					<Button color="dark" fullwidth>
						Update Movie
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
	graphql(updateMovieMutation, { name: "updateMovieMutation" }),
	graphql(getMovieQuery, {
		options: props => {
			return {
				variables: {
					id: props.movieId
				}
			};
		},
		name: "getMovieQuery"
	})
)(UpdateMovie);
