import React, { useState, useEffect } from "react";
import AbsoluteWrapper from "./AbsoluteWrapper";
import {
  Card,
  Image,
  Columns,
  Button,
  Section,
  Container,
  Heading
} from "react-bulma-components";
import DatePicker from "react-datepicker";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { format, parseISO } from "date-fns";
import Swal from "sweetalert2";

import { getNowShowingQuery, getBookingsQuery } from "./../queries/queries";
import {
  getNowShowing2Mutation,
  createBookingMutation
} from "./../queries/mutations";
import { nodeServer } from "./../function.js";

const NowShowing = props => {
  // get all movies with showtimes, do not display movies without showtimes
  // console.log(props);

  const [date, setDate] = useState(new Date());
  // localStorage.setItem("date", date);

  const [movies, setMovies] = useState();

  // console.log(movies);
  // console.log(props.getNowShowingQuery);

  useEffect(() => {
    props.getNowShowing2MutationResult.client
      .query({
        query: getNowShowingQuery,
        variables: { date: date }
      })
      .then(res => {
        // console.log(res);
        let showingDetails = res.data.getNowShowing;
        setMovies(showingDetails);
      });
  }, []);

  const dateChangeHandler = date => {
    setDate(date);

    props.getNowShowing2MutationResult.client
      .query({
        query: getNowShowingQuery,
        variables: { date: date }
      })
      .then(res => {
        // console.log(res);
        let showingDetails = res.data.getNowShowing;
        setMovies(showingDetails);
      });

    // console.log(props);
  };

  const addBookingHandler = (showtimeId, movieId, price) => {
    // console.log(showtimeId);
    // console.log(movieId);
    Swal.mixin({
      input: "text",
      confirmButtonText: "Next &rarr;",
      showCancelButton: true,
      progressSteps: ["1", "2", "3"]
    })
      .queue([
        {
          title: "Tickets",
          text: "Enter Number of Tickets",
          input: "number"
        },
        {
          title: "Name",
          input: "text",
          inputPlaceholder: "Enter your name"
        },
        {
          title: "Email Address",
          inputPlaceholder: "Enter your email",
          input: "email"
        }
      ])
      .then(result => {
        if (result.value) {
          // console.log(result.value[0]); //tickets
          // console.log(result.value[1]); //name
          // console.log(result.value[2]); //email

          let ticket_count = Math.abs(parseInt(result.value[0]));
          let name = result.value[1];
          let email = result.value[2];

          let total = Math.abs(ticket_count * price);

          let newBooking = {
            name: name,
            ticket_count: ticket_count,
            email: email,
            total: total,
            movieId: movieId,
            showtimeId: showtimeId,
            status: "",
            payment_method: ""
          };

          props.createBookingMutation({
            variables: newBooking,
            refetchQueries: [
              {
                query: getBookingsQuery
              }
            ]
          });

          Swal.fire({
            title: "You have reserved a ticket!",
            text: "Please check your email for the receipt",
            confirmButtonText: "Thank You!"
          });
        }
      });
  };

  return (
    <AbsoluteWrapper>
      <Columns>
        <Columns.Column size={12}>
          <Card>
            <Card.Header>
              <div className="field">
                <label htmlFor="selectDate" className="label">
                  Select Date:
                </label>
                <div className="control">
                  <DatePicker
                    id="selectDate"
                    selected={date}
                    onChange={dateChangeHandler}
                    className="input"
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Please select Date"
                  />
                </div>
              </div>
            </Card.Header>

            <Card.Content>
              <Section>
                <Container>
                  <Heading>Now Showing</Heading>
                  <Heading subtitle>{format(date, "MMMM d, yyyy")}</Heading>
                </Container>
              </Section>

              <Section>
                <Container>
                  {movies
                    ? movies.map(movie => {
                        // console.log(movie);
                        return (
                          <Columns key={movie.id}>
                            <Columns.Column size={3}>
                              <Image
                                src={nodeServer() + movie.movie.imageLocation}
                                size={"3by4"}
                              />
                            </Columns.Column>
                            <Columns.Column size={9}>
                              <Heading>{movie.movie.title}</Heading>
                              <Heading subtitle>
                                <strong>PHP</strong> {movie.movie.price}
                              </Heading>
                              <p>{movie.movie.duration} minutes</p>
                              <p>{movie.movie.description}</p>
                              <br />
                              <Button.Group>
                                <Button
                                  renderAs="span"
                                  color="info"
                                  id={movie.id}
                                  onClick={() =>
                                    addBookingHandler(
                                      movie.id,
                                      movie.movie.id,
                                      movie.movie.price
                                    )
                                  }
                                >
                                  {format(parseISO(movie.datetime), "h:mm aa")}
                                </Button>
                              </Button.Group>
                            </Columns.Column>
                          </Columns>
                        );
                      })
                    : ""}
                </Container>
              </Section>
            </Card.Content>
          </Card>
        </Columns.Column>
      </Columns>
    </AbsoluteWrapper>
  );
};

export default compose(
  graphql(getNowShowingQuery, {
    options: props => {
      // if there is no match.params set default to date()

      return {
        variables: {
          date: new Date()
        }
      };
    },
    name: "getNowShowingQuery"
  }),
  graphql(getNowShowing2Mutation, { name: "getNowShowing2Mutation" }),
  graphql(createBookingMutation, { name: "createBookingMutation" })
)(NowShowing);
