<?php
	include('../inc/connect.php');
	include('../inc/utils.php');

    $day          				= getValueFromArray($_POST, 'day_id', '');
    $places_nb          		= getValueFromArray($_POST, 'places_nb', '');
    $flatware_nb         		= getValueFromArray($_POST, 'flatware_nb', '');
    $parking_places_nb          = getValueFromArray($_POST, 'parking_places_nb', '');


	$sql = "UPDATE day SET`places_nb`=$places_nb,`parking_places_nb`=$parking_places_nb,`flatware_nb`=$flatware_nb WHERE id='$day'";

    if (mysqli_query($conn, $sql)) {
		$url="Location: https://".$_SERVER['HTTP_HOST']."/day.php?id=$day";
    	header($url);
	} else { 
		echo "Error: " . $sql . ":-" . mysqli_error($conn);
	}

?>