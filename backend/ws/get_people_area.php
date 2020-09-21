<?php
	header("Access-Control-Allow-Origin: *");
	include('../inc/connect.php');
	include('../inc/utils.php');

    $token        = getValueFromArray($_GET, 'token', '');
    $area_id      = getValueFromArray($_GET, 'area_id', '');
 
	if ( $token == md5($YOUR_TOKEN_SALT.''.date('d/m/Y')) ) {
		//get area
		$sql = "SELECT * FROM `presence` WHERE area_id=".$area_id." and date(date_in) = date(NOW()) and date_out is null";
		$query = $conn->query($sql);
		$result = mysqli_num_rows($query);
		echo $result;

	} else {
	   	header($_SERVER['SERVER_PROTOCOL'] . ' 401 unauthorized access denied due to invalid credentials', true, 401);die;
	}
?>