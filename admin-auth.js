function adminLogin(){

let user=document.getElementById("adminUser").value;

let pass=document.getElementById("adminPass").value;


/* ADMIN LOGIN DETAILS */

let adminUser="roni";
let adminPass="12345";


if(user===adminUser && pass===adminPass){

localStorage.setItem("adminLogin","true");

window.location.href="admin.html";

}

else{

alert("Wrong Admin Login");

}

}



function checkAdmin(){

if(localStorage.getItem("adminLogin")!=="true"){

window.location.href="admin-login.html";

}

}
