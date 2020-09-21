<?php
	include('../inc/connect.php');
	include('../inc/utils.php');

    $user_id	= getValueFromArray($_GET, 'user_id', '0');

	$rand_salt 	= generateRandomString(15);
	$fix_salt	= (int) 6*((int) $user_id +3)/2; 
	$salt 		= $fix_salt.''.$rand_salt;
	$token 		= hash('sha256', $salt.''.date('d/m/Y')); 

	$sql 		= "INSERT INTO user_token(user_id, salt, token) VALUES ('$user_id', '$salt', '$token')";

	if (mysqli_query($conn, $sql)) {
		echo json_encode(['data' => 'OK', 'code' => 200, 'token' => $token]);
	} else {
	    echo json_encode(['data' => 'Error while generating token', 'code' => 500]);
	}
	die;
?>