<?php
	
	//get values from arrays like $_POST...
	function getValueFromArray($data, $key, $defaultValue) {
		if (isset($data) && array_key_exists($key, $data)) {
			return $data[$key];
		}
		return $defaultValue;
	}

	//generate random salt
	function generateRandomString($length = 10) {
	    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	    $charactersLength = strlen($characters);
	    $randomString = '';
	    for ($i = 0; $i < $length; $i++) {
	        $randomString .= $characters[rand(0, $charactersLength - 1)];
	    }
	    return $randomString;
	}

	//delete user token
	function deleteUsedtoken($conn, $user_id, $token) {
	    $query = "DELETE FROM user_token where user_id = '$user_id' AND token='$token'"; 
	    $conn->query($query);
	}

	//check token
	function token_is_valid($conn, $user_id, $token) {
		$query = "SELECT * FROM user_token where user_id = '$user_id' AND token='$token' AND create_date > DATE_SUB(now(), INTERVAL 24 HOUR)"; 
	    $result = $conn->query($query);
	    if ($result->num_rows == 1) {
	        return true;
	    }
	    return false;
	}

	function register_exists($conn, $user_id, $reg_id) {
		$query = "SELECT * FROM register where user_id = '$user_id' AND id='$reg_id'"; 
		$result = $conn->query($query);
		if ($result->num_rows > 0) {
			return true;
		}
		return false;
	}

	function getUserData($conn, $user_id, $reg_id) {
	    $data = [];
	    $query = "SELECT u.firstname, UNIX_TIMESTAMP(DATE_FORMAT(d.date, '%Y-%m-%d 00:00:00')) as startEvent, UNIX_TIMESTAMP(DATE_FORMAT(DATE_ADD(d.date, INTERVAL 1 DAY), '%Y-%m-%d 00:00:00')) as endEvent, DATE_FORMAT(r.arrival_date, '%d/%m/%Y') as regDate, r.day_id FROM user u, register r, day d WHERE u.id=r.user_id AND r.day_id=d.id AND u.id = '$user_id' AND r.id='$reg_id'"; 
	    
	    $result = $conn->query($query);
	    if ($result->num_rows > 0) {
	        $data = $result->fetch_assoc();
	        //get Canteen data
	        $query = "SELECT TIME_FORMAT(c.timeslot, '%h:%i') as leCreneau FROM canteen_timeslots c, canteen_registration r WHERE c.id=r.timeslot_id AND r.user_id='$user_id' AND r.day_id='".$data['day_id']."'";
	        $result = $conn->query($query); 
	        if ($result->num_rows > 0) {
	            $data = array_merge($data, $result->fetch_assoc());
	        }
	        return $data;
	    }
	    return $data;
	}

	function generateEvent($startEvent, $endEvent) {
	    $starttime  = $startEvent;  //note that you need to supply a unix timestamp here!
	    $endtime    = $endEvent;

	    //of course assuming the variables used in the attachments are accordingly set
	    $ical = "BEGIN:VCALENDAR\r\n";
	    $ical .= "VERSION:2.0\r\n";
	    $ical .= "PRODID:-//preprod-belcome-back//groupe-bel.com//FR\r\n";
	    $ical .= "BEGIN:VEVENT\r\n";
	    $ical .= "UID:".md5(uniqid())."\r\n";
	    $ical .= "DTSTAMP:".date('Ymd')."T".date('His')."\r\n";
	    $ical .= "DTSTART:".date('Ymd',$starttime)."T".date('His',$starttime)."\r\n";
	    $ical .= "DTEND:".date('Ymd',$endtime)."T".date('His',$endtime)."\r\n";
	    $ical .= "LOCATION:Suresnes HQ\r\n";
	    $ical .= "DESCRIPTION:Merci de respecter les consignes et heures de passage indiquées.\r\n";
	    $ical .= "SUMMARY:Office Presence\r\n";
	    $ical .= "PRIORITY:5\r\n";
	    $ical .= "END:VEVENT\r\n";
	    $ical .= "END:VCALENDAR\r\n";

	    return $ical;
	}