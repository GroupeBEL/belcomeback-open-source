<?php
	include('../inc/connect.php');
	include('../inc/utils.php');
	
	$json = array("code" => 500, "data" => "Une erreur est survenue lors de sauvagarde");

	$location_id 	= getValueFromArray($_POST, 'location_id', 0);
	$area_id 		= getValueFromArray($_POST, 'area_id', 0);
	$places_nb 		= getValueFromArray($_POST, 'places_nb', '0');

	

	$sql = "SELECT * from area li, location lo where li.location_id=lo.id and lo.id ='$location_id'";

	$query = $conn->query($sql); 

	if ($query->num_rows > 0) {
		$sql1 = "UPDATE area SET max_people='$places_nb' WHERE id='$area_id'";
 
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