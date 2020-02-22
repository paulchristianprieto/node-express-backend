import React, { useState } from "react";
import AbsoluteWrapper from "./AbsoluteWrapper";
import { Columns, Card, Button, Image, Modal } from "react-bulma-components";
import Swal from "sweetalert2";

import { getMoviesQuery } from "./../queries/queries";
import {
  deleteMovieMutation,
  deleteShowtimeMutation
} from "./../queries/mutations";

import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";

import AddMovie from "./movies/AddMovie";
import UpdateMovie from "./movies/UpdateMovie";
import AddShowtime from "./showtimes/AddShowtime";
import UpdateShowtime from "./showtimes/UpdateShowtime";
import { format, parseISO } from "date-fns";
import { nodeServer } from "./../function.js";

const Movies = props => {
  // console.log(getMoviesQuery);

  const movieData = props.getMoviesQuery.getMovies
    ? props.getMoviesQuery.getMovies
    : [];

  const [showAddMovie, setShowAddMovie] = useState(false);
  const [showUpdateMovie, setShowUpdateMovie] = useState(false);

  const [showAddShowtime, setShowAddShowtime] = useState(false);
  const [showUpdateShowtime, setShowUpdateShowtime] = useState(false);

  const [movieId, setMovieId] = useState("");
  const [showtimeId, setShowtimeId] = useState("");

  function toggleAddMovie() {
    setShowAddMovie(!showAddMovie);
  }

  function toggleAddShowtime(movieId) {
    setShowAddShowtime(!showAddShowtime);
    setMovieId(movieId);
  }

  function toggleUpdateShowtime(movieId, showtimeId) {
    setShowUpdateShowtime(!showUpdateShowtime);
    setMovieId(movieId);
    setShowtimeId(showtimeId);
  }

  function toggleUpdateMovie(movieId) {
    setShowUpdateMovie(!showUpdateMovie);
    setMovieId(movieId);
  }

  const deleteMovieHandler = e => {
    let id = e.target.id;

    Swal.fire({
      title: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        props.deleteMovieMutation({
          variables: { id: id },
          refetchQueries: [
            {
              query: getMoviesQuery
            }
          ]
        });
        Swal.fire("Deleted!", "The movie has been deleted.", "success");
      }
    });

    setMovieId("");
  };

  const deleteShowtimeHandler = e => {
    let id = e.target.id;
    // console.log(e.target);

    Swal.fire({
      title: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        props.deleteShowtimeMutation({
          variables: { id: id },
          refetchQueries: [
            {
              query: getMoviesQuery
            }
          ]
        });
        Swal.fire("Deleted!", "The showtime has been deleted.", "success");
      }
    });

    setShowtimeId("");
  };

  const showImage = image => {
    if (image) {
      return <Image src={nodeServer() + image} size={"3by4"} />;
    } else {
      return (
        <Image
          src="https://vignette.wikia.nocookie.net/project-pokemon/images/4/47/Placeholder.png/revision/latest?cb=20170330235552&format=original"
          size={"1by1"}
        />
      );
    }
  };

  return (
    <AbsoluteWrapper>
      <div>
        <Modal
          show={showAddMovie}
          onClose={() => setShowAddMovie(!showAddMovie)}
        >
          <AddMovie show={toggleAddMovie}>{props.children}</AddMovie>
        </Modal>
      </div>
      <div>
        <Modal
          show={showUpdateMovie}
          onClose={() => setShowUpdateMovie(!showUpdateMovie)}
        >
          <UpdateMovie movieId={movieId} show={toggleUpdateMovie}>
            {props.children}
          </UpdateMovie>
        </Modal>
      </div>

      <div>
        <Modal
          show={showAddShowtime}
          onClose={() => setShowAddShowtime(!showAddShowtime)}
        >
          <AddShowtime movieId={movieId} show={toggleAddShowtime}>
            {props.children}
          </AddShowtime>
        </Modal>
      </div>

      <div>
        <Modal
          show={showUpdateShowtime}
          onClose={() => setShowUpdateShowtime(!showUpdateShowtime)}
        >
          <UpdateShowtime
            movieId={movieId}
            showtimeId={showtimeId}
            show={toggleUpdateShowtime}
          >
            {props.children}
          </UpdateShowtime>
        </Modal>
      </div>

      <Columns>
        <Columns.Column size={12}>
          <Card>
            <Card.Header>
              <Card.Header.Title className="MyModalTitle">
                <strong>Movies &nbsp;</strong>
                <a href="/#" onClick={toggleAddMovie} className="addItem">
                  <i className="far fa-plus-square"></i>
                </a>
              </Card.Header.Title>
            </Card.Header>

            <Card.Content>
              <div className="table-container">
                <table className="table is-fullwidth is-bordered">
                  <thead className="">
                    <tr className="has-background-dark">
                      <th className="has-text-light">Movie</th>
                      <th className="has-text-light">Duration</th>
                      <th className="has-text-light">Description</th>
                      <th className="has-text-light">Showtimes</th>
                      <th className="has-text-light">Price</th>
                      <th className="has-text-light">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movieData.map(movie => {
                      // console.log(movie.showtimes);

                      return (
                        <tr key={movie.id} className="table-data">
                          <td
                            className="has-text-centered"
                            style={{ width: 150 }}
                          >
                            {movie.title}
                            {showImage(movie.imageLocation)}
                          </td>
                          <td>{movie.duration} minutes</td>
                          <td>{movie.description}</td>
                          <td>
                            {movie.showtimes.map(showtime => {
                              // console.log(showtime);
                              return (
                                <p key={showtime.id}>
                                  {format(
                                    parseISO(showtime.datetime),
                                    "MMM d, yyyy @ h:mm aa"
                                  )}
                                  <span className="float-right">
                                    <a
                                      href="/#"
                                      onClick={() => {
                                        toggleUpdateShowtime(
                                          movie.id,
                                          showtime.id
                                        );
                                      }}
                                      id={movie.id}
                                    >
                                      <i className="fas fa-edit"></i> &nbsp;
                                    </a>
                                    <a
                                      href="/#"
                                      onClick={deleteShowtimeHandler}
                                    >
                                      <i
                                        className="fas fa-trash-alt"
                                        id={showtime.id}
                                      ></i>
                                    </a>
                                  </span>
                                </p>
                              );
                            })}

                            <Button
                              className="mt-2"
                              fullwidth
                              color={"dark"}
                              onClick={() => {
                                toggleAddShowtime(movie.id);
                              }}
                              id={movie.id}
                            >
                              <i className="far fa-plus-square"></i> &nbsp; Add
                              Showtime
                            </Button>
                          </td>
                          <td>PHP {movie.price.toFixed(2)}</td>
                          <td>
                            <Button
                              className="mb-2"
                              color="dark"
                              fullwidth
                              onClick={() => {
                                toggleUpdateMovie(movie.id);
                              }}
                            >
                              <i className="fas fa-edit"></i> &nbsp;Update
                            </Button>

                            <Button
                              color="danger"
                              fullwidth
                              id={movie.id}
                              onClick={deleteMovieHandler}
                            >
                              <i className="fas fa-trash-alt"></i> &nbsp;Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card.Content>
          </Card>
        </Columns.Column>
      </Columns>
    </AbsoluteWrapper>
  );
};

export default compose(
  graphql(getMoviesQuery, { name: "getMoviesQuery" }),
  graphql(deleteMovieMutation, { name: "deleteMovieMutation" }),
  graphql(deleteShowtimeMutation, { name: "deleteShowtimeMutation" })
)(Movies);
