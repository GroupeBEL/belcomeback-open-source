<?php
	include('../inc/connect.php');
	include('../inc/utils.php');
	
	$json = array("code" => 500, "data" => "Une erreur est survenue lors de sauvagarde");


	$location_id 	= getValueFromArray($_POST, 'loc_id', 0);
	$places_nb 		= getValueFromArray($_POST, 'nbPlaces', 0);
	$n_timeslot 	= getValueFromArray($_POST, 'n_timeslot', '12:00:00');
	

	//get canteen timeslots
	$sql = "SELECT * from canteen_timeslots cr, location lo where cr.location_id=lo.id and lo.id ='$location_id' AND timeslot='$n_timeslot' AND cr.status=1";

	$query = $conn->query($sql); 

	if ($query->num_rows == 0) {
		//add new time slot for location
		$sql1 = "INSERT INTO canteen_timeslots (location_id,places_nb,timeslot)  VALUES ('$location_id','$places_nb','$n_timeslot')";

 
	    if (mysqli_query($conn, $sql1)) {
	    	$json = array("code" => 200, "data" => "Les données ont bien été sauvegardées");
		} else { 
			echo "Error: " . $sql1 . ":-" . mysqli_error($conn);
		}
	} else {
		$json = array("code" => 404, "data" => "Une erreur est survenue lors de sauvagarde. Merci de vérifier votre saisie");
	}

	echo json_encode($json);die;
?>
