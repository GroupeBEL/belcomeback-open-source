<?php
	header("Access-Control-Allow-Origin: *");
	include('../inc/connect.php');
	include('../inc/utils.php');

	$token 	    = getValueFromArray($_GET, 'token', '');
	
	if ( $token == md5($YOUR_TOKEN_SALT.''.date('d/m/Y')) ) {
		if(!isset($timeslot_id)){
			$timeslot_id	=	getValueFromArray($_GET, 'timeslot', '');
			$location_id	=	getValueFromArray($_GET, 'location', '');
			$day 			=	getValueFromArray($_GET, 'day', '');
		} else {
		    $day 			=	date('d-m-Y', strtotime('+1 day'));
		}

		//Get number of subscribed persons by day, location and timeslot
	    $sql = "SELECT canteen_registration.* FROM canteen_registration, canteen_timeslots,day WHERE timeslot_id = '".$timeslot_id."' and timeslot_id=canteen_timeslots.id and location_id='".$location_id."' and day_id=day.id and DATE(`date`)=DATE('".$day."')";

	    $query 	= $conn->query($sql);
	    $result = mysqli_num_rows($query);

	    echo $result; 
	} else {
	    header($_SERVER['SERVER_PROTOCOL'] . ' 401 unauthorized access denied due to invalid credentials', true, 401);die; 
	}
?>