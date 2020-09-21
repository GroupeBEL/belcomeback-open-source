<?php
    //Generate file
    $filename = "users.xls";
    header('Content-Disposition: attachment; filename=' . $filename );
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    include('../inc/connect.php');
    include('../inc/check_session.php');

    $admin='';
    $sql = "SELECT * FROM `user` WHERE admin=1 and email='".$mail."'";
    $query = $conn->query($sql);
    
    while($admin = $query->fetch_assoc()) {
        $ok='1';
        $loc_admin=$admin['admin_location'];
    }

    if($ok==0)
    {echo "you are not allowed to see this page"; die; }

    $date = "";
    $location = "";
?>

                                <table cellspacing='0'">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Office</th>
                                            <th>registrations</th>
											<th>action</th>
										   
                                        </tr>
                                    </thead>
 
        <!-- Table Header -->

        <!-- Table Body -->
        <tbody>
        
<?php



	$sqlGetTeamUsers = "SELECT user.*, location.name as lieu FROM `user`, location WHERE user.location=location.id and location.id=".$loc_admin ;
	$resultusers = $conn->query($sqlGetTeamUsers);


	while($teamusers = $resultusers->fetch_assoc()) {
        $location=$teamusers['lieu'];

// get number of registration for the user and the location
	$sqlGetregistration = "SELECT count(id) as nbre FROM register WHERE user_id=".$teamusers['id']." and location_id=".$loc_admin ;
	$resultregistration = $conn->query($sqlGetregistration);


	while($nbreregistration = $resultregistration->fetch_assoc()) {
        $nbrereg=$nbreregistration['nbre'];
    }

		?> 		
		                                <tr>
											<td>
											<?php echo $teamusers['firstname']." ".$teamusers['lastname']." ".$teamusers['email']; ?> </td>
                                            <td><?php echo $teamusers['lieu'];?></td>
<?php

	    ?>
                                            <td><?php echo $nbrereg;?> </td>
											<td>
                                              
											</td>
                                        </tr>
	<?php
	}

?>
                                        
                                        
                                    </tbody>
    </table>