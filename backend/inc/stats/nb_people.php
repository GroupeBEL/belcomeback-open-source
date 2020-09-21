<div class="card-group">
<?php

	$sql = "SELECT * FROM `area` WHERE location_id=".$loc_admin."";
	$query = $conn->query($sql);
	while($result = $query->fetch_assoc()) {
        //get number of persons actually present in this place 
        $sql1 = "SELECT * FROM `presence` WHERE area_id=".$result['id']." and date(date_in) = date(NOW()) and date_out is null";
        $query1     = $conn->query($sql1);
        $total      = mysqli_num_rows($query1);
        $max        = $result['max_people'];
        $percent    = $total/$max*100;
        if($percent>100){
	       $percent    = 100;
        }
        if ($total>$max){
            $style  = 4;
        } else { 
            if($total>($max*0.8)){
                $style  = 3;
            } else { 
                $style  = 5;
            }
        }

?>

    <div class="card col-lg-2 col-md-6 no-padding bg-flat-color-<?php echo $style;?>">
        <div class="card-body">
            <div class="h1 text-muted text-right mb-4">
                <i class="fa fa-users text-light"></i>
            </div>

            <div class="h4 mb-0 text-light">
                <span class="count"><?php echo $total;?></span>
            </div>
            <small class="text-uppercase font-weight-bold text-light"><?php echo $result['name'];?>
            </small>
            <div class="progress progress-xs mt-3 mb-0 bg-light" style="width: <?php echo $percent; ?>%; height: 5px;">
            </div>
        </div>
    </div>

<?php
	}
?>
</div>