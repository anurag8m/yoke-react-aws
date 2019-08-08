import React from "react";
import logo from "./logo.svg";
import $ from "jquery";
import Popper from "popper.js";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import LoginPage from "./components/login.component.js";
import RegisterPage from "./components/register.component.js";
import DashboardPage from "./components/dashboard.component.js";
import EmployeeListPage from "./components/employeelist.component";
import ProfilePage from "./components/profile.component";
import CreateEmployeePage from "./components/createemployee.component";
import EditEmployeePage from "./components/editemployee.component";
import GetAllCheckIns from "./components/getallcheckins.component";
import { PrivateRoute } from "./components/PrivateRoute";
import axios from "axios";

function App() {
  return (
    <Router>
      <Route path="/" exact component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <PrivateRoute path="/dashboard" component={DashboardPage} />
      <PrivateRoute path="/myprofile" component={ProfilePage} />
      <PrivateRoute path="/createemployee" component={CreateEmployeePage} />
      <PrivateRoute path="/employeelist" component={EmployeeListPage} />
      <PrivateRoute path="/editemployee/:id" component={EditEmployeePage} />
      <PrivateRoute path="/getallcheckins/:id" component={GetAllCheckIns} />
    </Router>
  );
}

export default App;
