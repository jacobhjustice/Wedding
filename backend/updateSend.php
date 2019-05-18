<?php
    
    require 'secret.php';
    $con = mysqli_connect($server, $user, $password, $db);
    if (mysqli_connect_errno()) {
        die("ERROR: " . mysqli_connect_error());
    } 

    $isSent = filter_var($_GET['SENT'], FILTER_VALIDATE_BOOLEAN);
    $id = filter_var($_GET['ID'], FILTER_SANITIZE_NUMBER_INT);

    $query = mysqli_prepare($con, "UPDATE Guests SET SaveTheDateSent = ? WHERE ID = ?");
    mysqli_stmt_bind_param($query, "ii", $isSent, $id);
    mysqli_stmt_execute($query);
    mysqli_stmt_close();

    $err = mysqli_error($con);
    if (strlen($err) > 0) {
        die("ERROR: " . $err);
    }
    echo "SUCCESS";
?>