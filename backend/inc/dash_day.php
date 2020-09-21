<?php
    //Get quotas
    $sql = "SELECT * FROM quota WHERE location_id = '".$loc_admin."'";
    $query = $conn->query($sql);
    while ($result = $query->fetch_assoc()) {
        $booking_opening = $result['booking_opening'];
        $booking_closure = ($result['booking_closure']+$result['booking_opening']);
    }

    //get days
    $sql1 = "SELECT * FROM day WHERE id=$id and  location_id=".$loc_admin;
    $query1 = $conn->query($sql1);

    while ($result1 = $query1->fetch_assoc()) {
        $day_id             = $result1['id'];
        $date               = $result1['date'];
        $places_nb          = $result1['places_nb'];
        $parking_places_nb  = $result1['parking_places_nb'];
        $flatware_nb        = $result1['flatware_nb'];

    	// get number of subscribed persons for this day
    	$sql2 = "SELECT count(id) as count, sum(parking) as sum FROM register WHERE day_id = $day_id and location_id=$loc_admin";
    	$query2 = $conn->query($sql2);
    	while ($result2 = $query2->fetch_assoc()) {
    	   $subscribed = $result2['count'];
    	   $parking    = $result2['sum'];
    	}

	    // get nb of canteen subscriptions
	    $sql3 = "SELECT count(canteen_registration.id) as count FROM canteen_registration, canteen_timeslots WHERE day_id = $day_id and canteen_timeslots.id=canteen_registration.timeslot_id and location_id=$loc_admin";
	    $query3 = $conn->query($sql3);
	    while ($result3 = $query3->fetch_assoc()) {
	        $canteen_nb = $result3['count'];
	    }
    }
    $subscribed_percent = $subscribed/$places_nb*100;
    if($subscribed_percent>100){
    	$subscribed_percent = 100;
    }
    if ($subscribed>$places_nb){
        $style = 4;
    } else { 
        if($subscribed>($places_nb*0.8)) {
            $style = 3;
        } else { 
            $style = 5;
        }
    }
?>

    <!--total nb-->
	<div class="card col-lg-4 col-md-4 no-padding bg-flat-color-<?php echo $style;?>">
        <div class="card-body">
            <div class="h1 text-muted text-right mb-4">
                <i class="fa fa-users text-light"></i>
            </div>

            <div class="h4 mb-0 text-light">
                <span class="count"><?php echo $subscribed;?><small> / <?php echo $places_nb;?></small></span>
            </div>
            <small class="text-uppercase font-weight-bold text-light"><?php echo round($subscribed/$places_nb*100); ?>%</small>
            <div class="progress progress-xs mt-3 mb-0 bg-light" style="width: <?php echo $subscribed_percent; ?>%; height: 5px;"></div>
        </div>
    </div>

<?php
    $subscribed_percent=$canteen_nb/$flatware_nb*100;
    if($subscribed_percent>100){
    	$subscribed_percent = 100;
    }
    if ($subscribed_percent>=100){
        $style = 4;
    } else { 
        if($subscribed_percent>80){
            $style = 3;
        } else { 
            $style = 5;
        }
    }
?>

    <!-- canteen nb-->
	<div class="card col-lg-4 col-md-4 no-padding bg-flat-color-<?php echo $style;?>">
        <div class="card-body">
            <div class="h1 text-muted text-right mb-4">
                <i class="fa fa-cutlery text-light"></i>
            </div>

            <div class="h4 mb-0 text-light">
                <span class="count"><?php echo $canteen_nb;?><small> / <?php echo $flatware_nb;?></small></span>
            </div>
            <small class="text-uppercase font-weight-bold text-light"><?php echo round($canteen_nb/$flatware_nb*100); ?>%</small>
            <div class="progress progress-xs mt-3 mb-0 bg-light" style="width: <?php echo $subscribed_percent; ?>%; height: 5px;"></div>
        </div>
    </div>

<?php
    $subscribed_percent=$parking/$parking_places_nb*100;
    if($subscribed_percent>100){
    	$subscribed_percent = 100;
    }
    if ($subscribed_percent>=100){
        $style = 4;
    } else { 
        if($subscribed_percent>80){
            $style = 3;
        } else { 
            $style = 5;
        }
    }
?>

    <!-- parking nb-->
	<div class="card col-lg-4 col-md-4 no-padding bg-flat-color-<?php echo $style;?>">
        <div class="card-body">
            <div class="h1 text-muted text-right mb-4">
                <i class="fa fa-road text-light"></i>
            </div>

            <div class="h4 mb-0 text-light">
                <span class="count"><?php echo $parking;?><small> / <?php echo $parking_places_nb;?></small></span>
            </div>
            <small class="text-uppercase font-weight-bold text-light"><?php echo round($parking/$parking_places_nb*100); ?>%</small>
            <div class="progress progress-xs mt-3 mb-0 bg-light" style="width: <?php echo $subscribed_percent; ?>%; height: 5px;"></div>
        </div>
    </div>