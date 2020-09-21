<!DOCTYPE html>
	<?php
		include('./inc/connect.php');
    	include('./inc/check_session.php');
    	include('./inc/utils.php');
        $area_id            = getValueFromArray($_GET, 'area_id', 0);

		$sql = "SELECT  li.* FROM area li where li.id=".$area_id;
		$query = $conn->query($sql);
		while($result = $query->fetch_assoc()) {
			$name =	$result['name'];
		}
	?>

<html class="no-js" lang="en">
	<head> 
 		<meta charset="utf-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	    <title>BEL come-Back </title>
	    <meta name="description" content="Sufee Admin - HTML5 Admin Template">
	    <meta name="viewport" content="width=device-width, initial-scale=1">

	    <link rel="apple-touch-icon" href="apple-icon.png">
	    <link rel="shortcut icon" href="favicon.ico">
		<style type="text/css">
			_:-ms-fullscreen, :root aside.left-panel { max-width: 280px; }
		</style>
	  	<link rel="stylesheet" href="vendors/bootstrap/dist/css/bootstrap.min.css">
	    <link rel="stylesheet" href="vendors/font-awesome/css/font-awesome.min.css">
	    <link rel="stylesheet" href="vendors/themify-icons/css/themify-icons.css">
	    <link rel="stylesheet" href="vendors/flag-icon-css/css/flag-icon.min.css">
	    <link rel="stylesheet" href="vendors/selectFX/css/cs-skin-elastic.css">
	    <link rel="stylesheet" href="vendors/jqvmap/dist/jqvmap.min.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.37/css/bootstrap-datetimepicker.min.css" />
	    <link rel="stylesheet" href="assets/css/style.css">
	    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800' rel='stylesheet' type='text/css'>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js" charset="utf-8"></script>
		<script src="vendors/jquery/dist/jquery.min.js"></script>	
	    <script src="vendors/popper.js/dist/umd/popper.min.js"></script>
	    <script src="vendors/bootstrap/dist/js/bootstrap.min.js"></script>
	    <script src="assets/js/main.js"></script>
		<link rel="stylesheet" type="text/css" href="./css/MyFontsWebfontsKit.css">
		<style>
			body{
				background: #0c573c;
			}
			@media screen and (min-width: 480px) {
				.HelloHeadline { 
					font-family: HelloHeadline;
					font-weight: normal;
					font-style: normal;
				    color:white;
				}
			}

			@media screen and (max-width: 480px) {
				.HelloHeadline { 
					font-family: HelloHeadline;
					font-weight: normal;
					font-style: normal;
				    color:white;
				}
			}
		</style>	
	</head>
  	<div class="content mt-3">
		<div class="row justify-content-md-center">
	   		<div class="col-sm-12 col-md-12 col-lg-12" style="text-align:center;min-height:20vh;">
        		<h5 class="HelloHeadline">live count for <?php echo $name;?></h5>
			</div>
    		<div class="col-sm-12 col-md-12 col-lg-12" style="text-align:center;">
        		<h1 id='nbre' class="HelloHeadline" style="font-size: 100pt;"></h1>
    		</div>
		</div>
	</div>
	<script>
		window.setInterval(function(){
		  var url="ws/get_nb_registered_by_area.php?area_id="+<?php echo $area_id;?>;
			console.log('url: '+url);
			$.get( url, function( data ) {
		  $("#nbre" ).html( data );
		    });
		}, 5000);
	</script>
	