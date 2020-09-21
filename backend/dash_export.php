<?php 
    include('./inc/connect.php');
    include('./inc/check_session.php');

	$queryLocations = "SELECT * FROM location lo WHERE id=".$loc_admin." ORDER BY lo.id ASC";
	$resultLocations = $conn->query($queryLocations);

	$queryDays = "SELECT d.id, DATE_FORMAT(d.date, '%d/%m/%Y') as la_date FROM day d WHERE location_id=".$loc_admin." ORDER BY d.date ASC";
	$resultDays = $conn->query($queryDays);
?>

	<div class="card">
        <div class="card-header">
            <strong>Export</strong> Data
        </div>
        <div class="card-body card-block">
            <form action="ws/export_data.php" method="get" class="">
                <div class="form-group">
                	<label for="loc_id" class=" form-control-label col-md-2">Location</label>
                	<select name="loc_id" class="col-md-2" required>
                		<option value="">Select Location</option>
						<?php while($loc = $resultLocations->fetch_assoc()) { ?>
								<option value="<?php echo $loc['id']; ?>"><?php echo $loc['name']; ?></option>
						<?php } ?>
					</select>

                	<label for="day_id" class="col-md-2 form-control-label">Day</label>
                	<select name="day_id" class="col-md-2" required>
                		<option value="">Select day</option>
						<?php while($d = $resultDays->fetch_assoc()) { ?>
								<option value="<?php echo $d['id']; ?>"><?php echo $d['la_date']; ?></option>
						<?php } ?>
					</select>

                    <button type="submit" id="submitForm" class="btn btn-primary btn-sm">
                        <i class="fa fa-dot-circle-o"></i> export data
                    </button>
                </div>
            </form>
        </div>
    </div>