<?php
	header("Access-Control-Allow-Origin: *");
	include('../inc/connect.php');
    include('../inc/utils.php');

    $area_id          = getValueFromArray($_GET, 'id', '');
	$count            = 0;

 	$sql = "SELECT sum(status) as total FROM button WHERE area=".$area_id." AND date(Date)=date(now())" ;

	if ($query = $conn->query($sql)) {
		while($result = $query->fetch_assoc()) {
            $count = (int) $result['total'];
        }
        echo $count;
    } else {
        echo json_encode(['data' => 'Internal error server', 'code' => 500]);
    }
    die;
?>
