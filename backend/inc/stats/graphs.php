<?php
    include('./inc/connect.php');

	$sql = "SELECT DATE(day.date) as date,count(user_id) as count  FROM register, day where register.day_id=day.id and register.location_id=".$loc_admin." GROUP BY DATE(day.date)";

	$query = $conn->query($sql);

    $i=1;
    $label="[";
    $data="[";
	while($result = $query->fetch_assoc()) {
		$label    =   $label."'".$result['date']."',";
		$data     =   $data."'".$result['count']."',";
	}	
	$data=substr($data, 0, -1)."]";
	$label=substr($label, 0, -1)."]";
?>	

    <div class="col-sm-12 col-lg-6" style='margin-top: 15px;margin-left: 0px;padding-left: 0px;'>
        <div class="card text-white bg-flat-color-4">
            <div class="card-body pb-0">
                <h4 class="mb-0">
                    <span class="count">
						<?php
							$sql1 = "SELECT count(user_id) as count  FROM register where location_id=".$loc_admin ;
							$query1 = $conn->query($sql1);
							while($result1 = $query1->fetch_assoc()) {
								echo round($result1['count'],2);
							}
						
						?>	
					</span>
                </h4>
                <p class="text-light">Inscriptions depuis le début pour <?php echo $location;?></p>

                <div class="chart-wrapper px-3" style="height:max-content;" height="150">
                    <canvas id="widgetChartAvg"></canvas>
                </div>
            </div>
        </div>
    </div>

