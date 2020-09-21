<?php

if(!isset($_SESSION)) 
{ 
    session_start(); 
} 

if (isset($_SESSION["samlUserdata"])) {
	$attributes = $_SESSION['samlUserdata'];
 
	foreach ($attributes as $attributeName => $attributeValues) {
		if (strpos($attributeName, 'surname') !== false) {
			foreach ($attributeValues as $attributeValue) {
				$surname= htmlentities($attributeValue);
			} 
		} else { 
			if (strpos($attributeName, 'mail') !== false) {
						foreach ($attributeValues as $attributeValue) {
						$mail= htmlentities($attributeValue);
						}
					}
			else {
				if (strpos($attributeName, 'givenname') !== false) {
						foreach ($attributeValues as $attributeValue) {
						$givenname= htmlentities($attributeValue);
						}
					}
			}
		}
	}


	// test if exists already
	$exist=0;
	$sql1 = "SELECT * FROM `user` WHERE email='".$mail."'";
	$query1 = $conn->query($sql1);
	while($result1 = $query1->fetch_assoc()) {
		$lastname 		= 	$result1['lastname'];
		$firstname 		= 	$result1['firstname'];
		$user_id 		= 	$result1['id'];
		$exist 			=	1;
		$location_id	=	$result1['location'];
		$loc_admin		=	$result1['admin_location'];
	}
	
	if ( $exist != 1 ) {
     	$sql = "INSERT INTO user (firstname,lastname,email) VALUES ('$givenname','$surname','$mail')";
 
     	if (mysqli_query($conn, $sql)) {
			$firstname 		= 	$givenname;
			$lastname 		= 	$surname;
			$location_id	=	1;
			// ask the location of the user.
     	} else {
        	echo "Error: " . $sql . ":-" . mysqli_error($conn);
     	}
	}
	
	//get user location
	$sql2 = "SELECT location.name as location, country.name as country FROM `location`, country WHERE location.id=".$location_id." and country.id=country_id";
	$query2 = $conn->query($sql2);
	
	while($result2 = $query2->fetch_assoc()) {
		$country		=	$result2['country'];
		$location		=	$result2['location'];
	}
}
else {
	header("Location: https://". $_SERVER['HTTP_HOST'] ."/sso/index.php?sso&url=https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
die();
}
?>
