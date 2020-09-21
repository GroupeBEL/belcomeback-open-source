<?php
	include('./inc/connect.php');
    include('./inc/check_session.php');
	include('./inc/utils.php');

  	$token        	= getValueFromArray($_GET, 'token', '');
	$location_id	= '1';

	if ( $token == md5($YOUR_TOKEN_SALT.'location'.$location_id) ) {
?> 

		
		<div class="card-group">
		<?php
			$sql = "SELECT * FROM `area` WHERE location_id=".$location_id."";
			$query = $conn->query($sql);
			while($result = $query->fetch_assoc()) {
		 		$sql1 = "SELECT sum(status) as total FROM `button` WHERE area=".$result['id']." and date(Date) = date(NOW())";  
		 		//get nb of people actually in this area
				$query1 = $conn->query($sql1);
				while($result1 = $query1->fetch_assoc()) {
					if($result1['total']>0) {
						$total = $result1['total'];
					} else {
						$total = 0;	
					}
					$max = $result['max_people'];
					$percent = $total/$max*100;
					if($percent>100) {
						$percent = 100;
					}
					if ($total>$max) {
					 	$style = 'background:#e33f36';
					} else { 
						if($total>($max*0.8)) {
							$style = 'background:#fcde4a';
						} else { 
							$style = 'background:#91d753';
						}
					}

		?>
		 	<div class="card col-lg-6 col-md-6 no-padding bg-flat-color-" style="<?php echo $style;?>">
					<div class="card-body">
						<div class="h1 text-muted text-right mb-4">
							<i class="fa fa-users text-light"></i>
						</div>
						<small class="text-uppercase font-weight-bold text-light"style='font-size: 21pt;'><?php echo $result['name'];?></small>
						<div class="h4 mb-0 text-light" style='margin-top: 30px;'>
							<span class="count" style='font-size: 70pt;'><?php echo $total;?></span><span class='text-muted' style='color:#e8edf1c7!important;font-size: 50pt;'> / <?php echo $max;?></span>
						</div>
						<div class="progress progress-xs mt-3 mb-0 bg-light" style="width: <?php echo $percent; ?>%; height: 5px;"></div>
						<div style="background-color: rgba(219, 219, 219, 0.69);width: 100%;float: left;height: 3px;"></div>
					</div>
			</div>
		<?php

				}
			}
		?>

			<div class="card">
                <div class="card-body">
                    <div class="mx-auto d-block">
                        <img class=" mx-auto d-block" src="img/logo.png" alt="Card image cap">
                        <div class="location text-sm-center"><i class="fa fa-map-marker"></i> Suresnes HQ</div>
                    </div>

                </div>
                <div class="card-footer">
                    <strong class="card-title mb-3">https://www.groupe-bel.com.</strong>
                </div>
            </div>				
		</div>
<?php
	} else {
		echo "error token";
	}
?>
