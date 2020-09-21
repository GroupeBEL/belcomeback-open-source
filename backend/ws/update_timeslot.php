<?php
	include('../inc/connect.php');
	include('../inc/utils.php');
	
	$json = array("code" => 500, "data" => "Une erreur est survenue lors de sauvagarde");


	$crId 			= getValueFromArray($_POST, 'crId', 0);
	$location_id 	= getValueFromArray($_POST, 'id', 0);
	$places_nb 		= getValueFromArray($_POST, 'places_nb', 0);
	$timeslot 		= getValueFromArray($_POST, 'timeslot', '12:00:00');
	

	$sql = "SELECT * FROM canteen_timeslots cr, location lo where cr.location_id=lo.id and lo.id ='$location_id' AND cr.id='$crId'";

	$result = $conn->query($sql); 

	if ($result->num_rows == 1) {
		$sql1 = "UPDATE canteen_timeslots SET location_id='$location_id', places_nb='$places_nb', timeslot='$timeslot' WHERE id='$crId'";

		if ( mysqli_query($conn, $sql1) ) {
			$json = array("code" => 200, "data" => "Les données ont bien été enregistrées");
		} else { 
			echo "Error: " . $sql1 . ":-" . mysqli_error($conn);
		}
	} else {
		$json = array("code" => 404, "data" => "Une erreur est survenue lors de sauvagarde. Merci de vérifier votre saisie");
	}

	echo json_encode($json);die;
?>