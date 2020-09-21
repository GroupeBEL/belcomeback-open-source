<?php
    //get cabteen reservations for this day
    $sql = "SELECT timeslot_id, timeslot,canteen_timeslots.places_nb, count(canteen_registration.id) as nbr FROM canteen_registration, day, canteen_timeslots WHERE day_id=".$id." and day.id=day_id and day.location_id=".$loc_admin." and timeslot_id=canteen_timeslots.id group by timeslot_id";
    $query = $conn->query($sql);


    while ($result = $query->fetch_assoc()) {
        $places_nb          = $result['places_nb'];
        $subscribed_percent = $result['nbr']/$places_nb*100;
        if($subscribed_percent>100){
            $subscribed_percent=100;
        }
        if ($result['nbr']>$places_nb){
            $style = 4;
        } else { 
            if($result['nbr']>($places_nb*0.8)) {
                $style = 3;
            } else { 
                $style = 5;
            }
        }
?>
        <!-- total nbr-->
    	<div class="card col-lg-4 col-md-4 no-padding bg-flat-color-<?php echo $style;?>">
            <div class="card-body">
                <div class="h1  text-right mb-4" style='color:white;'>
                    <?php echo  substr($result['timeslot'], 0, 5);?>
                    <i class="fa fa-users text-light"></i>
                </div>

                <div class="h4 mb-0 text-light">
                    <span class="count"><?php echo $result['nbr'];?><small> / <?php echo $places_nb;?></small></span>
                </div>
                <small class="text-uppercase font-weight-bold text-light"><?php echo round($result['nbr']/$places_nb*100); ?>%</small>
                <div class="progress progress-xs mt-3 mb-0 bg-light" style="width: <?php echo $subscribed_percent; ?>%; height: 5px;"></div>
            </div>
        </div>
<?php
    }
?>
