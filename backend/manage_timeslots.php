<?php
	include('./head.php');

	$ok='0';
	$admin='';
    $sql = "SELECT * FROM `user` WHERE admin=1 and email='".$mail."'";
    $query = $conn->query($sql);
    
    while($admin = $query->fetch_assoc()) {
        $ok='1';
    }

	if($ok==0) {echo "You are not allowed to access to this page"; die; }
	
	include('./menu.php');
?>
    <!-- Right Panel -->

    <div id="right-panel" class="right-panel">

	<?php 

	include('./header.php'); 

	$queryCreneau 		= "SELECT lo.id, lo.name, cr.id as crId, cr.places_nb, cr.timeslot FROM location lo, canteen_timeslots cr where cr.location_id=lo.id AND cr.status=1 and lo.id=".$loc_admin." ORDER BY lo.id ASC, cr.timeslot ASC";
	$resultCreneau 		= $conn->query($queryCreneau);

	$queryLocations 	= "SELECT lo.id, lo.name FROM location lo WHERE lo.id=".$loc_admin."";
	$resultLocations 	= $conn->query($queryLocations);

	

	?>

		<div class="breadcrumbs">
		    <div class="col-sm-4">
		        <div class="page-header float-left">
		            <div class="page-title">
		                <h1>Canteen's Time SLots management</h1>
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
											<th>Nb of places</th>
											<th>Time Slot</th>
											<!--<th>Areas</th>-->
		                                </tr>
		                            </thead>
		                            <tbody>

		<?php while($timeslot = $resultCreneau->fetch_assoc()) { ?> 		
		                                <tr>
		                                	<form action="ws/update_timeslot.php" id="update" method="post">
												<td>
													<input type="hidden" name="crId" value="<?php echo $timeslot['crId']; ?>">
													<input type="hidden" name="id" value="<?php echo $timeslot['id']; ?>">
													<?php echo $timeslot['name']; ?>
												</td>
												<td><input type="number" min="0" name="places_nb" value="<?php echo $timeslot['places_nb']; ?>"></td>
												<td><input type="time" name="timeslot" value="<?php echo $timeslot['timeslot']; ?>"></td>
												<!--<td><?php //echo getCreneauAreas($conn, $timeslot['crId']); ?></td>-->
		                                        <td> <button type="submit" name="submit" value="Submit" class="btn btn-primary">Update</button></td>
	                                    	</form>
	                                    </tr>
		<?php 
		} 
		//If some locations do not have quota
		if ($resultLocations->num_rows > 0) {
		?>
                  						<tr>
		                                	<form action="ws/add_timeslot.php" id="add" method="post">
												<td>
													<select name="loc_id">
													<?php while($lo = $resultLocations->fetch_assoc()) { ?>
   														<option value="<?php echo $lo['id']; ?>"><?php echo $lo['name']; ?></option>
													<?php } ?>
													</select>
												</td>
												<td><input type="number" min="0" name="nbPlaces" value=""></td>
												<td><input type="time" name="n_timeslot" value=""></td>
		                                        <td> <button type="submit" name="submit" value="Submit" class="btn btn-primary">Add new Time slot</button></td>
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
		               window.top.location.reload();
		           }
		         });
		});

    </script>
