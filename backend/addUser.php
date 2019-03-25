<?php
    
    require 'secret.php';
    $con = mysqli_connect($server, $user, $password, $db);
    if (mysqli_connect_errno()) {
        die("ERROR: " . mysqli_connect_error());
    } 

    $data = json_decode(urldecode($_GET['DATA']));
    $row = $data[0];

    $name = filter_var(trim($row->NAME), FILTER_SANITIZE_STRING);
    $male = filter_var(trim($row->ISMALE), FILTER_SANITIZE_NUMBER_INT);
    $address = filter_var(trim($row->ADDRESS), FILTER_SANITIZE_STRING);
    $phone = filter_var(trim($row->PHONE), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($row->EMAIL), FILTER_SANITIZE_EMAIL);

    $query = mysqli_prepare($con, "INSERT INTO Guests (Name, Email, Phone, Address, IsMr) VALUES (?, ?, ?, ?, ?)");
    mysqli_stmt_bind_param($query, "ssssi", $name, $email, $phone, $address, $male);
    mysqli_stmt_execute($query);
    mysqli_stmt_close();

    $err = mysqli_error($con);
    if (strlen($err) > 0) {
        die("ERROR: " . $err);
    }

    $masterID = mysqli_insert_id($con);
    echo($masterID);

    for($i = 1; $i < count($data); $i++) {
        $row = $data[$i];

        $name = filter_var(trim($row->NAME), FILTER_SANITIZE_STRING);
        $male = filter_var(trim($row->ISMALE), FILTER_SANITIZE_NUMBER_INT);
        $address = filter_var(trim($row->ADDRESS), FILTER_SANITIZE_STRING);
        $phone = filter_var(trim($row->PHONE), FILTER_SANITIZE_STRING);
        $email = filter_var(trim($row->EMAIL), FILTER_SANITIZE_EMAIL);
        
        $query = mysqli_prepare($con, "INSERT INTO Guests (Name, Email, Phone, Address, IsMr, PrimaryGuest) VALUES (?, ?, ?, ?, ?, ?)");
        mysqli_stmt_bind_param($query, "ssssii", $name, $email, $phone, $address, $male, $masterID);
        mysqli_stmt_execute($query);
        mysqli_stmt_close();

        $err = mysqli_error($con);
        if (strlen($err) > 0) {
            die("ERROR: " . $err);
        }

        $id = mysqli_insert_id($con);
        echo($id);
    }
?>