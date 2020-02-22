import React, { useContext } from "react";
import { Switch, Route, __RouterContext } from "react-router-dom";
import { useTransition, animated } from "react-spring";
import { Movies, NowShowing, Bookings, Navbah, Login } from "./components";
import { Container } from "react-bulma-components";

const App = () => {
  const { location } = useContext(__RouterContext);
  const transitions = useTransition(location, location => location.pathname, {
    from: { opacity: 0, transform: "translate(100%, 0)" },
    enter: { opacity: 1, transform: "translate(0%, 0)" },
    leave: { opacity: 0, transform: "translate(-50%, 0)" }
  });

  return (
    <div>
      <Navbah />
      <div>
        <Container>
          {transitions.map(({ item, props, key }) => (
            <animated.div key={key} style={props}>
              <Switch location={item}>
                <Route exact path="/" component={NowShowing} />
                <Route exact path="/movies" component={Movies} />
                <Route exact path="/nowshowing" component={NowShowing} />
                <Route exact path="/bookings" component={Bookings} />
                <Route exact path="/login" component={Login} />
              </Switch>
            </animated.div>
          ))}
        </Container>
      </div>
    </div>
  );
};

export default App;
