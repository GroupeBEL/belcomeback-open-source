<?php
	include('../inc/connect.php');
	include('../inc/utils.php');
	
	$json = array("code" => 500, "data" => "Une erreur est survenue lors de sauvgarde");


	$location_id 	= getValueFromArray($_POST, 'loc_id', 0);
	$name 			= getValueFromArray($_POST, 'name', '');
	$places_nb 		= getValueFromArray($_POST, 'places_nb', '0');
	
	//add quota for location
	$sql = "INSERT INTO `area`(`location_id`, `name`, `max_people` ) VALUES ('$location_id','$name','$places_nb')";

    if (mysqli_query($conn, $sql)) {
    	$json = array("code" => 200, "data" => "Les données ont bien été sauvegardées");
	} else { 
		echo "Error: " . $sql . ":-" . mysqli_error($conn);
	}

	echo json_encode($json);die;
?>