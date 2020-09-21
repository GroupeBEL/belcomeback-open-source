<?php
    include('./head.php');
    include('./inc/utils.php');

    $area_id        = getValueFromArray($_GET, 'area_id', '');
?> 

    <div id="right-panel" class="">

	<?php
	include('./header1.php');

    $user = hash('sha256', $mail.''.$YOUR_HASH_SALT);

    $sql = "SELECT * FROM presence WHERE DATE(date_in) = DATE(NOW()) AND statut = '1' AND date_out IS NULL AND area_id = '".$area_id."' AND user = '".$user."'";
    $query = $conn->query($sql);
    $result = mysqli_num_rows($query);
   
    if($result==0) {
   	    $message="Ah! On ne savait pas que vous étiez là :)";
    } elseif ($result==1) {
    	$sql1 = "UPDATE presence SET date_out=CURRENT_TIMESTAMP(), statut ='0' WHERE area_id = '".$area_id."' AND user = '".$user."'"; 
    	$conn->query($sql1);
		$message="Merci! c'est votre sortie est enregistée.";
    }
    elseif ($result>1) {
    	$sql2 = "UPDATE presence SET date_out=CURRENT_TIMESTAMP(), statut ='0' WHERE area_id = '".$area_id."' AND user = '".$user."'"; 
    	$conn->query($sql2);
    	$message="Il semble que vous ayez scanné plusieurs entrées sans sortie. <br><br>Attention à bien scanner le code de sortie pour que les chiffres de présence soient au plus proche du réel.";
    }

    ?> 
        <div class="content mt-3">
            <div class="row" id="intro"> 
    			<div class="row justify-content-md-center col-sm-12 col-md-12 col-lg-12">
    				<div class="col-sm-12 col-md-8 col-lg-8" style="text-align:center;    margin: 0px 10px;">
    					<p>
                            <?php echo $message;?>
                        </p>
                    </div>
                </div>
            </div>
        </div>