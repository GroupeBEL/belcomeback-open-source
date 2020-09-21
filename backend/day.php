<?php
    include('./inc/utils.php');

    if (isset($_GET['id'])) {
        //id= userid
        $id            = getValueFromArray($_GET, 'id', 0);
    }

    include('./head.php');
    include('./inc/nbreplace.php'); 

    $ok  =   '0';
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

	if (isset($_GET['id']))
    {
	    $sql1 = "SELECT * FROM `day` WHERE id=".$id." and location_id=".$loc_admin;
	    $query1 = $conn->query($sql1);
	    while($result1 = $query1->fetch_assoc()) {
		    $date         = $result1['date'];
		    $places_nb    = $result1['places_nb'];
		}
	}

	?>
	    <div class="breadcrumbs">
            <div class="col-sm-4">
                <div class="page-header float-left">
                    <div class="page-title">
                        <h1>Dashboard for <?php echo substr($date, 0, 10)." for ".$location;?>  </h1>
                    </div>
                </div>
            </div>
            <div class="col-sm-8">
                <div class="page-header float-right">
                    <div class="page-title">
                        <ol class="breadcrumb text-right">
						<li><a href="#admin">Admin</a></li>
                            <li><a href="#user">User list</a></li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>

		<div class="content mt-3">
            <div class="animated fadeIn">
                <div class="row">
					<?php include('./inc/dash_day.php');?>
				</div>
			</div>
	        <div class="breadcrumbs">
            <div class="col-sm-4">
                <div class="page-header float-left">
                    <div class="page-title">
                        <h1>Canteen Time slots for <?php echo $location;?>  </h1>
                    </div>
                </div>
            </div>		
		</div>
		<div class="content mt-3">
            <div class="animated fadeIn">
                <div class="row">
					<?php include('./inc/dash_slot.php');?>
				</div>
			</div>
		
		</div>
	    <div class="breadcrumbs">
            <div class="col-sm-4">
                <div class="page-header float-left">
                    <div class="page-title">
                        <h1>Set values  for<?php echo substr($date, 0, 10)." for ".$location;?>  </h1>
                    </div>
                </div>
            </div>
        </div>
		<div class="content mt-3" ><a href='#' id="admin"></a>
            <div class="animated fadeIn">
                <div class="row">
					<div class="card">
                        <div class="card-header">Update datas </div>
                        <div class="card-body card-block">
                            <form action="ws/update_day.php" method="POST">
							<input type=hidden name="day_id" value="<?php echo $id;?>">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-addon">Max people</div>
                                        <input type="number" id="places_nb" name="places_nb" class="form-control" value="<?php echo $places_nb;?>">
                                        <div class="input-group-addon"><i class="fa fa-user"></i></div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-addon">Nbre couverts</div>
                                        <input type="number" id="flatware_nb" name="flatware_nb" class="form-control"  value="<?php echo $flatware_nb;?>">
                                        <div class="input-group-addon"><i class="fa fa-cutlery"></i></div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-addon">place parking</div>
                                        <input type="number" id="parking_places_nb" name="parking_places_nb" class="form-control"  value="<?php echo $parking_places_nb;?>">
                                        <div class="input-group-addon"><i class="fa fa-road"></i></div>
                                    </div>
                                </div>
                                <div class="form-actions form-group">
                                    <button type="submit" class="btn btn-primary btn-sm">Update</button>
                                </div>
                            </form>
                        </div>
                      </div>
				</div>
			</div>
		
		</div>
        <div class="breadcrumbs">
            <div class="col-sm-4">
                <div class="page-header float-left">
                    <div class="page-title">
                        <h1>User list for <?php echo substr($date, 0, 10)." for ".$location;?>  <span><a href="ws/export_data.php?day_id=<?php echo $_GET['id']; ?>&loc_id=<?php echo $_GET['lid']; ?>"><i class="fa fa-cloud-download"></i></a></span></h1>
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
                                <strong class="card-title">Users</strong>
                            </div>
                            <div class="card-body">
                                <table id="bootstrap-data-table-export" class="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Office</th>
                                           <?php if(isset($_GET['id'])){?>
										   <th>Canteen slot</th>
											<th>parking</th>
                                            <th>Nbr registration</th>
										   <?php } ?>
                                        </tr>
                                    </thead>
                                    <tbody>
<?php


    if (isset($_GET['id'])){
    	$sql2 = "SELECT user.*, location.name as location, register.parking as parking FROM `register`, `user`, location WHERE register.user_id=user.id and register.day_id='".$id."' and register.location_id=location.id" ;
    	$query2 = $conn->query($sql2);
    } 

	while($result2 = $query2->fetch_assoc()) {
		?> 		
		                                <tr>
											<td>
											<?php echo $result2['firstname']." ".$result2['lastname']; ?> </td>
                                            <td><?php echo $result2['location'];?></td>
<?php
        $timeslot='pas de cantine';
        //get canteen reg
        $sql3 = "SELECT canteen_timeslots.timeslot FROM `canteen_timeslots`, canteen_registration WHERE canteen_registration.user_id=".$result2['id']." and canteen_registration.day_id='".$id."' and canteen_timeslots.id=canteen_registration.timeslot_id" ;
	    $queyr3 = $conn->query($sql3);
	    while($result3 = $queyr3->fetch_assoc()) {
	        $timeslot=$result3['timeslot'];
	    }

	    ?>
                                            <td><?php echo $timeslot; ?> </td>
											<td>
											    <?php echo $result2['parking']; ?>
											</td>
        <?php
        // get number of registration for the user and the location
	    $sql4 = "SELECT count(id) as nbre FROM register WHERE user_id=".$result2['id']." and location_id=".$loc_admin ;
	    $query4 = $conn->query($sql4);

    	while($result4 = $query4->fetch_assoc()) {
            $nbrereg=$result4['nbre'];
        }
        ?>
        											<td>
											    <?php echo $nbrereg; ?>
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
            </div>
        </div>
    </div>
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
</body>
</html>