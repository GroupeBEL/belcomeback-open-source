<?php
	include('./head_admin.php');

	$ok 		 = '0';
	$admin 		 = '';
    $sqlGetadmin = "SELECT * FROM `user` WHERE admin=1 and email='".$mail."'";
    $resultadmin = $conn->query($sqlGetadmin);
    
    while($admin = $resultadmin->fetch_assoc()) {
        $ok='1';
    }

	if($ok==0) {echo "vous n'etes pas autorisé à vous connecté a cette page"; die; }
	
	include('./menu.php');
?>
    <!-- Right Panel -->

    <div id="right-panel" class="right-panel">

	<?php 

	include('./header.php'); 

	$queryQuota = "SELECT lo.id, lo.name, qo.places_nb, qo.start_time, qo.end_time, qo.nurse_contact, qo.allowed_booking_nb, qo.gs_contact, qo.parking_nb FROM location lo, quota qo where qo.location_id=lo.id and lo.id=".$loc_admin." ORDER BY lo.id ASC";
	$resultQuota = $conn->query($queryQuota);

	$queryLocationWithoutQuota = "SELECT lo.id, lo.name FROM location lo WHERE NOT EXISTS (SELECT 1 FROM quota qo WHERE qo.location_id=lo.id)";
	$resultLocationWithoutQuota = $conn->query($queryLocationWithoutQuota);

	?>

		<div class="breadcrumbs">
		    <div class="col-sm-4">
		        <div class="page-header float-left">
		            <div class="page-title">
		                <h1>Quota management</h1>
		            </div>
		        </div>
		    </div>
		</div>
		<div class="content mt-3">
		    <div class="animated fadeIn">
		        <div class="row">

		            <div class="col-md-12">
		                <div class="card">
		                    <div class="card-header">
		                        <strong class="card-title">Teams</strong>
		                    </div>
		                    <div class="card-body">
		                        <table id="bootstrap-data-table-export" class="table table-striped table-bordered">
		                            <thead>
		                                <tr>
		                                    <th>Location</th>
											<th>People Quota</th>
											<th>Parking</th>
											<th>Register by Week</th>
											<th>Contact Infirmary</th>
											<th>Contact SG</th>
											<th>Action</th>
		                                </tr>
		                            </thead>
		                            <tbody>

		<?php while($quota = $resultQuota->fetch_assoc()) { ?> 		
		                                <tr>
		                                	<form action="ws/update_quota.php" id="update" method="post">
												<td>
													<input type="hidden" name="id" value="<?php echo $quota['id']; ?>">
													<?php echo $quota['name']; ?>
												</td>
												<td><input type="number" min="0" name="places_nb" value="<?php echo $quota['places_nb']; ?>"></td>
												<td><input type="number" name="parking" value="<?php echo $quota['parking_nb']; ?>"></td>
												<td><input type="number" name="allowed_booking_nb" value="<?php echo $quota['allowed_booking_nb']; ?>"></td>
												<td><input type="text" name="nurse_contact" value="<?php echo $quota['nurse_contact']; ?>"></td>
												<td><input type="text" name="gs_contact" value="<?php echo $quota['gs_contact']; ?>"></td>
		                                        <td> <button type="submit" name="submit" value="Submit" class="btn btn-primary">Update</button></td>
	                                    	</form>
	                                    </tr>
		<?php 
		} 
		//If some locations do not have quota
		if ($resultLocationWithoutQuota->num_rows > 0) {
		?>
                  						<tr>
		                                	<form action="ws/add_quota.php" id="add" method="post">
												<td>
													<select name="loc_id">
													<?php while($quotaLo = $resultLocationWithoutQuota->fetch_assoc()) { ?>
   														<option value="<?php echo $quotaLo['id']; ?>"><?php echo $quotaLo['name']; ?></option>
													<?php } ?>
													</select>
												</td>
												<td><input type="number" min="0" name="quota" value=""></td>
												<td><input type="number" name="parking" value=""></td>
												<td><input type="number" name="allowed_booking_nb" value=""></td>
												<td><input type="text" name="nurse_contact" value=""></td>
												<td><input type="text" name="gs_contact" value=""></td>
		                                        <td> <button type="submit" name="submit" value="Submit" class="btn btn-primary">Add new quota</button></td>
	                                    	</form>
	                                    </tr>                      
        <?php } ?>                            
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>


                </div>
            </div><!-- .animated -->
        </div><!-- .content -->


    </div><!-- /#right-panel -->

    <script type="text/javascript">
    	// this is the id of the form
		$("#update, #add").submit(function(e) {

		    e.preventDefault(); // avoid to execute the actual submit of the form.

		    var form = $(this);
		    var url = form.attr('action');

		    $.ajax({
		           type: "POST",
		           url: url,
		           data: form.serialize(), // serializes the form's elements.
		           success: function(data)
		           {
		           	   var json = jQuery.parseJSON(data); 
		               alert(json.data); // show response from the php script.
		           }
		         });
		});

    </script>
