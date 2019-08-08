import React, { Component } from "react";
import HeaderPage from "./header.component.js";
import '../dashboard/dashboard.css';
import axios from 'axios';
import LoadingSpinner from './loadingspinner.component.js';
import image from '../images/lg.rotating-balls-spinner.gif';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import jwt_decode from 'jwt-decode';
import { edituser } from "./UserFunctions";

export default class CreateEmployeePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            loading: false,
            newloading: true,
            department: [],
            selectedDepartment: "",
            validationError: "",
            companyId: "",
            allemployyes: [],
            allemployyes1: [],
            allemployyes2: [],
            edituseremail: "",
            editusertype: "",
            editusername: "",
            edituserempid: "",
            edituserdoj: "",
            edituserdepartment: "",
            edituserdesignation: "",
            employeeUnder: "",
            edituserisactive: false,
            edituserphone: "",
            edituserpass: "",
            message: '',
            employeeIdInArray: [],
            employeeNameInArray: [],
            getNumericValue: 0,
            updateValue: 0

        };

        this.handleShow = () => {
            // code to push underemployeeid in an array
            var employeeIdInArray = this.state.employeeIdInArray;
            var employeeNameInArray = this.state.employeeNameInArray;
            this.state.employeeUnder.map((employeeUnderUser) =>
                employeeIdInArray.push(employeeUnderUser.employ._id))
            this.state.employeeUnder.map((employeeUnderUser) =>
                employeeNameInArray.push(employeeUnderUser.employ.name))
            this.setState({ employeeIdInArray: employeeIdInArray, employeeNameInArray: employeeNameInArray });

            // end code to push underemployeeid in an array
            this.setState({ show: true });
        };

        this.handleHide = () => {

            this.state.employeeUnder.map((employeeUnderUser) => this.state.allemployyes1.push(employeeUnderUser.employ._id))
            this.setState({ show: false, allemployyes: this.state.employeeIdInArray });
            console.log(this.state.allemployyes);
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
            })
            .then(data => {
                let teamsFromApi = data.departmentsFound.map(team => {
                    return { value: team._id, display: team.departmentName }
                })
                this.setState({ department: teamsFromApi });
                console.log(this.state.department);
            })

            .catch(error => {
                console.log(error);
            });


        //get detail of the employee based on ID
        var requestedId = this.props.match.params.id;
        var apiUrl = `http://54.89.216.159:3000/empdetail/${requestedId}`;
        axios.get(apiUrl)
            .then(response => {
                return response;
            }).then(data => {
                console.log(data.data.empdetail);

                this.setState({
                    newloading: false,
                    edituseremail: data.data.empdetail[0] && data.data.empdetail[0].email,
                    editusertype: data.data.empdetail[0] && data.data.empdetail[0].usertype,
                    editusername: data.data.empdetail[0] && data.data.empdetail[0].name,
                    edituserphone: data.data.empdetail[0] && data.data.empdetail[0].phone,
                    edituserpass: data.data.empdetail[0] && data.data.empdetail[0].pass,
                    edituserempid: data.data.empdetail[0] && data.data.empdetail[0].employee_id,
                    edituserdoj: data.data.empdetail[0] && data.data.empdetail[0].doj,
                    edituserusername: data.data.empdetail[0] && data.data.empdetail[0].username,
                    edituserdesignation: data.data.empdetail[0] && data.data.empdetail[0].designation,
                    edituserdepartment: data.data.empdetail[0] && data.data.empdetail[0].associatedDept._id,
                    employeeUnder: data.data.empdetail[0] && data.data.empdetail[0].employeeUnder,
                    edituserisactive: data.data.empdetail[0] && data.data.empdetail[0].isactive
                })
            }).catch(error => {
                console.log(error);
            });


        //employeelist on the basis of CompanyID
        var handle = this.state.companyId;
        var apiUrl = `http://54.89.216.159:3000/allemployeeslist/${handle}`;

        axios.get(apiUrl)
            .then(getresponseemp => {
                console.log(getresponseemp);
                return getresponseemp;
            }).then(data => {
                let depempFromApi = data.data.allemployeeslist.map(employee => { return { empid: employee.employee_id, empname: employee.name, empmainid: employee._id } })
                this.setState({ allemployees: depempFromApi });

            }).catch(error => {
                console.log(error);
            });

    }
    onChangeInput() {
        const currentVal = this.state.edituserisactive;
        this.setState({
            edituserisactive: !currentVal
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

        var allemployyes2 = this.state.allemployyes2;
        const { value, checked } = event.target; // get id and checked status
        var allemployyes1 = this.state.allemployyes1;
        var employeeIdInArray = this.state.employeeIdInArray;
        var employeeNameInArray = this.state.employeeNameInArray;
        var username_push = event.target.getAttribute("getUsername");
        // Add to an array if checked and remove - if uncheck
        if (checked) {
            employeeIdInArray.push(value);

            allemployyes1.push(value);
            allemployyes2.push(username_push);
            employeeNameInArray.push(username_push);
        } else {
            allemployyes1 = allemployyes1.filter(id => id !== value);
            var index = employeeIdInArray.indexOf(value)
            if (index !== -1) {
                employeeIdInArray.splice(index, 1);
                this.setState({ employeeIdInArray: employeeIdInArray });
            }
            var index1 = employeeNameInArray.indexOf(username_push)
            if (index1 !== -1) {
                employeeNameInArray.splice(index1, 1);
                this.setState({ employeeNameInArray: employeeNameInArray });
            }
            // employeeIdInArray = employeeIdInArray.filter(id => id !== value);
        }

        this.setState({ allemployyes1: allemployyes1, allemployyes2: allemployyes2, employeeIdInArray: employeeIdInArray, employeeNameInArray: employeeNameInArray, getNumericValue: 2, updateValue: 1 });

    }

    onSubmit(e) {
        if (this.state.allemployyes.length == 0 && this.state.updateValue == 0) {
            this.state.employeeUnder.map((employeeUnderUser) => this.state.allemployyes1.push(employeeUnderUser.employ._id))
            this.state.allemployyes = this.state.allemployyes1;
        }

        var requestedId = this.props.match.params.id;

        this.setState({
            loading: true,
        })
        e.preventDefault();
        const user = {
            edituseremail: this.state.edituseremail,
            editusertype: this.state.editusertype,
            editusername: this.state.editusername,
            edituserphone: this.state.edituserphone,
            edituserpass: this.state.edituserpass,
            edituserempid: this.state.edituserempid,
            edituserdoj: this.state.edituserdoj,
            edituserusername: this.state.edituserusername,
            edituserdesignation: this.state.edituserdesignation,
            edituserdepartment: this.state.edituserdepartment,
            employeeUnder: this.state.allemployyes,
            edituserisactive: this.state.edituserisactive,
            requestedId: requestedId
        };
        console.log(user);
        // return false;
        edituser(user).then((res, err) => {
            // var redirectUrl = `/editemployee/${requestedId}`;
            if (res) {
                this.setState({
                    loading: false,
                    message: "User updated successfully"
                })
                this.props.history.push('/employeelist');
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



        const { loading, message, newloading } = this.state;

        return (
            <div className="app sidebar-mini rtl">
                <HeaderPage />
                <div className="app-content">
                    <div className="app-title">
                        <div>
                            <h1><i className="fa fa-dashboard"></i> Edit Employee</h1>
                            {/* <p>A free and open source Bootstrap 4 admin template</p> */}
                        </div>

                        <ul className="app-breadcrumb breadcrumb">
                            <li className="breadcrumb-item"><i className="fa fa-home fa-lg"></i></li>
                            <li className="breadcrumb-item"><a href="#">Edit Employee</a></li>
                        </ul>
                    </div>

                    {/** ------------start data table----------------- */}
                    <div className="row">
                        <div className="col-md-12">
                            {newloading ? <div className="col-md-4 offset-md-4"><img src={image} /></div> :
                                <div className="tile addemployeeTile">
                                    {message !== '' && message == 'User updated successfully' &&
                                        <div class="alert alert-success alert-dismissible" role="alert">
                                            {message}
                                            <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                                        </div>
                                    }
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
                                                                id="edituseremail"
                                                                name="edituseremail"
                                                                onChange={this.onChange}
                                                                required="required"
                                                                value={this.state.edituseremail}
                                                            />

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-5">
                                                    <div className="form-group">
                                                        <label htmlFor="pass"><b>Password</b></label>
                                                        <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <span className="glyphicon glyphicon-envelope" />
                                                            </span>
                                                            <input
                                                                type="text"
                                                                className='form-control'
                                                                id="edituserpass"
                                                                name="edituserpass"
                                                                onChange={this.onChange}
                                                                placeholder=""
                                                                required="required"
                                                                value={this.state.edituserpass}
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
                                                                id="editusername"
                                                                name="editusername"
                                                                placeholder=""
                                                                onChange={this.onChange}
                                                                required="required"
                                                                value={this.state.editusername}
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
                                                                id="edituserphone"
                                                                name="edituserphone"
                                                                placeholder=""
                                                                onChange={this.onChange}
                                                                required="required"
                                                                value={this.state.edituserphone}
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
                                                                id="edituserempid"
                                                                name="edituserempid"
                                                                placeholder=""
                                                                onChange={this.onChange}
                                                                required="required"
                                                                value={this.state.edituserempid}
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
                                                                id="edituserdoj"
                                                                name="edituserdoj"
                                                                placeholder=""
                                                                onChange={this.onChange}
                                                                required="required"
                                                                value={this.state.edituserdoj}
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
                                                            <select className="form-control" id="edituserdepartment" name="edituserdepartment" onChange={this.onChange} value={this.state.edituserdepartment}>
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
                                                                id="edituserdesignation"
                                                                name="edituserdesignation"
                                                                placeholder=""
                                                                required="required"
                                                                onChange={this.onChange}
                                                                value={this.state.edituserdesignation}
                                                            />

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="offset-sm-1 col-md-5">
                                                    <div className="form-group">
                                                        <label htmlFor="editusertype"><b>User Type</b></label>
                                                        <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <span className="glyphicon glyphicon-envelope" />
                                                            </span>
                                                            <select name="editusertype" className="form-control" value={this.state.editusertype} onChange={this.onChange}>
                                                                <option value="">Select</option>
                                                                <option value="Employee" >Employee</option>
                                                                <option value="Manager" >Manager</option>
                                                            </select>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-5">
                                                    <div className="form-group">
                                                        <label htmlFor="department"><b>Username</b></label>
                                                        <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <span className="glyphicon glyphicon-envelope" />
                                                            </span>
                                                            <input
                                                                type="text"
                                                                className='form-control'
                                                                id="edituserusername"
                                                                name="edituserusername"
                                                                placeholder=""
                                                                onChange={this.onChange}
                                                                value={this.state.edituserusername}
                                                            />
                                                            <div style={{ color: 'red', marginTop: '5px' }}>
                                                                {this.state.validationError}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="offset-sm-1 col-md-5">
                                                    <div className="form-group">
                                                        <label htmlFor="fgh">
                                                            Is Active ? <input className="" type="checkbox" style={{ marginLeft: '10px' }} name="edituserisactive" checked={this.state.edituserisactive.toString() == "true" ? true : false} onChange={this.onChangeInput.bind(this)} />
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
                                                <div className="offset-sm-1 col-md-5">
                                                    <div className="form-group">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary btn-block pull-right"
                                                            id="btnContactUs"
                                                        >
                                                            {loading ? <LoadingSpinner /> : "Update"}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-md-5">
                                                    <div className="form-group">
                                                        <label htmlFor="employeeUnder"><b>Employee Under</b></label>
                                                        <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <span className="glyphicon glyphicon-envelope" />
                                                            </span>
                                                            <table className="table-condensed">
                                                                <tbody>
                                                                    {this.state.getNumericValue == 0 ? this.state.employeeUnder.map((employeeUnderUser) =>
                                                                        <tr key={employeeUnderUser.employ._id} >
                                                                            <td><i class="fa fa-check" aria-hidden="true"></i>&nbsp;&nbsp;{employeeUnderUser.employ.name}</td>
                                                                        </tr>) : this.state.employeeNameInArray.map((test) =>
                                                                            <tr >
                                                                                <td><i class="fa fa-check" aria-hidden="true"></i>&nbsp;&nbsp;{test}</td>
                                                                            </tr>)}

                                                                </tbody></table>
                                                        </div>
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
                                                                    return (this.state.allemployees.map((employee) =>
                                                                        <tr key={employee.empmainid}>
                                                                            <td>{employee.empname}</td>
                                                                            <td>{employee.empid}</td>
                                                                            <td><input onChange={this.handleCheckbox} getUsername={employee.empname} className="" type="checkbox" name={employee.empmainid} value={employee.empmainid} checked={this.state.employeeIdInArray.includes(employee.empmainid) ? true : false} /></td>
                                                                        </tr>))
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
                            }


                        </div>
                    </div>
                    {/** ------------end data table----------------- */}
                </div >
            </div >
        );
    }
}