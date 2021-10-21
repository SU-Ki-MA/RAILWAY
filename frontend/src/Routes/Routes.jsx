import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Notfound from "../Pages/notfound"
import Signup from "../Pages/signup"
import Signin from "../Pages/signin"
import Reset from "../Pages/reset"
function Routes() {
  return (
    <Router >
      <Switch >
        <Route exact path="/signup" ><Signup /></Route>
        <Route exact path="/signin" ><Signin /></Route>
        <Route exact path="/reset" ><Reset /></Route>
        <Route component={Notfound} />
      </Switch >
    </Router>
  )
}
export default Routes