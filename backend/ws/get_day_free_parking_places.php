<?php
	header("Access-Control-Allow-Origin: *");
	include('../inc/connect.php');
	include('../inc/utils.php');

	$token 	    	= getValueFromArray($_GET, 'token', '');
	$day_id 	    = getValueFromArray($_GET, 'day_id', '');

	$rows = [];

	if ( $token == md5($YOUR_TOKEN_SALT.''.date('d/m/Y')) ) {

		$sql = "SELECT sum(parking) as nbrParkingRsv FROM `register` WHERE day_id=$day_id";

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