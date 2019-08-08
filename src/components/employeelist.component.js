import React, { Component } from "react";
import FooterPage from "./footer.component.js";
import HeaderPage from "./header.component.js";
import "../dashboard/dashboard.css";
import { Link, withRouter } from "react-router-dom";
import $ from "jquery";
import Popper from "popper.js";
import axios from "axios";
import image from '../images/lg.rotating-balls-spinner.gif';
import jwt_decode from 'jwt-decode';
import { logoutdevice } from "./UserFunctions";

export default class ProfilePage extends Component {

  constructor() {
    super();

    this.state = {

      allemployeeslist: [],
      loading: true
    };

    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    this.setState({
      companyId: decoded.companyId
    })


  }

  componentDidMount() {
    // get employee on the basis of company ID
    var handle = this.state.companyId;

    var apiUrl = `http://54.89.216.159:3000/allemployeeslist/${handle}`;
    fetch(apiUrl)
      .then(getresponse => {
        return getresponse.json();
      }).then(data => {
        console.log(data);
        let allempFromApi = data.allemployeeslist.map(team => { return { empmainid: team._id, empname: team.name, empid: team.employee_id, empcmpny: team.company.companyName, empdept: team.department && team.department.departmentName, empusertype: team.usertype, empdesig: team.designation, empdevicemainid: team.device && team.device._id, empdeviceuserid: team.device && team.device.user_id, empdevicedevicename: team.device && team.device.deviceName, empdevicedeviceid: team.device && team.device.deviceId } })
        this.setState({ allemployeeslist: allempFromApi, loading: false });
      }).catch(error => {
        console.log(error);
      });
  }

  handleLogout(e) {
    var devicedeviceid = e.target.getAttribute('devicedeviceid');
    var deviceuserid = e.target.getAttribute('deviceuserid');
    const user = {
      logoutdevicedeviceid: devicedeviceid,
      logoutdeviceuserid: deviceuserid
    };
    logoutdevice(user).then((res, err) => {
      //var redirectUrl = `/editemployee/${requestedId}`;
      if (res) {
        this.props.history.push('/dashboard');
      }
      else {
        this.setState({
          loading: false,
          message: "Some error occured"
        })
      }
    });
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="app sidebar-mini rtl">
        <HeaderPage />
        {/** ------------start right bar----------------- */}
        <div className="app-content">
          <div className="app-title">
            <div>
              <h1>
                <i className="fa fa-dashboard" /> Employee List
              </h1>
              {/* <p>A free and open source Bootstrap 4 admin template</p> */}
            </div>
            <ul className="app-breadcrumb breadcrumb">
              <li className="breadcrumb-item">
                <i className="fa fa-home fa-lg" />
              </li>
              <li className="breadcrumb-item">
                <a href="#">Employee List</a>
              </li>
            </ul>
          </div>

          {/** ------------start data table----------------- */}

          <div className="row">
            <div className="col-md-12">
              <div className="tile">
                <div className="tile-body">
                  {loading ? <div className="col-md-4 offset-md-4"><img src={image} /></div> : <table
                    className="table table-hover table-bordered"
                    id="sampleTable"
                  >
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Employee Id</th>
                        <th>Company</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>UserType</th>
                        <th>Action</th>
                        <th>Logout</th>

                      </tr>
                    </thead>
                    <tbody>
                      {this.state.allemployeeslist.map((team) => <tr key={team.empmainid} className={!team.empdevicedevicename && !team.empdevicemainid ? "" : "table-primary"}><td>{team.empid}</td><td>{team.empname}</td><td>{team.empid}</td><td>{team.empcmpny}</td><td>{team.empdept}</td><td>{team.empdesig}</td><td>{team.empusertype}</td><td><Link to={"/editemployee/" + team.empmainid} className="dropdown-item">
                        <i className="fa fa-pencil fa-lg" />
                      </Link></td><td>{!team.empdevicedevicename && !team.empdevicemainid ? "" : <button
                        type="submit"
                        className="btn btn-primary pull-right"
                        id="btnContactUs"
                        devicedeviceid={team.empdevicedeviceid}
                        deviceuserid={team.empdeviceuserid}
                        onClick={this.handleLogout}
                      >
                        LOGOUT
                                                    </button>}</td></tr>)}

                    </tbody>
                  </table>}

                </div>
              </div>
            </div>
          </div>
          {/** ------------end data table----------------- */}
        </div>
        {/** ------------end right bar----------------- */}
      </div>
    );
  }
}
