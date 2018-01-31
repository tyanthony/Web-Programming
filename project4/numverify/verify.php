<?php
session_start();

$numverifyAPIKey = '2634688cd36535aa957ea04db214bdb1';

if (!isset($_SESSION['valid']) || $_SESSION['valid'] === false){
    header("Location: ../login/login.php",true,302);
    return;
} else {
    $number = $_GET['number'];
    $contents = file_get_contents('http://apilayer.net/api/validate?access_key=2634688cd36535aa957ea04db214bdb1&number='.$number);

    if (is_null($contents)) {
        echo http_response_code(400);
    }
    else {
        echo $contents;
    }

}

?>
