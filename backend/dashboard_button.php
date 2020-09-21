<?php
    include('./inc/connect.php');
    include('./inc/check_session.php');
    include('./inc/utils.php');
?>
<!DOCTYPE html>
<html class="no-js" lang="en">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>BEL come Back</title>
    <meta name="description" content="Bel come Back">
    <link rel="apple-touch-icon" href="./img/apple-icon.png">
    <link rel="shortcut icon" href="favicon.ico">
    <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <link rel="manifest" crossorigin="use-credentials"  href="manifest.json">
    <link rel="apple-touch-startup-image" href="img/launch-1536x2048.png" media="(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)">
    <link rel="apple-touch-startup-image" href="img/launch-1668x2224.png" media="(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)">
    <link rel="apple-touch-startup-image" href="img/launch-2048x2732.png" media="(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)">
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
    <script src="vendors/bootstrap/dist/js/bootstrap.min.js"></script>		
    <script src="vendors/popper.js/dist/umd/popper.min.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="vendors/chart.js/dist/Chart.bundle.min.js"></script>
    <script src="assets/js/dashboard.js"></script>
    <script src="vendors/jqvmap/dist/jquery.vmap.min.js"></script>
    <script src="vendors/jqvmap/examples/js/jquery.vmap.sampledata.js"></script>
    <script src="vendors/jqvmap/dist/maps/jquery.vmap.world.js"></script>
    <link rel="stylesheet" type="text/css" href="./css/MyFontsWebfontsKit.css">
    <style>
        body {
            background: #ffffff;
        }
        @media screen and (min-width: 480px) {
            .header{
                background-image: url(./img/assets/fond-head@3x.png);
                min-height: 222px;
                background-repeat: no-repeat;
                background-position-y: bottom;
                color: white;
                text-align: center;
                padding-top: 50px;
                background-size: cover;
            }
            .HelloHeadline { 
            	font-family: HelloHeadline;
            	font-weight: normal;
            	font-style: normal;
            }
        }
        @media screen and (max-width: 480px) {
            .header{
                background-image: url(./img/assets/fond-head.png);
                min-height: 208px;
                background-repeat: no-repeat;
                background-size: contain;
                background-position-y: bottom;
                color: white;
                text-align: center;
                padding-top: 50px;
            	}
            .HelloHeadline { 
            	font-family: HelloHeadline;
            	font-weight: normal;
            	font-style: normal;
            }
        }
    </style>	


</head>
<body style='background:#015641;'>
<?php 
    $token            = getValueFromArray($_GET, 'token', 0);
    $location_id      = '1';

    if ( $token == md5($YOUR_TOKEN_SALT.'location'.$location_id) ) {
?> 

    <div id="right-panel" class="">
	    <div class="breadcrumbs">
            <div class="col-sm-12">
                <div class="page-header">
                    <div class="page-title" style='text-align: center;'>
                        <img src='./img/titre.png' style='max-width:40%;'>
                    </div>
                </div>
                <div class="content mt-3" style="    margin-top: 100px!important;" id="dash"></div>
<?php
    } else {
    	echo "error token";
    }
    $linkdash="./incdashboard2.php?token=".md5($YOUR_TOKEN_SALT.'location'.$location_id);
?>
    <script>
        $(document).ready(function() {
         var url='<?php echo $linkdash;?>';
        	console.log('url: '+url);
        	$.get( url, function( data ) {
          $("#dash" ).html( data );
            });
        });
        window.setInterval(function(){
          var url='<?php echo $linkdash;?>';
        	console.log('url: '+url);
        	$.get( url, function( data ) {
          $("#dash" ).html( data );
            });
        }, 3000);
    </script>