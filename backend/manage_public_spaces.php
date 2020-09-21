<?php
	include('./head_admin.php');

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

    <div id="right-panel" class="right-panel">

	<?php 

	include('./header.php'); 

	$sql1 = "SELECT lo.name,lo.id as loid, ar.* FROM location lo, area ar where ar.location_id=lo.id and lo.id=".$loc_admin." ORDER BY lo.name ASC";
	$query1 = $conn->query($sql1);


	?>

		<div class="breadcrumbs">
		    <div class="col-sm-4">
		        <div class="page-header float-left">
		            <div class="page-title">
		                <h1>Public Spaces management</h1>
						<?php
						$linkdash="./dashboard_button.php?token=".md5($YOUR_TOKEN_SALT.'location'.$loc_admin);
						?>
						<p>link for the main dashboard : <a href="<?php echo $linkdash;?>" target="_blank">here</a>
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
		                        <strong class="card-title">list of public space</strong>
		                    </div>
		                    <div class="card-body">
		                        <table id="bootstrap-data-table-export" class="table table-striped table-bordered">
		                            <thead>
		                                <tr>
		                                    <th>Location</th>
											<th>Public spaces name</th>
											<th>max people</th>
											<th>Action</th>
		                                </tr>
		                            </thead>
		                            <tbody>

		<?php while($result1 = $query1->fetch_assoc()) { ?> 		
		                                <tr>
		                                	<form action="ws/update_area.php" id="update" method="post">
												<td>								
													<input type="hidden" name="location_id" value="<?php echo $result1['loid']; ?>">
													<?php echo $result1['name']; ?>
												</td>
												<td>
													<input type="hidden" name="area_id" value="<?php echo $result1['id']; ?>">
													<?php echo $result1['name']; ?>
												</td>
												<td><input type="number" min="0" name="places_nb" value="<?php echo $result1['max_people']; ?>"></td>
		                                        <td>
												<?php
												$in="'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://".$_SERVER['HTTP_HOST']."/ws/flash_in.php?id=".$result1['id']."'";
												$out="'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://".$_SERVER['HTTP_HOST']."/ws/flash_out.php?id=".$result1['id']."'";
												
												?>
												<ul>
												<li><a href= <?php echo $in;?> target="_blank"> QR code d'entrée</a></li>
												<li><a href= <?php echo $out;?> QR code de sortie</a></li>
												 <button type="submit" name="submit" value="Submit" class="btn btn-primary">Update</button></td>
	                                    	</form>
	                                    </tr>
		<?php 
		} 
		
		$queryLocation= "SELECT lo.name,lo.id as loid FROM location lo where lo.id=".$loc_admin."  ORDER BY lo.name ASC";
		$resultLocation = $conn->query($queryLocation);
		//If some locations do not have quota
		?>
                  						<tr>
		                                	<form action="ws/add_area.php" id="add" method="post">
												<td>
													<select name="loc_id">
													<?php while($listLocation = $resultLocation->fetch_assoc()) { ?>
   														<option value="<?php echo $listLocation['loid']; ?>"><?php echo $listLocation['name']; ?></option>
													<?php } ?>
													</select>
												</td>
												<td><input type="text"  name="name" value=""></td>
												<td><input type="number" min="0" name="places_nb" value=""></td>
		                                        <td> <button type="submit" name="submit" value="Submit" class="btn btn-primary">Add new Public Space</button></td>
	                                    	</form>
	                                    </tr>                      
        <?php  ?>                            
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