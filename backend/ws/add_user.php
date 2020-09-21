<?php
	include('../inc/connect.php');
	include('../inc/utils.php');
	
	$json = array("code" => 500, "data" => "Une erreur est survenue lors de sauvgarde");


	$location_id 	= getValueFromArray($_POST, 'loc_id', 0);
	$firstname 		= getValueFromArray($_POST, 'firstname', '');
	$email 			= getValueFromArray($_POST, 'email', '');
    $lastname 		= getValueFromArray($_POST, 'lastname', '');

  
  	//test if user exists already

	$sql = "SELECT * from user where email='".$email."'";
	$query = $conn->query($sql); 

	if ($query->num_rows > 0) {
		while($result = $query->fetch_assoc()) {
        	// user exists already ==> update
            $sql1 = "UPDATE `user` SET `firstname`='".$firstname."',`lastname`='".$lastname."',`location`=".$location_id." WHERE id=".$resultUSer2['id'];
		}
        if (mysqli_query($conn, $sql1)) {
            $json = array("code" => 200, "data" => "Data has been updated");
        } else { 
            echo "Error: " . $sql1 . ":-" . mysqli_error($conn);
        }
    } else {
        $sql2 = "INSERT INTO `user`(`firstname`, `lastname`, `email`, `location` ) VALUES ( '".$firstname."','".$lastname."','".$email."',".$location_id.")";
	    if (mysqli_query($conn, $sql2)) {
	    	$json = array("code" => 200, "data" => "Data has been saved");
		} else { 
			echo "Error: " . $sql2 . ":-" . mysqli_error($conn);
		}
    }


	echo json_encode($json);die;
?>
