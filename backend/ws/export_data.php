<?php
    //Generate file
    $filename = "enrollment.xls";
    header('Content-Disposition: attachment; filename=' . $filename );
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    include('.../inc/connect.php');
    include('.../inc/check_session.php');
    include('.../inc/utils.php');

    $admin='';
    $sql = "SELECT * FROM `user` WHERE admin=1 and email='".$mail."'";
    $query = $conn->query($sql);
    while($admin = $query->fetch_assoc()) {
        $ok='1';
    }

    if($ok==0)
    {echo "you are not allowed to see this page"; die; }

    $date = "";
    $location = "";
?>
    <table cellspacing='0'> 
        <thead>
            <tr>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Email</th>
                <th>Date</th>
                <th>Location</th>
                <th>Canteen slot</th>
                <th>Parking</th>
            </tr>
        </thead> 
        <!-- Table Header -->

        <!-- Table Body -->
        <tbody>
        
            <?php

                $loc_id    = getValueFromArray($_GET, 'loc_id', 0);
                $day_id    = getValueFromArray($_GET, 'day_id', 0);

                $sql="SELECT u.firstname, u.lastname, u.email,u.id as userid, DATE(d.date) as la_date, l.name, r.parking FROM register r, day d, location l, user u WHERE u.id=r.user_id AND r.day_id = d.id AND r.location_id = l.id AND  r.location_id='$loc_id' AND r.day_id='$day_id'";

                $query = mysqli_query( $conn, $sql);
                while($result=mysqli_fetch_array($query)) {
                    $location   = $result['name'];
                    $date       = $result['la_date'];
                    $parking    = $result['parking'];

// abl add canteens slot
$slot   ="no canteens";
$sqlcantine = "SELECT canteen_timeslots.timeslot FROM `canteen_timeslots`, canteen_registration WHERE canteen_registration.user_id=".$result['userid']." and canteen_registration.day_id='".$day_id."' and canteen_timeslots.id=canteen_registration.timeslot_id";
$querycantine = mysqli_query( $conn, $sqlcantine);
                while($cantine=mysqli_fetch_array($querycantine)) {
                    $slot   =$cantine['timeslot'];
                }
                    echo "<tr><td>".$result['firstname']."</td><td>". $result['lastname']."</td><td>".$result['email']."</td><td>".$result['la_date']."</td><td>".$result['name']."</td><td>".$slot."</td><td>".$parking."</td></tr>";
                }
            ?>
        </tbody>
    </table>