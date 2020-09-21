<?php
	header("Access-Control-Allow-Origin: *");
	include('../inc/connect.php');
	include('../inc/utils.php');

	$token 	    	= getValueFromArray($_GET, 'token', '');
	$user_id 	    = getValueFromArray($_GET, 'user_id', '');

	$json = [];

	//get user location
	$sql     = "SELECT location FROM user WHERE id = '".$user_id."'";
	$query = $conn->query($sql);
	while ($result = $query->fetch_assoc()) {
		$location_id 	 = $result['location'];
	}


	// get booking opening and closing time
	$sql 		= "SELECT * FROM quota WHERE location_id = '".$location_id."'";
	$query 		= $conn->query($sql);
	while ($result = $query->fetch_assoc()) {
		$booking_opening = $result['booking_opening'];
		$booking_closure = ($result['booking_closure'] + $result['booking_opening']);
	}

	//get days
	$sql = "SELECT * FROM day WHERE location_id = '".$location_id."' and date(date)>=date(NOW() + INTERVAL ".$booking_opening." DAY) and date(date)<= date(NOW() + INTERVAL ".$booking_closure." DAY) order by date";
	$query = $conn->query($sql);

	while ($result = $query->fetch_assoc()) {
		$day_id 			= $result['id'];
		$date 				= $result['date'];
		$places_nb 			= $result['places_nb'];
		$parking_places_nb 	= $result['parking_places_nb'];
		$flatware_nb 		= $result['flatware_nb'];
		$reserved 			= 0;
		$subsciprionId 			= '';

		// user already register ?
		$sql2 = "SELECT id FROM `register` WHERE day_id = $day_id and user_id=$user_id and location_id = '".$location_id."'";  
		$query2 = $conn->query($sql2);
		while ( $result2 = $query2->fetch_assoc() ) {
			$reserved 			= 1;
			$subsciprionId		= $result2['id'];
		}

		// get subscriptions per day
		$sql3 = "SELECT sum(parking) as sum FROM register WHERE day_id = $day_id and location_id=$location_id";
		$query3 = $conn->query($sql3);
		while ($result3 = $query3->fetch_assoc()) {
			$parking = $result3['sum'];
		}

		// get canteen booking per day
		$sql4 = "SELECT count(canteen_registration.id) as count FROM canteen_registration, canteen_timeslots WHERE day_id = $day_id and canteen_timeslots.id=canteen_registration.timeslot_id and location_id=$location_id";
		$query4 = $conn->query($sql4);
		while ($result4 = $query4->fetch_assoc()) {
			$canteen_nb = $result4['count'];
		}

		//get day's subsciprions number
		$sql5 = "SELECT count(register.id) as count FROM `register`, day WHERE register.day_id=day.id and DATE(day.date)=DATE('".$date."') and location_id=".$location_id;
		$query5 = $conn->query($sql5);
		
		while ($result5 = $query5->fetch_assoc()) {
			$subsciprions_nb = $result5['count'];
		}

	    $json[] = [
		 	"day" 						=> $date,
		 	"dayID"						=> (int) $day_id,
		 	"nbrPlaces"					=> (int) $places_nb,
		 	"nbrPlacesReserved"			=> (int) $subsciprions_nb,
		 	"nbrFreePlaces"				=> (int) $places_nb - (int) $subsciprions_nb,
		 	"reserved"					=> (bool) $reserved,
		 	"nbrPlacesParkingDispo"		=> (int) $parking_places_nb,
		 	"nbrParkingUsed"			=> (int) $parking,
		 	"nbrFreePlacesParking"		=> ((int) $parking_places_nb - (int) $parking) >= 0 ? (int) $parking_places_nb - (int) $parking : 0,
		 	"nbrPlacesCantineDispo"		=> (int) $flatware_nb,
		 	"nbrCantineUsed "			=> !empty($canteen_nb) ? (int) $canteen_nb : 0,
		 	"nbrFreePlacesCantine"		=> ((int) $flatware_nb - (int) $canteen_nb) >=0 ? (int) $flatware_nb - (int) $canteen_nb : 0,
		 	"subsciprionId"				=> !empty($subsciprionId) ? (int) $subsciprionId : null,
		 	"checked"					=>(bool) $reserved
		 ];
	}
	echo json_encode($json);
?>