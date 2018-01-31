window.onkeyup = keyup;
var googleMapsAPIKey = 'AIzaSyBpBmQUz5Griy7GRU09oW2t2_rL1LakM3w';
// var numverifyAPIKey = '2634688cd36535aa957ea04db214bdb1';

// when user hits "Enter" to search
function keyup(e) {
    var phoneNumber = e.target.value;
    if (e.keyCode == 13) {
        getPhoneInfo(phoneNumber);
    }
}

// when user clicks the "Search" button
var button = document.getElementById('search');
button.onclick = function() {
    var phoneNumber = document.getElementById('phoneNumber').value;
    getPhoneInfo(phoneNumber);
};

// retrieves phone information from Numverify
var getPhoneInfo = (num) => {
    axios.get('verify.php', {
        params: {
            number: num
        }
    }).then(function(response) {
        console.log(response);
        if (response.data.valid) {
            displayInfo(response.data);
        }
        else {
            document.getElementById('results').innerHTML = "Phone number could not be found";
            document.getElementById('resultsContainer').innerHTML = "";
        }
    }).catch(function(error) {
        console.log(error);
    });
};

var displayInfo = (obj) => {
    var addMap = false;

    document.getElementById('results').innerHTML = "Phone number is valid!";
    var mydiv = document.getElementById('resultsContainer');
    // create element for country name
    if (obj.country_name) {
        var myp = document.createElement('p');
        myp.innerHTML = "Country: " + obj.country_name;
        mydiv.appendChild(myp);
        addMap = true;
    }
    else {
        var myp = document.createElement('p');
        myp.innerHTML = "Country not supplied";
        mydiv.appendChild(myp);
    }

    // create element for line type
    if (obj.line_type) {
        var myp = document.createElement('p');
        myp.innerHTML = "Line type: " + obj.line_type;
        mydiv.appendChild(myp);
    }
    else {
        var myp = document.createElement('p');
        myp.innerHTML = "Line type not supplied";
        mydiv.appendChild(myp);
    }

    // add map if valid country type, called in previous if statement
    if (addMap) {
        var myiframe = document.createElement('iframe');
        myiframe.width = "700";
        myiframe.height = "600";
        myiframe.src = "https://www.google.com/maps/embed/v1/place?key=" + googleMapsAPIKey
        + "&q=" + obj.country_name;
        mydiv.appendChild(myiframe);
    }
}
