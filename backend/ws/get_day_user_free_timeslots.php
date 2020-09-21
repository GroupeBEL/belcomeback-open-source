<?php
	header("Access-Control-Allow-Origin: *");
	include('../inc/connect.php');
	include('../inc/utils.php');

	$token 	    	= getValueFromArray($_GET, 'token', '');
	$day_id 	    = getValueFromArray($_GET, 'day_id', '');
	$user_id 	    = getValueFromArray($_GET, 'user_id', '');

	$rows = [];

	if ( $token == md5($YOUR_TOKEN_SALT.''.date('d/m/Y')) ) {

		$sql = "SELECT canteen_registration.id as id,timeslot,timeslot_id FROM `canteen_registration`, canteen_timeslots WHERE timeslot_id=canteen_timeslots.id and day_id=$day_id and user_id=$user_id order by timeslot ASC";

		$query = $conn->query($sql);

		if ($query->num_rows > 0) {
			while( $result = $query->fetch_assoc() ) {
				$rows[] = $result;
			}
		}
	} else {
	   	header($_SERVER['SERVER_PROTOCOL'] . ' 401 unauthorized access denied due to invalid credentials', true, 401);die;
	}

	echo json_encode($rows);
?>