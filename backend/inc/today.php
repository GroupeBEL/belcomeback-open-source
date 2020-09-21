<style>
.box{
	text-align: left;
    margin: 0px 0px;
    background-image: url(./img/assets/approved@2x.jpg);
    background-position: 90%;
    background-size: 40px;
    background-repeat: no-repeat;
    border: black;
    border-style: outset;
    border-width: thin;
	margin: 10px 5px;
	padding: 10px;
}
</style>
<?php
	// add $nointro=1; if there is a register record for today
	$nointro=0;
	$cantreg=0;
	$sql = "SELECT * FROM `register`, day WHERE user_id=".$user_id." and register.day_id=day.id and DATE(day.date)=DATE(NOW())";
	$query = $conn->query($sql);
	while($result = $query->fetch_assoc()) {
		$parking 	=$result['parking'];
		$nointro	=1;
?>
		<div class="row" id="today">
 			<div class="row justify-content-md-center col-sm-12 col-md-12 col-lg-12">
				<div class="col-sm-12 col-md-4 col-lg-4 box">
					<h5 style='color: #005640;'><i class="fa fa-calendar" style='margin-right: 20px;'></i>Aujourd'hui, <?php echo date('d F Y');?></h5>
					<p> 
					<?php if($parking == '0') { ?> 
                    	<b> Parking : pas de parking réservé  </b> <br> 
                    <?php } else { ?> 
                    	<p> <b> Parking : placement libre </b> <br>
                    <?php
                    }
					$sql1 = "SELECT * FROM `canteen_registration`, day, canteen_timeslots WHERE user_id=".$user_id." and canteen_timeslots.id=timeslot_id and canteen_timeslots.status=1 and  canteen_registration.day_id=day.id and DATE(day.date)=DATE(NOW())";
					$query1 = $conn->query($sql1);
					while($result1 = $query1->fetch_assoc()) {
						echo ' <b> Cantine : '.$result1['timeslot'].'</b></p>';
						$cantreg=1;
					}
					if ($cantreg==0) {
						echo '<b> Cantine : pas de cantine </b></p>';
					}
					?>
				</div>
			</div>
		</div>
<?php 
	}
?>
	<div class="row" id="nexts">
		<div class="row justify-content-md-center col-sm-12 col-md-12 col-lg-12">
<?php
	$nonew=0;
	$sql2 = "SELECT * FROM `register`, day WHERE user_id=".$user_id." and register.day_id=day.id and DATE(day.date)>DATE(NOW()) order by day.date ASC";
	$query2 = $conn->query($sql2);
	while($result2 = $query2->fetch_assoc()) {
		$parking = $result2['parking'];
		$nointro=1;
?>
			<div class="col-sm-12 col-md-4 col-lg-4 box" style="">
				<h5 style='color: #005640;'><i class="fa fa-calendar" style='margin-right: 20px;'></i><?php echo date('d F Y',strtotime($result2['date']));?></h5>		
				<div class="col-sm-8 col-md-8 col-lg-8 " >
					<p> 
						<?php if($parking == '0') { ?> 
                            <b> Parking : pas de parking réservé  </b> <br> 
                        <?php } else { ?> 
                        	<p> <b> Parking : placement libre </b> <br>  
                        <?php
                        }
						$sql3 = "SELECT * FROM `canteen_registration`, day, canteen_timeslots WHERE user_id=".$user_id." and canteen_timeslots.id=timeslot_id and canteen_timeslots.status=1 and  canteen_registration.day_id=day.id and DATE(day.date)='".date($result2['date'])."'";
						$query3 = $conn->query($sql3);
						while($result3 = $query3->fetch_assoc()) {
							echo ' <b> Cantine : '.$result3['timeslot'].'</b>	</p>';
							$cantreg=1;
						}
						if ($cantreg==0) {
							echo '<b> Cantine : pas de cantine </b></p>';
						}
						?>
				</div>
			</div>	
<?php 
	}
?>
		</div>
	</div>