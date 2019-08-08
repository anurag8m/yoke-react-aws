import React, { Component } from "react";
import FooterPage from "./footer.component.js";
import HeaderPage from "./header.component.js";
import '../dashboard/dashboard.css';
import axios from 'axios';
import $ from "jquery";
import Popper from "popper.js";
import jwt_decode from 'jwt-decode';
import image from '../images/lg.rotating-balls-spinner.gif';
import Modal from 'react-bootstrap/Modal';
import { Link, withRouter } from "react-router-dom";

export default class DashboardPage extends Component {

    constructor() {
        super();
        this.state = {
            companyId: "",
            allemployeeslstcheckin: [],
            loading: true,
            selectedDate: this.compare(),
            selectemp: ""
        }






    }


    onClick() {

    }

    componentWillMount() {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            companyId: decoded.companyId
        })
    }

    componentDidMount() {

        // get employees last checkins on the basis of company ID
        var handle = this.state.companyId;
        axios
            .post("http://54.89.216.159:3000/getLastCheckOfAllEmployeesOfCompany", {
                companyId: handle
            })
            .then(getresponse => {
                return getresponse;
            }).then(data => {
                let lastcheckinFromApi = data.data.All_Employees.map(employee => { return { empname: employee.name, empmainid: employee._id, empcheckin: employee.checkins && employee.checkins.checkedInTime, empcheckinlocation: employee.checkins && employee.checkins.location_name } })
                this.setState({ allemployeeslstcheckin: lastcheckinFromApi, loading: false });

            }).catch(error => {
                console.log(error);
            });
    }

    convertTimestamp(time) {
        // Months array
        var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Convert timestamp to milliseconds
        var date = new Date(time * 1000);

        // Year
        var year = date.getFullYear();

        // Month
        var month = months_arr[date.getMonth()];

        // Day
        var day = date.getDate();

        // Hours
        var hours = date.getHours();

        // Minutes
        var minutes = "0" + date.getMinutes();

        // Seconds
        var seconds = "0" + date.getSeconds();

        // Display date time in MM-dd-yyyy h:m:s format
        var convdataTime = month + '-' + day + '-' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return convdataTime;
    }

    compare() {
        var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var date = new Date(); //Current Date
        var month = months_arr[date.getMonth()];
        var year = new Date().getFullYear(); //Current Year
        var day = date.getDate();

        var compdataTime = month + '-' + day + '-' + year;
        return compdataTime;
    }

    compareYear() {

        var date = new Date(); //Current Date

        var year = date.getFullYear(); //Current Year

        var compdataTime = year;
        return compdataTime;
    }

    getMyMonth(datetime) {
        var myArray = datetime.split(' ');
        return myArray[0];
    }

    convertYear(time) {

        // Convert timestamp to milliseconds
        var date = new Date(time * 1000);

        // Year
        var year = date.getFullYear();

        var n = date.getMilliseconds();

        // Display date time in MM-dd-yyyy h:m:s format
        var convdataTime = year;
        return convdataTime;
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
                            <h1><i className="fa fa-dashboard"></i> Employee Last Check-Ins</h1>
                            {/* <p>A free and open source Bootstrap 4 admin template</p> */}
                        </div>
                        <ul className="app-breadcrumb breadcrumb">
                            <li className="breadcrumb-item"><i className="fa fa-home fa-lg"></i></li>
                            <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                        </ul>
                    </div>

                    {/** ------------start data table----------------- */}
                    <div className="col-md-4 offset-md-4">{loading ? <img src={image} /> : ""}</div>
                    <div className="row">
                        <div className="col-md-12">
                            <div class="row">

                                {this.state.allemployeeslstcheckin.map((team) => <div class="col-md-6 col-lg-4" key={team.empmainid}><Link to={"/getallcheckins/" + team.empmainid} style={{ cursor: "pointer", textDecoration: "none" }}> <div className={
                                    this.getMyMonth(this.convertTimestamp(team.empcheckin)) == this.compare()
                                        ? "widget-small primary coloured-icon"
                                        : this.getMyMonth(this.convertTimestamp(team.empcheckin)) < this.compare()
                                            || this.convertYear(team.empcheckin) < this.compareYear()
                                            ? "widget-small success coloured-icon"
                                            : team.empcheckin == null
                                                ? "widget-small success coloured-icon"
                                                : "widget-small danger coloured-icon"
                                }><i className="icon fa fa-users fa-3x"></i>
                                    <div className="info">
                                        <p>Name - <b>{team.empname}</b></p>
                                        <p>Checked InTime - <b>{this.convertTimestamp(team.empcheckin) != "undefined-NaN-NaN NaN:aN:aN" ? this.convertTimestamp(team.empcheckin) : ""}</b></p>
                                        <p>Checked In Location -  {team.empcheckinlocation}</p>
                                    </div></div></Link></div>)}


                            </div>
                        </div>
                    </div>
                    {/** ------------end data table----------------- */}

                </div>
                {/** ------------end right bar----------------- */}



            </div >


        );
    }
}