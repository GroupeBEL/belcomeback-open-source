<?php
	include('../inc/connect.php');
	include('../inc/utils.php');
	
	$location_id 	= getValueFromArray($_POST, 'loc_id', 0);
	$date 			= getValueFromArray($_POST, 'date', '');
	$user_id 		= getValueFromArray($_POST, 'userId', '0');

	$json = array("code" => 500, "data" => "Une erreur est survenue lors de sauvgarde");


	
	//get location and day
	$sql = "SELECT day.* from day, location lo where lo.id=day.location_id and lo.id=".$location_id." and date(day.date)='".$date."'";
	$query = $conn->query($sql); 

	while($result = $query->fetch_assoc()) {
		//add registration
		$sqlQuota = "INSERT INTO `register`(`location_id`, `day_id`, `user_id`, status ) VALUES (".$location_id.",".$result['id'].",".$user_id.", 1 )";
    }

    if (mysqli_query($conn, $sqlQuota)) {
    	$json = array("code" => 200, "data" => "Les données ont bien été sauvegardées");
	} else { 
		$json = array("code" => 500, "data" => "Une erreur est survenue lors de sauvgarde". $sqlQuota . ":-" . mysqli_error($conn));
	}

	echo json_encode($json);die;

?>