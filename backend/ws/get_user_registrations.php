<?php
	header("Access-Control-Allow-Origin: *");
	include('../inc/connect.php');
	include('../inc/utils.php');

	$token 	    	= getValueFromArray($_GET, 'token', '');
	$user_id 	    = getValueFromArray($_GET, 'user_id', '');

	$rows = [];

	if ( $token == md5($YOUR_TOKEN_SALT.''.date('d/m/Y')) ) {

		$sql = "SELECT day.id as did FROM `register`, day  WHERE user_id=".$user_id." and register.day_id=day.id and DATE(day.date)>=DATE(NOW()) order by day.date ASC";
						
		$query = $conn->query($sql);

		if ($query->num_rows > 0) {
			while( $result = $query->fetch_assoc() ) {

				$day_id = $result['did'];
				
				$sql2="SELECT register.*,day.*,(select sum(register.parking) from register where day_id='".$day_id."') as parkingused , (select count(canteen_registration.id) from canteen_registration where canteen_registration.day_id='".$day_id."') as cantineused, location.id,location.name  FROM `register`, day, location WHERE user_id='".$user_id."' and register.day_id=day.id and day.id IN (SELECT day.id as did FROM `register`, day  WHERE user_id='".$user_id."' and register.day_id=day.id and day.id=".$day_id." ) and day.location_id=location.id order by day.date ASC";
				
				$query2 = $conn->query($sql2);

				if ($query2->num_rows > 0) {
					while( $result2 = $query2->fetch_assoc() ) {
						$rows[] = $result2;
					}
				}
			}
		}
	} else {
	   	header($_SERVER['SERVER_PROTOCOL'] . ' 401 unauthorized access denied due to invalid credentials', true, 401);die;
	}

	echo json_encode($rows);
?>