// login.js

var showError = (msg) => {
	var errorNode = document.getElementById("error");
	if(msg == "" || msg == false){
		//hide error
		errorNode.style = "visibility: hidden;";
		return;
	}
	errorNode.innerHTML = msg;
	errorNode.style = "";
};

var validate = () => {
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;

	if(username === "" || password === ""){
		showError("All fields are required.");
		return false;
	}

	if(username.length > 25){
		showError("Your username cannot be longer than 25 characters.");
		return false;
	}
	if(password.length > 100){
		showError("Your password cannot be longer than 100 characters.");
		return false;
	}
	//we're here, no errors, hide error box
	showError(false);

	return true;
};

var submitButton = document.getElementById('submit');
submitButton.onclick = () => {
    var isValid = validate();
    if (isValid) {
        console.log("submitted");
		return true;
    }
    else {
        console.log("NOT submitted");
		return false;
    }
};

// var onSubmit = () =>{
// 	if(!validate()){
// 		return false;
// 	}
//
// 	var buttonNode = document.getElementById("submit");
// 	buttonNode.innerText = "Submitting, please wait...";
//
// 	return true;
// };

var signupButton = document.getElementById('signup');
signupButton.onclick = () => {
    document.location.href = 'register.php';
    console.log(document.location.href);
};
//
// var onLoad = () => {
// 	var formNode = document.getElementById("form");
//
// 	formNode.onsubmit = onSubmit;
//
// 	if (errorMessage){
// 		showError(errorMessage);
// 	}
// };
// window.addEventListener("load",onLoad,false);
