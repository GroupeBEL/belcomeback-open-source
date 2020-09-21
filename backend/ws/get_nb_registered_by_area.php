<?php
 	include('../inc/connect.php');
 	include('../inc/utils.php');

	$area_id 	    	= getValueFromArray($_GET, 'area_id', '');


    $sql = "SELECT * FROM presence WHERE area_id='".$area_id."' and date_out is null and DATE(date_in)=DATE(NOW())";

	//get number of subscribed persons
    $query = $conn->query($sql);
    $result = mysqli_num_rows($query);

    echo $result;
 ?>