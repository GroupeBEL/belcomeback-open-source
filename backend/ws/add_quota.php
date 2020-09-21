<?php
	include('../inc/connect.php');
	include('../inc/utils.php');
	
	$json = array("code" => 500, "data" => "Une erreur est survenue lors de sauvagarde");


	$location_id 			= getValueFromArray($_POST, 'loc_id', 0);
	$places_nb 				= getValueFromArray($_POST, 'quota', 0);
	$parking	 			= getValueFromArray($_POST, 'parking', 0);
	$allowed_booking_nb 	= getValueFromArray($_POST, 'allowed_booking_nb', 0);
	$nurse_contact	 		= getValueFromArray($_POST, 'nurse_contact', '');
	$gs_contact	 			= getValueFromArray($_POST, 'gs_contact','');

	$sql = "SELECT * from quota qo, location lo where qo.location_id=lo.id and lo.id ='$location_id'";

	$query = $conn->query($sql); 

	if ($query->num_rows < 1) {
		//add quota for location
		$sqlQuota = "INSERT INTO quota (location_id,places_nb, `allowed_booking_nb`, `nurse_contact`, `gs_contact`, `parking_nb`)  VALUES ('$location_id','$places_nb','$allowed_booking_nb','$nurse_contact','$gs_contact','$parking')";

		//update day table for next days
		$sqlDay = "UPDATE day SET places_nb='$places_nb', parking='$parking' WHERE DATE(date) > DATE(NOW()) AND location_id='$location_id'";
 
	    if (mysqli_query($conn, $sqlQuota) && mysqli_query($conn, $sqlDay)) {
	    	$json = array("code" => 200, "data" => "Les données ont bien été sauvegardées");
		} else { 
			echo "Error: " . $sqlQuota . ' And/Or '. $sqlDay . ":-" . mysqli_error($conn);
		}
	} else {
		$json = array("code" => 404, "data" => "Une erreur est survenue lors de sauvagarde. Merci de vérifier votre saisie");
	}

	echo json_encode($json);die;
?>
