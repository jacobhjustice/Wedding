<?php
    
    require 'secret.php';
    $con = mysqli_connect($server, $user, $password, $db);
    if (mysqli_connect_errno()) {
        die("ERROR: " . mysqli_connect_error());
    } 

    $query = mysqli_prepare($con, "SELECT * FROM Guests ORDER BY ID ASC");
    mysqli_stmt_execute($query);
    $err = mysqli_error($con);
    if (strlen($err) > 0) {
        die("ERROR: " . $err);
    }

    $result = mysqli_stmt_get_result($query);
    mysqli_stmt_close();

    $arr = array();
    while ($row =  mysqli_fetch_array($result, MYSQLI_ASSOC))
    {
        array_push($arr, (object)[
            'ID' => $row["ID"],
            'NAME' => $row["Name"],
            'RSVP' => $row["RSVP"],
            'PRIMARY_GUEST' => $row["PrimaryGuest"]
        ]);
    }

    echo json_encode($arr);
?>