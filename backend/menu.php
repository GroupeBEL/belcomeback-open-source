<!-- Left Panel -->
<aside id="left-panel" class="left-panel">
    <nav class="navbar navbar-expand-sm navbar-default">

        <div class="navbar-header">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-menu" aria-controls="main-menu" aria-expanded="false" aria-label="Toggle navigation">
                <i class="fa fa-bars"></i>
            </button>
            <a class="navbar-brand" href="./"><img src="img/logo.png" alt="Logo"></a>
            <a class="navbar-brand hidden" href="./"><img src="img/logo.png" alt="Logo"></a>
        </div>

        <div id="main-menu" class="main-menu collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li class="active">
                    <a href="./index-admin.php"> <i class="menu-icon fa fa-dashboard"></i>Global Dashboard </a>
                </li>
				
				
			<li class="menu-item-has-children dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> 
					<i class="menu-icon fa fa-laptop"></i>Past Days</a>
                    <ul class="sub-menu children dropdown-menu">
                        
                    <?php
					$Dayoff='';
						$sqlGetDays = "SELECT * FROM `day` Where DATE(date) < DATE(NOW())  and day.location_id=".$loc_admin." order by date";
						$resultDay = $conn->query($sqlGetDays);
						while($Dayoff = $resultDay->fetch_assoc()) {
							
								echo '<li><i class="fa fa-calendar"></i>';
								echo '<a href="day.php?id='.$Dayoff['id'].'&lid='.$Dayoff['location_id'].'">'.substr($Dayoff['date'], 0, 10).'</a></li>';

							}
					?>  
                    </ul>
                </li>
				
				
				
				<h3 class="menu-title">Days to come (14 days)</h3><!-- /.menu-title -->
                <li class="menu-item-has-children dropdown">
                    <ul class="sub-menu children">
					<?php
					$Day='';
						$sqlGetDays = "SELECT * FROM `day` Where DATE(date) >= DATE(NOW()) and DATE(date) <= DATE(NOW() + INTERVAL 14 DAY) and day.location_id=".$loc_admin."  order by date";
						$resultDay = $conn->query($sqlGetDays);
						while($Day = $resultDay->fetch_assoc()) {
							
								echo '<li><i class="fa fa-calendar"></i>';
								echo '<a href="day.php?id='.$Day['id'].'&lid='.$Day['location_id'].'">'.substr($Day['date'], 0, 10).'</a></li>';

							}
					?>

					
					
					</ul>
				<h3 class="menu-title">Users</h3><!-- /.menu-title -->
                <li class="menu-item-has-children dropdown">
                    <ul class="sub-menu children">
					<li> <i class="fa fa-users"></i><a href='list_users.php'> Users List</a></li>
					<ul>
				</li>
				</ul>
				<h3 class="menu-title">Settings</h3>
					<li> <a href="manage_quotas.php"><i class="menu-icon fa fa-cog"></i>Manage Globals quotas</a></li>
					<li> <a href="manage_timeslots.php"><i class="menu-icon fa fa-cog"></i>Canteen Time slots</a></li>
					<li> <a href="manage_public_spaces.php"><i class="menu-icon fa fa-cog"></i>Manage public spaces</a></li>

				<h3 class="menu-title">More info ?</h3><!-- /.menu-title -->
                <li class="menu-item-has-children dropdown">
                    <a href="README.md" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-desktop"></i>help</a>
				</li>	



				
            </ul>
        </div><!-- /.navbar-collapse -->
    </nav>
</aside><!-- /#left-panel -->