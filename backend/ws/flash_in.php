<?php
    header("Access-Control-Allow-Origin: *");
    include('../inc/connect.php');
    include('../inc/utils.php');

    $area_id      = getValueFromArray($_GET, 'id', '');

    $sql = "SELECT * FROM area WHERE id= '".$area_id."'";
    $query = $conn->query($sql);
    while($result = $query->fetch_assoc()) {
        $area_name = $result['name'];
    }


    $sql1 = "INSERT INTO button (area, status) VALUES ('$area_id',1)";
	$conn->query($sql1);
    
    $message="Your check in has correctly been added for $area_name, Thanks! <br><br>Votre entrée a bien été enregistrée dans $area_name, merci!";
    
    echo json_encode(array('code' => 200 , 'data' => 'ok'));
    die;
?>
