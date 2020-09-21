<?php
 	include('../inc/connect.php');
 	include('../inc/utils.php');

	$location_id 	    	= getValueFromArray($_GET, 'location_id', '');
	$day_id 	    		= getValueFromArray($_GET, 'day_id', '');
	$total 					= 0;


	$sql = "SELECT SUM(parking) AS total FROM register WHERE day_id = '".$day_id."' AND location_id = '".$location_id."'";
	
	$query = $conn->query($sql);
	while ($result = $query->fetch_assoc()) {
		$total = (int) $result['total'];
	}

	echo $total;
?>