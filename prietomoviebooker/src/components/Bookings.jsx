import React, { useState } from "react";
import AbsoluteWrapper from "./AbsoluteWrapper";
import { Columns, Card, Button, Image, Modal } from "react-bulma-components";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { format, parseISO } from "date-fns";
import Swal from "sweetalert2";

import { getBookingsQuery, filterBookingsQuery } from "./../queries/queries";
import {
  updateBookingStatusMutation,
  incrementTicketCountMutation,
  decrementTicketCountMutation
} from "./../queries/mutations";
import ShowBooking from "./bookings/ShowBooking";
import { nodeServer } from "./../function.js";

const Bookings = props => {
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [filter, setFilter] = useState("all");

  let bookingData = props.getBookingsQuery.getBookings
    ? props.getBookingsQuery.getBookings
    : [];

  const toggleShowBookingDetails = bookingId => {
    setShowBookingDetails(!showBookingDetails);
    setBookingId(bookingId);
  };

  const statusChangeHandler = e => {
    let updatedBooking = {
      id: e.target.id,
      status: e.target.value
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

  const rejectBookingHandler = bookingId => {
    let updatedBooking = {
      id: bookingId,
      status: "rejected"
    };

    props.updateBookingStatusMutation({
      variables: updatedBooking,
      refetchQueries: [
        {
          query: getBookingsQuery
        }
      ]
    });

    Swal.fire("Booking rejected.", "", "success");
  };

  const addTicketHandler = e => {
    props.incrementTicketCountMutation({
      variables: {
        id: e.target.id
      },
      refetchQueries: [
        {
          query: getBookingsQuery
        }
      ]
    });

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Adding ticket...",
      showConfirmButton: false,
      timer: 300
    });
  };

  const decreaseTicketHandler = (bookingId, bookingTicket) => {
    // console.log("decreasing...");
    props.decrementTicketCountMutation({
      variables: {
        id: bookingId
      },
      refetchQueries: [
        {
          query: getBookingsQuery
        }
      ]
    });

    if (bookingTicket > 1) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Decreasing ticket...",
        showConfirmButton: false,
        timer: 300
      });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Ticket cannot be zero.",
        showConfirmButton: false,
        timer: 1000
      });
    }
  };

  const filterBookingHandler = e => {
    setFilter(e.target.value);
  };

  return (
    <AbsoluteWrapper>
      <div>
        <Modal
          show={showBookingDetails}
          onClose={() => setShowBookingDetails(!showBookingDetails)}
        >
          <ShowBooking show={toggleShowBookingDetails} bookingId={bookingId} />
        </Modal>
      </div>
      <Columns>
        <Columns.Column size={12}>
          <Card>
            <Card.Header>
              <Card.Header.Title className="MyModalTitle">
                <strong>Reservations &nbsp;</strong>

                <div className="select is-medium is-rounded">
                  <select
                    onChange={filterBookingHandler}
                    value={filter}
                    // id={booking.id}
                  >
                    <option id="all" value="all">
                      All
                    </option>
                    <option id="pending" value="pending">
                      Pending
                    </option>
                    <option id="paid" value="paid">
                      Paid
                    </option>
                    <option id="rejected" value="rejected">
                      Rejected
                    </option>
                  </select>
                </div>
              </Card.Header.Title>
            </Card.Header>

            <Card.Content>
              <div className="table-container">
                <table className="table is-fullwidth is-bordered">
                  <thead className="">
                    <tr className="has-background-dark">
                      <th className="has-text-light">Movie Details</th>
                      <th className="has-text-light">Customer Info</th>
                      <th className="has-text-light">Tickets</th>
                      <th className="has-text-light">Status</th>
                      <th className="has-text-light">Payment</th>
                      <th className="has-text-light">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingData
                      .map(booking => {
                        if (booking.status === filter) {
                          return (
                            <tr key={booking.id} className="table-data">
                              <td
                                className="has-text-centered"
                                style={{ width: 180 }}
                              >
                                <p>
                                  <strong>{booking.movie.title}</strong>
                                </p>
                                <p>{booking.movie.duration} minutes</p>
                                <p>
                                  {format(
                                    parseISO(booking.showtime.datetime),
                                    "MMMM d, yyyy @ h:mm aa"
                                  )}
                                </p>

                                <Image
                                  src={
                                    nodeServer() + booking.movie.imageLocation
                                  }
                                  size={"3by4"}
                                />
                              </td>
                              <td>
                                <p>Name: {booking.name}</p>
                                <p>Email: {booking.email}</p>
                              </td>
                              <td>
                                <p>
                                  <strong>{booking.ticket_count}</strong> x PHP{" "}
                                  {booking.movie.price}
                                  <span
                                    className={
                                      booking.status === "paid" ||
                                      booking.status === "rejected"
                                        ? "d-none"
                                        : "float-right"
                                    }
                                  >
                                    <a
                                      style={{ fontSize: 20, opacity: 0.8 }}
                                      onClick={addTicketHandler}
                                    >
                                      <i
                                        id={booking.id}
                                        className="far fa-plus-square"
                                      ></i>
                                    </a>
                                    &nbsp;
                                    <a
                                      style={{ fontSize: 20, opacity: 0.8 }}
                                      onClick={() => {
                                        decreaseTicketHandler(
                                          booking.id,
                                          booking.ticket_count
                                        );
                                      }}
                                      name={booking.ticket_count}
                                      id={booking.id}
                                    >
                                      <i
                                        id={booking.id}
                                        name={booking.ticket_count}
                                        className="far fa-minus-square"
                                      ></i>
                                    </a>
                                  </span>
                                </p>
                              </td>
                              <td>
                                <div
                                  className={
                                    booking.status === "rejected"
                                      ? "d-none"
                                      : ""
                                  }
                                >
                                  <div className="select">
                                    <select
                                      onChange={statusChangeHandler}
                                      value={booking.status}
                                      id={booking.id}
                                    >
                                      <option id="pending" value="pending">
                                        Pending
                                      </option>
                                      <option id="paid" value="paid">
                                        Paid
                                      </option>
                                    </select>
                                  </div>
                                </div>
                                <div
                                  className={
                                    booking.status === "rejected"
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <span>Rejected</span>
                                </div>
                              </td>
                              <td>
                                <p className="text-capitalize">
                                  {booking.payment_method}: PHP {booking.total}
                                </p>
                              </td>
                              <td style={{ width: 120 }}>
                                <Button
                                  className="mb-2"
                                  color="success"
                                  fullwidth
                                  onClick={() => {
                                    toggleShowBookingDetails(booking.id);
                                  }}
                                >
                                  <i className="fas fa-eye"></i> &nbsp;Details
                                </Button>

                                <Button
                                  color="danger"
                                  fullwidth
                                  onClick={() => {
                                    rejectBookingHandler(booking.id);
                                  }}
                                  className={
                                    booking.status === "rejected" ||
                                    booking.status === "paid"
                                      ? "d-none"
                                      : ""
                                  }
                                >
                                  <i className="fas fa-minus-square"></i>{" "}
                                  &nbsp;Reject
                                </Button>
                              </td>
                            </tr>
                          );
                        } else if (filter === "all") {
                          return (
                            <tr key={booking.id} className="table-data">
                              <td
                                className="has-text-centered"
                                style={{ width: 180 }}
                              >
                                <p>
                                  <strong>{booking.movie.title}</strong>
                                </p>
                                <p>{booking.movie.duration} minutes</p>
                                <p>
                                  {format(
                                    parseISO(booking.showtime.datetime),
                                    "MMMM d, yyyy @ h:mm aa"
                                  )}
                                </p>

                                <Image
                                  src={
                                    nodeServer() + booking.movie.imageLocation
                                  }
                                  size={"3by4"}
                                />
                              </td>
                              <td>
                                <p>Name: {booking.name}</p>
                                <p>Email: {booking.email}</p>
                              </td>
                              <td>
                                <p>
                                  <strong>{booking.ticket_count}</strong> x PHP{" "}
                                  {booking.movie.price}
                                  <span
                                    className={
                                      booking.status === "paid" ||
                                      booking.status === "rejected"
                                        ? "d-none"
                                        : "float-right"
                                    }
                                  >
                                    <a
                                      style={{ fontSize: 20, opacity: 0.8 }}
                                      onClick={addTicketHandler}
                                    >
                                      <i
                                        id={booking.id}
                                        className="far fa-plus-square"
                                      ></i>
                                    </a>
                                    &nbsp;
                                    <a
                                      style={{ fontSize: 20, opacity: 0.8 }}
                                      onClick={() => {
                                        decreaseTicketHandler(
                                          booking.id,
                                          booking.ticket_count
                                        );
                                      }}
                                      name={booking.ticket_count}
                                      id={booking.id}
                                    >
                                      <i
                                        id={booking.id}
                                        name={booking.ticket_count}
                                        className="far fa-minus-square"
                                      ></i>
                                    </a>
                                  </span>
                                </p>
                              </td>
                              <td>
                                <div
                                  className={
                                    booking.status === "rejected"
                                      ? "d-none"
                                      : ""
                                  }
                                >
                                  <div className="select">
                                    <select
                                      onChange={statusChangeHandler}
                                      value={booking.status}
                                      id={booking.id}
                                    >
                                      <option id="pending" value="pending">
                                        Pending
                                      </option>
                                      <option id="paid" value="paid">
                                        Paid
                                      </option>
                                    </select>
                                  </div>
                                </div>
                                <div
                                  className={
                                    booking.status === "rejected"
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <span>Rejected</span>
                                </div>
                              </td>
                              <td>
                                <p className="text-capitalize">
                                  {booking.payment_method}: PHP {booking.total}
                                </p>
                              </td>
                              <td style={{ width: 120 }}>
                                <Button
                                  className="mb-2"
                                  color="success"
                                  fullwidth
                                  onClick={() => {
                                    toggleShowBookingDetails(booking.id);
                                  }}
                                >
                                  <i className="fas fa-eye"></i> &nbsp;Details
                                </Button>

                                <Button
                                  color="danger"
                                  fullwidth
                                  onClick={() => {
                                    rejectBookingHandler(booking.id);
                                  }}
                                  className={
                                    booking.status === "rejected" ||
                                    booking.status === "paid"
                                      ? "d-none"
                                      : ""
                                  }
                                >
                                  <i className="fas fa-minus-square"></i>{" "}
                                  &nbsp;Reject
                                </Button>
                              </td>
                            </tr>
                          );
                        }
                        return <tr></tr>;
                      })
                      .reverse()}
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
  graphql(filterBookingsQuery, {
    options: props => {
      return {
        variables: {
          filter: "all"
        }
      };
    },
    name: "filterBookingsQuery"
  }),
  graphql(incrementTicketCountMutation, {
    name: "incrementTicketCountMutation"
  }),
  graphql(decrementTicketCountMutation, {
    name: "decrementTicketCountMutation"
  }),
  graphql(getBookingsQuery, { name: "getBookingsQuery" }),
  graphql(updateBookingStatusMutation, { name: "updateBookingStatusMutation" })
)(Bookings);
