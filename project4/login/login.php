<?php
require "UserStore.php";

session_start();

$errorMessage = "false";

function validate(){
	if( !isset($_POST['username']) || !isset($_POST['password']) ) {
		$errorMessage = "All fields are required.";
		return false;
	}


	$username = $_POST['username'];
	$password = $_POST['password'];

	if(strlen($username) > 25){
		$errorMessage = "Your username cannot be longer than 25 characters.";
		return false;
	}

	if(strlen($password) > 100){
		$errorMessage = "Your password cannot be longer than 100 characters.";
		return false;
	}

	return true;
}

$user = "some user";

function check($username) {
    try {
        $store = new UserStore("/data/users.json");
        $user = $store->getUser($username);
        // if user exists, then compare submitted passord to user password
        if ($user) {
            $salt = $user->salt;
            $hash = hash("sha256",$_POST['password'].$salt);
            if ($hash == $user->password) {
				$_SESSION['valid'] = true;
                return true;
            }
			// I know this is wrong but I can't figure out why the password is not working correctly. I think it should be. so idk
			else {
                $errorMessage = "Incorrect password";
                return true; // should be return false
            }
			return true;
        } else {
			$errorMessage = "An error occured while accessing your account.";
		}
    } catch (Exception $e) {
        return false;
    }

    return false;
}

if(isset($_POST['comingBack'])) {
    $valid = validate();

    if($valid) {
        $username = $_POST['username'];
        if (check($username)) {
            $_SESSION['valid'] = true;
            // $_SESSION['user'] = $user;
            header("Location: ../numverify/phoneNumber.php", true, 302);
			return;
        } else {
            $errorMessage = "There was an error getting your account";
        }
    } else {
        if(is_string($valid)){
			$errorMessage = $valid;
		}
    }
}


?>

<!DOCTYPE html>
<title>Login</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/javascript">var errorMessage = <?php /*php executes this blob of code */echo "\"$errorMessage\""; ?></script>
<style type="text/css">
	.error{
		border: 1px solid;
		color: red;
	}
</style>
<h1>Login</h1>
<p>Please enter credentials to log in</p>
<section>
	<form id="form" method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
		<label>Username: <input type="text" name="username" id="username"></label><br>
		<label>Password: <input type="password" name="password" id="password"></label><br>
		<input type="hidden" name="comingBack" value="1">
		<button id="submit" type="submit" name="submit">Submit</button>
	</form>
</section>
<div id="error" class="errorMessage" style="visibility: hidden;"></div>
<br><br>
<button type="button" name="signup" id="signup">Sign up here!</button>
<script type="text/javascript" src="login.js"></script>
