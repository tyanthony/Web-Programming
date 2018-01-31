<?php
session_start();
if(!isset($_SESSION['valid']) || $_SESSION['valid'] === false){
    header("Location: ../login/login.php",true,302);
    return;
}

?>

<!DOCTYPE html>
<h1>Phone number looker-upper</h1>
<p>Enter a phone number with the country code at the beginnning</p>
<input type="number" id="phoneNumber" pattern="[0-9]*" inputmode="numeric">
<button id="search">Search</button>
<p id="results">No results yet</p>
<div id="resultsContainer"></div>

<script type="text/javascript" src="phoneNumber.js"></script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
