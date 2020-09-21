<?php
    include('./inc/utils.php');
    if (isset($_GET['id'])){
        //id= userid
        $id            = getValueFromArray($_GET, 'id', 0);
    }  
    include('./head_admin.php');
    include('./inc/nbreplace.php');
    $ok='0';
	$admin='';
	$sql = "SELECT * FROM `user` WHERE admin=1 and email='".$mail."'";
	$query = $conn->query($sql);
	while($admin = $query->fetch_assoc()) {
		$ok='1';
	}
	if($ok==0)
	{echo "You are not allowed to see this page"; die; }
    include('./menu.php');
?> 
    <div id="right-panel" class="right-panel">

	<?php
	include('./header.php');
	if (isset($_GET['id'])){
    	$sql1 = "SELECT * FROM `location` WHERE id=".$loc_admin;
    	$query1 = $conn->query($sql1);
    	while($result1 = $query1->fetch_assoc()) {
    		$location = $result1['name'];
		}
	}

	?>
	    <div class="breadcrumbs">
            <div class="col-sm-4">
                <div class="page-header float-left">
                    <div class="page-title">
                        <h1>Users list for <?php echo $location;?>  </h1>
                    </div>
                </div>
            </div>
        </div>
		
		
        <div class="content mt-3">
            <div class="animated fadeIn">
                <div class="row">

                    <div class="col-md-12" id="users">
                        <div class="card">
                            <div class="card-header">
                                <strong class="card-title">Users</strong><span><a href="ws/export_users.php?loc_id=<?php echo $loc_admin; ?>"><i class="fa fa-cloud-download"></i></a></span>
                            </div>
                            <div class="card-body">
                                <table id="bootstrap-data-table-export" class="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Office</th>
										    <th>registrations</th>
											<th>action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
<?php



	$sql2 = "SELECT user.*, location.name as location FROM `user`, location WHERE user.location=location.id and location.id=".$loc_admin ;
	$query2 = $conn->query($sql2);


	while($result2 = $query2->fetch_assoc()) {

        // get number of registration for the user and the location
    	$sql3 = "SELECT count(id) as nbre FROM register WHERE user_id=".$result2['id']." and location_id=".$loc_admin ;
    	$query3 = $conn->query($sql3);


    	while($result3 = $query3->fetch_assoc()) {
            $nbrereg = $result3['nbre'];
        }

		?> 		
		                                <tr>
											<td>
											<?php echo $result2['firstname']." ".$result2['lastname']." ".$result2['email']; ?> </td>
                                            <td><?php echo $result2['location'];?></td>
<?php

	    ?>
                                            <td><?php echo $nbrereg;?> </td>
											<td>
                                                <form action="add_registration.php" method="GET" id="addregistration" class="">
                                                <input type="hidden" name="id" value="<?php echo $result2['id'];?>">
                                                        <button type="submit" id="add_registration" class="btn btn-primary btn-sm">
                                                                <i class="fa fa-dot-calendar"></i> users info
                                                        </button>
                                                </form>
											</td>
                                        </tr>
	<?php
	}

?>
                                        
                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>


                </div>
            </div><!-- .animated -->

	<div class="card">
        <div class="card-header">
            <strong>add user</strong> 
        </div>
        <div class="card-body card-block">
            <form action="ws/add_user.php" method="post" id="add" class="">
                <div class="form-group">
                	<div>
                    <label for="email" class=" form-control-label col-md-2">Email </label>
                    <input name="email" type="email" class="col-md-2" required>
                    </div>
                    <div>
                	<label for="firstname" class="col-md-2 form-control-label">First Name</label>
                    <input name="firstname" type="text" class="col-md-2" required>
                    </div>
                    <div>
                	<label for="lastname" class="col-md-2 form-control-label">Last Name</label>
                    <input name="lastname" type="text" class="col-md-2" required> 
                    <?php
	$queryLocations = "SELECT * FROM location lo WHERE id=".$loc_admin." ORDER BY lo.id ASC";
	$resultLocations = $conn->query($queryLocations);
    ?>

                	<label for="loc_id" class=" form-control-label col-md-2">Location</label>
                	<select name="loc_id" class="col-md-2" required>
                		<option value="">Select Location</option>
						<?php while($loc = $resultLocations->fetch_assoc()) { ?>
								<option value="<?php echo $loc['id']; ?>"><?php echo $loc['name']; ?></option>
						<?php } ?>
					</select>
                    </div>
                    <div>
                    <button type="submit" id="submitForm" class="btn btn-primary btn-sm">
                        <i class="fa fa-dot-circle-o"></i> create or update User
                    </button>
                    </div>
                </div>
            </form>
        </div>
    </div>


        </div><!-- .content -->


    </div><!-- /#right-panel -->

    <!-- Right Panel -->


    <script src="vendors/jquery/dist/jquery.min.js"></script>
    <script src="vendors/popper.js/dist/umd/popper.min.js"></script>
    <script src="vendors/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="assets/js/main.js"></script>


    <script src="vendors/datatables.net/js/jquery.dataTables.min.js"></script>
    <script src="vendors/datatables.net-bs4/js/dataTables.bootstrap4.min.js"></script>
    <script src="vendors/datatables.net-buttons/js/dataTables.buttons.min.js"></script>
    <script src="vendors/datatables.net-buttons-bs4/js/buttons.bootstrap4.min.js"></script>
    <script src="vendors/jszip/dist/jszip.min.js"></script>
    <script src="vendors/pdfmake/build/pdfmake.min.js"></script>
    <script src="vendors/pdfmake/build/vfs_fonts.js"></script>
    <script src="vendors/datatables.net-buttons/js/buttons.html5.min.js"></script>
    <script src="vendors/datatables.net-buttons/js/buttons.print.min.js"></script>
    <script src="vendors/datatables.net-buttons/js/buttons.colVis.min.js"></script>
    <script src="assets/js/init-scripts/data-table/datatables-init.js"></script>
    <script type="text/javascript">
    	// this is the id of the form
		$("#add").submit(function(e) {

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
                       location.reload();
		           }
		         });
		});
    </script>
</body>
</html>