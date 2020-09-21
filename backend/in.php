<?php
  include('./head.php');
  include('./inc/utils.php');

  $area_id        = getValueFromArray($_GET, 'area_id', '');
?> 

  <div id="right-panel" class="">

<?php
  include('./header1.php');


  $user= hash('sha256', $mail.''.$YOUR_HASH_SALT);
  $exist = 0;

  //check user presence in a specific area
  $sql = "SELECT * FROM presence WHERE DATE(date_in) = DATE(NOW()) AND status = '1' AND date_out IS NULL AND area_id = '".$area_id."' AND user = '".$user."'";
  $query = $conn->query($sql);
  while($result = $query->fetch_assoc()) {
      $exist = 1; 
  }

  if($exist==1) {
    $message="Vous avez déjà scanné le qr code d'entrée. Veillez à bien scanner votre sortie :)";
  } else {
    //get all location
    $sql1 = "SELECT * FROM area WHERE id= '".$area_id."'";
    $query1 = $conn->query($sql1);
    while($result1 = $query1->fetch_assoc()) {
        $area_loc_id    = $result1['location_id'];
        $area_name      = $result1['name'];
    }

    if (isset($area_loc_id)) {

      if ($area_loc_id==$location_id) {
        $addPresence = "INSERT INTO presence(user, area_id) VALUES ('$user', '$area_id')";
        $conn->query($addPresence);
      
        $message="Votre entrée a bien été enregistrée, merci!";
      }
      else 
      {
         $message='Vous ne pouvez pas être dans un lieu qui n\'est pas localisé à ' .$location. '. Si tu es en déplacement, met à jour ton rattachement via ce lien.';
      }
    } else {
      $message='Tu ne peux pas être dans un lieu qui n\'est pas localisé à ' .$location. '. Si tu es en déplacement, met à jour ton rattachement via ce lien.';
    }   
  }

?>
  <div class="content mt-3">
    <div class="row" id="intro">
      <div class="row justify-content-md-center col-sm-12 col-md-12 col-lg-12">
        <div class="col-sm-12 col-md-8 col-lg-8" style="text-align:center;margin: 0px 10px;">
          <p>
            <?php echo $message;?>
          </p>
        </div>
      </div>
    </div>
  </div>