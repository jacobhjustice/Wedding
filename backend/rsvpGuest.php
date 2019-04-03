<?php
    
    require 'secret.php';
    $con = mysqli_connect($server, $user, $password, $db);
    if (mysqli_connect_errno()) {
        die("ERROR: " . mysqli_connect_error());
    } 

    $data = json_decode(urldecode($_GET['DATA']));
    $row = $data[0];

    for($i = 0; $i < count($data); $i++) {
        $row = $data[$i];

        $id = $row->ID;
        $rsvp = filter_var(trim($row->RSVP), FILTER_SANITIZE_STRING);
        $query = mysqli_prepare($con, "UPDATE Guests SET RSVP=? WHERE ID=?");
        mysqli_stmt_bind_param($query, "si", $rsvp, $id);
        mysqli_stmt_execute($query);
        mysqli_stmt_close();

        $err = mysqli_error($con);
        if (strlen($err) > 0) {
            die("ERROR: " . $err);
        }
    }
    echo("SUCCESS");
?>