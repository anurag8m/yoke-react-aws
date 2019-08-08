import axios from "axios";

export const register = newUser => {
  return axios
    .post("http://54.89.216.159:3000/signup", {
      name: newUser.name,
      phone: newUser.phone,
      pass: newUser.pass
    })
    .then(res => {
      console.log("Registered!");
    });
};

export const login = user => {
  return axios
    .post("http://54.89.216.159:3000/newlogin", {
      phone: user.phone,
      pass: user.password
    })
    .then(res => {
      localStorage.setItem("usertoken", res.data);
      return res.data;
    })
    .catch(err => {
      console.log(err.response.data.msg);
    });
};

export const myprofile = user => {
  var headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("usertoken")
  };
  return axios
    .get("http://54.89.216.159:3000/profile", { headers: headers })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
    });
};

//edit and update employee 
export const edituser = user => {
  return axios
    .post("http://54.89.216.159:3000/updateuser", {
      edituseremail: user.edituseremail,
      editusertype: user.editusertype,
      editusername: user.editusername,
      edituserphone: user.edituserphone,
      pass: user.edituserpass,
      edituserempid: user.edituserempid,
      edituserdoj: user.edituserdoj,
      edituserusername: user.edituserusername,
      edituserdesignation: user.edituserdesignation,
      edituserdepartment: user.edituserdepartment,
      employeeUnder: user.employeeUnder,
      edituserisactive: user.edituserisactive,
      requestedId: user.requestedId
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
    });
};

// logout from device
export const logoutdevice = user => {
  return axios
    .post("http://54.89.216.159:3000/logout", {
      deviceId: user.logoutdevicedeviceid,
      user_id: user.logoutdeviceuserid
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
    });
};


// create employee API
export const createemployee = user => {
  return axios
    .post("http://54.89.216.159:3000/signup", {
      email: user.email,
      pass: user.password,
      name: user.name,
      phone: user.phone,
      employee_id: user.employeeid,
      doj: user.dateofjoining,
      associatedDept: user.dapartment,
      associatedCompany: user.companyId,
      designation: user.designation,
      employeeUnder: user.employeeunder
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
    });
}