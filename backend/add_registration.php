<?php
    include('./head_admin.php');
    include('./inc/nbreplace.php');
    include('./inc/utils.php');

    if (isset($_GET['id'])){
        //id= userid
        $id            = getValueFromArray($_GET, 'id', 0);
    } 

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
	if (isset($_GET['id'])) {
	    $sql = "SELECT * FROM `user` WHERE id=".$id." and location=".$loc_admin;
	    $query = $conn->query($sql);
	    while($result = $query->fetch_assoc()) {
    		$lastname       = $result['lastname'];
    		$firstname      = $result['firstname'];
            $email          = $result['email'];
            $date_creation  = $result['date_creation'];
		}
	}
	?>
	    <div class="breadcrumbs">
            <div class="col-sm-4">
                <div class="page-header float-left">
                    <div class="page-title">
                        <h1>user : <?php echo $firstname." ".$lastname;?>  </h1>
                        <span> create date : <?php echo $date_creation." - email : ".$email;?> </span>
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
                                <strong class="card-title">stats</strong>
                            </div>
                            <div class="card-body"></div>
                        </div>
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
                                <strong class="card-title">Registrations</strong>
                            </div>
                            <div class="card-body">
<?php


    if (isset($_GET['id'])) {
    	$sql1 = "SELECT day.date, parking, location.name FROM `register`, day, location WHERE day.id=register.day_id and user_id=".$id." and register.location_id=location.id and date(day.date)>=date(NOW()) order by day.date asc" ;
    	$query1 = $conn->query($sql1);
    } 
	while($result1 = $query1->fetch_assoc()) {
?> 		
                                <div class="col-md-6 col-lg-3">
                                    <div class="card">
                                        <div class="card-body p-0 clearfix">
                                            <i class="fa fa-calendar bg-info p-4 font-2xl mr-3 float-left text-light"></i>
                                            <div class="h5 text-info mb-0 pt-3"><?php echo substr($result1['date'], 0, 10). " | ".$result1['name'];?></div>
                                            <div class="text-muted text-uppercase font-weight-bold font-xs small">parking : <?php echo $result1['parking'];?></div>
                                        </div>
                                    </div>
                                </div>
<?php } ?>
                                <div class="col-md-6 col-lg-3">
                                    <div class="card">
                                        <div class="card-body p-0 clearfix">
                                            <i class="fa fa-calendar bg-warning  p-4 font-2xl mr-3 float-left text-light"></i>
                                            <form action="ws/add_reservation.php" method="POST" id="add" class="add">
                                                <input type="hidden" name="loc_id" value="<?php echo $loc_admin;?>">
                                                <input type="hidden" name="userId" value="<?php echo $id;?>">
                                                <label for="date">Date</label>
                                                <input type="date" name="date" id='date'>

                                                <div class="h5 text-warning  mb-0 pt-3"> <button type="submit" id="addbtn" >Add</button></div>
                                                <div class="text-muted text-uppercase font-weight-bold font-xs small"></div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
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
    <script type="text/javascript">

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
