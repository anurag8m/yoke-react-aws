import React, { Component } from "react";
import HeaderPage from "./header.component.js";
import '../dashboard/dashboard.css';
import axios from 'axios';
import LoadingSpinner from './loadingspinner.component.js';
import $ from "jquery";
import Popper from "popper.js";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import jwt_decode from 'jwt-decode';
import { createemployee } from './UserFunctions';
import DocumentMeta from 'react-document-meta';

export default class CreateEmployeePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            loading: false,
            department: [],
            selectedDepartment: "",
            validationError: "",
            companyId: "",
            allemployees: [],
            email: "",
            password: "",
            name: "",
            phone: "",
            employeeid: "",
            dateofjoining: "",
            dapartment: "",
            designation: "",
            isactive: "",
            allemployyes: [],
            allemployyes1: []

        };

        this.handleShow = () => {
            this.setState({ show: true });
        };

        this.handleHide = () => {

            this.setState({ show: false, allemployyes: this.state.allemployyes1 });
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
    }

    componentWillMount() {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            companyId: decoded.companyId
        })


    }
    componentDidMount() {

        // get department on the basis of company ID
        var handle = this.state.companyId;

        var apiUrl = `http://54.89.216.159:3000/viewDept/${handle}`;

        fetch(apiUrl)
            .then(response => {
                return response.json();
            }).then(data => {
                let teamsFromApi = data.departmentsFound.map(team => { return { value: team._id, display: team.departmentName } })
                this.setState({ department: teamsFromApi });
            }).catch(error => {
                console.log(error);
            });

    }

    onChange(e) {
        const { name, value } = e.target;
        this.setState({ [e.target.name]: e.target.value });
        if ([e.target.name] == "dapartment") {
            let departmentid = e.target.value;
            let companyid = this.state.companyId;
            axios
                .post("http://54.89.216.159:3000/getcmpnydeptemployee", {
                    associatedCompany: companyid,
                    associatedDept: departmentid
                })
                .then(getresponse => {
                    return getresponse;
                }).then(data => {
                    let depempFromApi = data.data.departmentEmployees.map(employee => { return { empid: employee.employee_id, empname: employee.name, empmainid: employee._id } })
                    this.setState({ allemployees: depempFromApi });

                }).catch(error => {
                    console.log(error);
                });
        }

    }

    handleCheckbox(event) {
        const { value, checked } = event.target; // get id and checked status
        var allemployyes1 = this.state.allemployyes1;

        // Add to an array if checked and remove - if uncheck
        if (checked) {
            allemployyes1.push(value);
        } else {

            allemployyes1 = allemployyes1.filter(id => id !== value);
        }

        this.setState({ allemployyes1: allemployyes1 });
        console.log(this.state.allemployyes1);
    }


    onSubmit(e) {

        this.setState({
            loading: true,
        })
        e.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password,
            name: this.state.name,
            phone: this.state.phone,
            employeeid: this.state.employeeid,
            dateofjoining: this.state.dateofjoining,
            dapartment: this.state.dapartment,
            designation: this.state.designation,
            isactive: this.state.isactive,
            employeeunder: this.state.allemployyes,
            companyId: this.state.companyId
        };

        createemployee(user).then((res, err) => {
            if (res) {
                this.props.history.push("/employeelist");
            }
            else {
                this.setState({
                    loading: false,
                    message: "Login Error : Phone and Password doesn't matched"
                })
            }
        });

    }

    render() {
        const meta = {
            title: 'Some Meta Title',
            description: 'I am a description, and I can create multiple tags',
            canonical: 'http://example.com/path/to/page',
            meta: {
                charset: 'utf-8',
                name: {
                    keywords: 'react,meta,document,html,tags'
                }
            }
        };

        const { loading } = this.state;
        return (

            <div className="app sidebar-mini rtl">
                <DocumentMeta {...meta} />
                <HeaderPage />
                <div className="app-content">
                    <div className="app-title">
                        <div>
                            <h1><i className="fa fa-dashboard"></i> Add Employee</h1>
                            {/* <p>A free and open source Bootstrap 4 admin template</p> */}
                        </div>
                        <ul className="app-breadcrumb breadcrumb">
                            <li className="breadcrumb-item"><i className="fa fa-home fa-lg"></i></li>
                            <li className="breadcrumb-item"><a href="#">Add Employee</a></li>
                        </ul>
                    </div>

                    {/** ------------start data table----------------- */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="tile addemployeeTile">

                                <form onSubmit={this.onSubmit} noValidate>

                                    <div className="input-class-field employeeAdd">
                                        <div className="row">
                                            <div className="offset-sm-1 col-md-5">
                                                <div className="form-group">
                                                    <label htmlFor="email"><b>Email</b></label>
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <span className="glyphicon glyphicon-envelope" />
                                                        </span>
                                                        <input
                                                            type="email"
                                                            className='form-control'
                                                            id="email"
                                                            name="email"
                                                            onChange={this.onChange}
                                                            placeholder="anyone@example.com"
                                                            required="required"
                                                            value={this.state.email}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-5">
                                                <div className="form-group">
                                                    <label htmlFor="password"><b>Password</b></label>
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <span className="glyphicon glyphicon-envelope" />
                                                        </span>
                                                        <input
                                                            type="password"
                                                            className='form-control'
                                                            id="password"
                                                            name="password"
                                                            onChange={this.onChange}
                                                            placeholder="********"
                                                            required="required"
                                                            value={this.state.password}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="offset-sm-1 col-md-5">
                                                <div className="form-group">
                                                    <label htmlFor="name"><b>Name</b></label>
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <span className="glyphicon glyphicon-envelope" />
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className='form-control'
                                                            id="name"
                                                            name="name"
                                                            placeholder=""
                                                            onChange={this.onChange}
                                                            required="required"
                                                            value={this.state.name}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-5">
                                                <div className="form-group">
                                                    <label htmlFor="phone"><b>Phone</b></label>
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <span className="glyphicon glyphicon-envelope" />
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className='form-control'
                                                            id="phone"
                                                            name="phone"
                                                            placeholder=""
                                                            onChange={this.onChange}
                                                            required="required"
                                                            value={this.state.phone}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="offset-sm-1 col-md-5">
                                                <div className="form-group">
                                                    <label htmlFor="employeeid"><b>Employee ID</b></label>
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <span className="glyphicon glyphicon-envelope" />
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className='form-control'
                                                            id="employeeid"
                                                            name="employeeid"
                                                            placeholder=""
                                                            onChange={this.onChange}
                                                            required="required"
                                                            value={this.state.employeeid}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-5">
                                                <div className="form-group">
                                                    <label htmlFor="dateofjoining"><b>Date of Joining</b></label>
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <span className="glyphicon glyphicon-envelope" />
                                                        </span>
                                                        <input
                                                            type="date"
                                                            className='form-control'
                                                            id="dateofjoining"
                                                            name="dateofjoining"
                                                            placeholder=""
                                                            onChange={this.onChange}
                                                            required="required"
                                                            value={this.state.dateofjoining}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="offset-sm-1 col-md-5">
                                                <div className="form-group">
                                                    <label htmlFor="department"><b>Department</b></label>
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <span className="glyphicon glyphicon-envelope" />
                                                        </span>
                                                        <select className="form-control" id="dapartment" name="dapartment" onChange={this.onChange}>
                                                            <option value="">Please Select Department</option>
                                                            {this.state.department.map((team) => <option key={team.value} value={team.value}>{team.display}</option>)}
                                                        </select>
                                                        <div style={{ color: 'red', marginTop: '5px' }}>
                                                            {this.state.validationError}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-5">
                                                <div className="form-group">
                                                    <label htmlFor="designation"><b>Designation</b></label>
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <span className="glyphicon glyphicon-envelope" />
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className='form-control'
                                                            id="designation"
                                                            name="designation"
                                                            placeholder=""
                                                            required="required"
                                                            onChange={this.onChange}
                                                            value={this.state.designation}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                        </div><br />
                                        <div className="row">
                                            <div className="offset-sm-1 col-md-5">
                                                <div className="form-group">
                                                    <label htmlFor="fgh">
                                                        Is Active ? <input className="" type="checkbox" onChange={this.onChange} name="isactive" style={{ marginLeft: '10px' }} />
                                                    </label>



                                                </div>
                                            </div>
                                            <div className="col-md-5">
                                                <div className="form-group">
                                                    <a variant="primary" onClick={this.handleShow} style={{ cursor: 'pointer', fontWeight: '700', fontSize: '16px' }}><b>Choose Employee Under Him/Her</b></a>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="offset-sm-1 col-md-3">
                                                <div className="form-group">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary btn-block pull-right"
                                                        id="btnContactUs"
                                                    >
                                                        {loading ? <LoadingSpinner /> : "Login"}
                                                    </button>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    {/* Modal start */}
                                    <Modal
                                        show={this.state.show}
                                        onHide={this.handleHide}
                                        dialogClassName="modal-90w"
                                        aria-labelledby="example-custom-modal-styling-title"
                                        centered
                                        size="lg"
                                        selectedmember={this.state.selectedMember}
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title id="example-custom-modal-styling-title">
                                                Select Employee
                </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div class="form-group" id="sampleTableForEmployee">
                                                <table className="table table-hover table-bordered" id="sampleTable">
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Employee ID</th>
                                                            <th>Select</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(() => {
                                                            if (this.state.allemployees && this.state.allemployees.length > 0) {
                                                                return (this.state.allemployees.map((employee) => <tr key={employee.empmainid}><td>{employee.empname}</td><td>{employee.empid}</td><td><input onChange={this.handleCheckbox} className="" type="checkbox" name={employee.empmainid} value={employee.empmainid} checked={this.state.allemployyes1.includes(employee.empmainid)} /></td></tr>))


                                                            } else {
                                                                return (
                                                                    <tr><td colSpan="3" className="text-center" style={{ color: 'red', fontSize: '20px' }}>Sorry, There are no employees under the selected department</td></tr>
                                                                )
                                                            }
                                                        })()}


                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="form-group">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary pull-right"
                                                    id="btnContactUs"
                                                    onClick={this.handleHide}
                                                >
                                                    DONE
                                                        </button><br /><br />

                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                    {/* Modal end */}
                                </form>
                            </div>

                        </div>
                    </div>
                    {/** ------------end data table----------------- */}



                </div >
            </div>
        );
    }
}