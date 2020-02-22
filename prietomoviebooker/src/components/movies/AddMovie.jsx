import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bulma-components";

import { createMovieMutation } from "./../../queries/mutations";
import { getMoviesQuery } from "./../../queries/queries";
import { graphql } from "react-apollo";
import Swal from "sweetalert2";
import { toBase64 } from "./../../function.js";

const AddMovie = props => {
	// console.log(props);

	const [title, setTitle] = useState("");
	const [duration, setDuration] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [imagePath, setImagePath] = useState("");
	const fileRef = React.createRef();

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

	const imagePathChangeHandler = e => {
		// console.log(fileRef);

		// console.log(fileRef.current.files[0]);

		let file = fileRef.current.files[0];

		toBase64(file).then(encodedFile => {
			// console.log(encodedFile);
			setImagePath(encodedFile);
		});
	};

	// add a new key-value pair field for newMember.
	// Create a key imageLocation and assign the value of
	// the imagePath state as its value

	useEffect(() => {
		// console.log("title:", title);
		// console.log("duration:", duration);
		// console.log("price:", price);
		// console.log("description:", description);
	});

	const addMovie = e => {
		e.preventDefault();

		let newMovie = {
			title: title,
			duration: duration,
			price: price,
			description: description,
			imageLocation: imagePath
		};

		props.createMovieMutation({
			variables: newMovie,
			refetchQueries: [
				{
					query: getMoviesQuery
				}
			]
		});

		Swal.fire("Movie Added!", "Movie successfully created.", "success");

		props.show();
	};

	return (
		<Modal.Card>
			<div className="modal-card-head MyModalTitle">
				<strong>Add Movie</strong>
			</div>
			<Modal.Card.Body>
				<form onSubmit={addMovie}>
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

					<div className="field">
						<label className="label" htmlFor="image">
							image
						</label>
						<div className="control">
							<input
								id="image"
								className="input"
								type="file"
								accept="image/png"
								onChange={imagePathChangeHandler}
								// onChange={imagePathChangeHandler}
								// value={image}
								ref={fileRef}
							/>
						</div>
					</div>

					<Button color="dark" fullwidth>
						Add Movie
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

export default graphql(createMovieMutation, { name: "createMovieMutation" })(
	AddMovie
);
