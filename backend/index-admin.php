<?php
    include('./head_admin.php');

    $ok= '0';
	$admin='';
	$sql = "SELECT * FROM `user` WHERE admin=1 and email='".$mail."'";
	$query = $conn->query($sql);
	while($admin = $query->fetch_assoc()) {
		$ok='1';
	}
    if($ok==0)
    {echo "You are not allowed to access to this page"; die; }
    include('./menu.php');
?> 
    <div id="right-panel" class="right-panel">

	<?php
	   include('./header.php');
	?>
        <div class="breadcrumbs">
            <div class="col-sm-4">
                <div class="page-header float-left">
                    <div class="page-title">
                        <h1>BELcome-back</h1>
                    </div>
                </div>
            </div>
            <div class="col-sm-8">
                <div class="page-header float-right">
                    <div class="page-title">
                        <ol class="breadcrumb text-right">
                            <li class="active">Dashboard</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
        <div class="content mt-3">
            <div class="col-sm-12">
                <div class="alert  alert-success alert-dismissible fade show" role="alert">
                    <span class="badge badge-pill badge-success">Success</span> this app is under contruction.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
<?php
    include('./dash_export.php');
    include('./inc/stats/nb_people.php');
    include('./inc/stats/graphs.php');
?>
        </div> <!-- .content -->
	<?php include('./footer.php');?>
    </div><!-- /#right-panel -->
<?php
    include('./inc/stats/jsgraph.php');
?>
