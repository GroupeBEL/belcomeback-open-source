<?php
	include('../inc/connect.php');
	include('../inc/utils.php');
	
	$json = array("code" => 500, "data" => "Une erreur est survenue lors de sauvagarde");


	$location_id 			= getValueFromArray($_POST, 'id', 0);
	$places_nb 				= getValueFromArray($_POST, 'places_nb', 0);
	$parking	 			= getValueFromArray($_POST, 'parking', 0);
	$allowed_booking_nb 	= getValueFromArray($_POST, 'allowed_booking_nb', 0);
	$nurse_contact	 		= getValueFromArray($_POST, 'nurse_contact', '');
	$gs_contact	 			= getValueFromArray($_POST, 'gs_contact','');
	

	$sql = "SELECT * from quota qo, location lo where qo.location_id=lo.id and lo.id ='$location_id'";

	$query = $conn->query($sql); 

	if ($query->num_rows > 0) {
		$sql1 = "UPDATE quota SET places_nb='$places_nb', parking_nb='$parking', allowed_booking_nb='$allowed_booking_nb',nurse_contact='$nurse_contact',gs_contact='$gs_contact' WHERE location_id='$location_id'";

		$sql2 = "UPDATE day SET places_nb='$places_nb',parking_places_nb='$parking'  WHERE DATE(date) > DATE(NOW()) AND location_id='$location_id'";
 
	    if (mysqli_query($conn, $sql1) && mysqli_query($conn, $sql2)) {
	    	$json = array("code" => 200, "data" => "Les données ont bien été sauvegardées");
		} else { 
			echo "Error: " . $sql1 . ' And/Or '. $sql2 . ":-" . mysqli_error($conn);
		}
	} else {
		$json = array("code" => 404, "data" => "Une erreur est survenue lors de sauvagarde. Merci de vérifier votre saisie");
	}

	echo json_encode($json);die;
?>