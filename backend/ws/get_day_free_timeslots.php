<?php
	header("Access-Control-Allow-Origin: *");
	include('../inc/connect.php');
	include('../inc/utils.php');

	$token 	    	= getValueFromArray($_GET, 'token', '');
	$day_id 	    = getValueFromArray($_GET, 'day_id', '');

	$rows = [];

	if ( $token == md5($YOUR_TOKEN_SALT.''.date('d/m/Y')) ) {

		$sql = "SELECT canteen_timeslots.id as idct,timeslot,  canteen_timeslots.places_nb,count(canteen_registration.id) as nbre, location.id,location.name FROM canteen_timeslots, canteen_registration,day, location WHERE canteen_timeslots.location_id=location.id and day.id=$day_id and day.location_id=location.id and timeslot_id=canteen_timeslots.id AND day_id=$day_id group by timeslot UNION Select canteen_timeslots.id as idct,timeslot, canteen_timeslots.places_nb, 0, location.id,location.name  from canteen_timeslots, day,location where canteen_timeslots.location_id=location.id and day.id=$day_id and day.location_id=location.id and status=1 and canteen_timeslots.id not in (SELECT canteen_timeslots.id FROM canteen_timeslots, canteen_registration WHERE timeslot_id=canteen_timeslots.id AND day_id=$day_id) group by timeslot order by timeslot ASC";
						
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