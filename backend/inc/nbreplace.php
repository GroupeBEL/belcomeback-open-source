<?php

	$nbreplace		=	0;
	$start_time		=	'00:00:01';
	$end_time		=	'23:59:59';
	
	$sql 		= "SELECT * FROM `quota` WHERE location_id=".$location_id;
	$query 		= $conn->query($sql);
	
	while($result = $query->fetch_assoc()) {
		$nbreplace				=	$result['places_nb'];
		$start_time				=	$result['start_time'];
		$end_time				=	$result['end_time'];
		$allowed_booking_nb		=	$result['allowed_booking_nb'];
		$gs_contact				=	$result['gs_contact'];
		$nurse_contact			=	$result['nurse_contact'];
	}

?>