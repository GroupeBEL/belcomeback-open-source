<?php
    include(__DIR__.'/settings.php');

	$servername = $YOUR_DB_HOSTNAME;
	$username 	= $YOUR_DB_USERNAME;
	$password 	= $YOUR_DB_PASSWORD;
	$dbname 	= $YOUR_DB_NAME;

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	$conn->set_charset("utf8");
	// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	} 
?> 
