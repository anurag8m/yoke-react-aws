import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import HeaderPage from "./header.component.js";
import '../dashboard/dashboard.css';
import axios from 'axios';
import LoadingSpinner from './loadingspinner.component.js';
import image from '../images/lg.rotating-balls-spinner.gif';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import jwt_decode from 'jwt-decode';


export default class GetAllCheckIns extends Component {
    constructor() {
        super();

        this.state = {
            show: false,
            loading: false,
            newloading: true,
            editusername: "",
            edituserempid: "",
            selectedDate: this.compare(),
            allemployees: []
        };
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

    componentWillMount() {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            companyId: decoded.companyId
        })


    }
    componentDidMount() {
        this.getDetailsBydate();

        // get empdetail by his id
        var requestedId = this.props.match.params.id;


        var apiUrl = `http://54.89.216.159:3000/empdetail/${requestedId}`;

        axios.get(apiUrl)
            .then(response => {
                return response;
            }).then(data => {
                console.log(data.data.empdetail)
                this.setState({
                    newloading: false,

                    editusername: data.data.empdetail[0] && data.data.empdetail[0].name,

                    edituserempid: data.data.empdetail[0] && data.data.empdetail[0].employee_id,

                })
            }).catch(error => {
                console.log(error);
            });

    }

    // test
    getDetailsBydate() {
        var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var getselectdate = this.state.selectedDate;

        this.setState({ selectedDate: getselectdate });
        var getCurrentDayInMilli = new Date(getselectdate).getTime() / 100000;
        var getCurrentDayInMilli = getCurrentDayInMilli + "60";
        console.log(getCurrentDayInMilli);
        axios
            .post("http://54.89.216.159:3000/UserCheckInsByDate", {
                user_id: this.props.match.params.id,
                ofdate: getCurrentDayInMilli
            })
            .then(getresponse => {
                console.log(getresponse);
                return getresponse;
            }).then(data => {
                let depempFromApi = data.data.locations.map(employee => { return { checkedInTime: employee.checkedInTime, location_name: employee.location_name } })
                this.setState({ allemployees: depempFromApi });

            }).catch(error => {
                console.log(error);
            });
    }




    setDate = (newDate) => {
        const date = newDate || new Date();
        this.setState({
            selectedDate:
                date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        });
    };

    getPreviousDate = () => {

        const { selectedDate } = this.state;
        const currentDayInMilli = new Date(selectedDate).getTime()
        const oneDay = 1000 * 60 * 60 * 24
        const previousDayInMilli = currentDayInMilli - oneDay
        const previousDate1 = new Date(previousDayInMilli)

        this.setDate(previousDate1)
        this.getDetailsBydatePrevious(previousDate1);
    }

    getDetailsBydatePrevious(getmydate) {
        this.setState({ newloading: true })
        var getnewdate = getmydate;
        var getCurrentDayInMilli = new Date(getnewdate).getTime() / 100000;
        var getCurrentDayInMilli = getCurrentDayInMilli + "60";
        console.log(getCurrentDayInMilli);
        axios
            .post("http://54.89.216.159:3000/UserCheckInsByDate", {
                user_id: this.props.match.params.id,
                ofdate: getCurrentDayInMilli
            })
            .then(getresponse => {
                console.log(getresponse);
                return getresponse;
            }).then(data => {
                let depempFromApi = data.data.locations.map(employee => { return { checkedInTime: employee.checkedInTime, location_name: employee.location_name } })
                this.setState({ allemployees: depempFromApi, newloading: false });

            }).catch(error => {
                console.log(error);
            });
    }

    getNextDate = () => {
        const { selectedDate } = this.state

        const currentDayInMilli = new Date(selectedDate).getTime()
        const oneDay = 1000 * 60 * 60 * 24
        const nextDayInMilli = currentDayInMilli + oneDay
        const nextDate = new Date(nextDayInMilli)

        this.setDate(nextDate)
        this.getDetailsBydatenext(nextDate);

    }

    getDetailsBydatenext(getmydate) {
        this.setState({ newloading: true })
        var getnewdate = getmydate;
        var getCurrentDayInMilli = new Date(getnewdate).getTime() / 100000;
        var getCurrentDayInMilli = getCurrentDayInMilli + "60";
        console.log(getCurrentDayInMilli);
        axios
            .post("http://54.89.216.159:3000/UserCheckInsByDate", {
                user_id: this.props.match.params.id,
                ofdate: getCurrentDayInMilli
            })
            .then(getresponse => {
                console.log(getresponse);
                return getresponse;
            }).then(data => {
                let depempFromApi = data.data.locations.map(employee => { return { checkedInTime: employee.checkedInTime, location_name: employee.location_name } })
                this.setState({ allemployees: depempFromApi, newloading: false });

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
    // test

    render() {
        const { loading, message, newloading } = this.state;


        return (
            <div className="app sidebar-mini rtl">
                <HeaderPage />
                <div className="app-content">
                    <div className="app-title">
                        <div>
                            <h1><i className="fa fa-dashboard"></i> {this.state.editusername}</h1>
                            {/* <p>A free and open source Bootstrap 4 admin template</p> */}
                        </div>
                        <ul className="app-breadcrumb breadcrumb">

                            <Link to="/dashboard" className="btn btn-primary">
                                <i className="fa  fa-lg" /> Back
                  </Link>
                        </ul>
                    </div>

                    {/** ------------start data table----------------- */}
                    <div className="row">
                        <div className="col-md-12 tile">
                            <div className="text-center">
                                <button onClick={this.getPreviousDate}>Previous</button><input type="text" name="selectdate" id="reactroot" newdate={this.state.selectedDate} readOnly value={this.state.selectedDate} />{this.state.selectedDate == this.compare() ? <button disabled onClick={this.getNextDate}>Next</button> : <button onClick={this.getNextDate} >Next</button>}
                            </div>
                            <br />
                            {newloading ? <div className="col-md-4 offset-md-4"><img src={image} /></div> : <div>

                                <div className="form-group text-left border"> <br />
                                    {(() => {
                                        if (this.state.allemployees && this.state.allemployees.length > 0) {
                                            return (this.state.allemployees.map((employee) =>
                                                <div className="md-offset-2 col-md-12">
                                                    <p><b>Checked In Time : </b>   {this.convertTimestamp(employee.checkedInTime)}</p>
                                                    <p><b>Location :</b> {employee.location_name}</p>
                                                    <hr />
                                                </div>
                                            ))
                                        }
                                        else {
                                            return (<div className="md-offset-2 col-md-12">
                                                <p><b>No Record Found</b></p>
                                                <hr />
                                            </div>)

                                        }
                                    })()}

                                </div>
                            </div>
                            }


                        </div>
                    </div>

                </div >
            </div >
        );
    }
}