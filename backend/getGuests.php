 <?php
    
    require 'secret.php';
    $con = mysqli_connect($server, $user, $password, $db);
    if (mysqli_connect_errno()) {
        die("ERROR: " . mysqli_connect_error());
    } 

    $query;
    $name;
    if(isset($_GET['NAME']) && !empty($_GET['NAME'])){
        $name = filter_var(trim($_GET['NAME']), FILTER_SANITIZE_STRING) . "%";
        $query = mysqli_prepare($con, "SELECT G.* FROM Guests G LEFT JOIN Guests P ON P.ID = G.PrimaryGuest LEFT JOIN Guests S ON S.PrimaryGuest = G.ID WHERE G.Name LIKE ? OR P.Name LIKE ? OR S.Name LIKE ? ORDER BY G.ID ASC");
        mysqli_stmt_bind_param($query, "sss", $name, $name, $name);
    } else {
        $query = mysqli_prepare($con, "SELECT * FROM Guests ORDER BY ID ASC");
    }
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
            'PRIMARY_GUEST' => $row["PrimaryGuest"],
            'ADDRESS' => $row["Address"],
            'SAVE_THE_DATE' => $row["SaveTheDateSent"]
        ]);
    }

    echo json_encode($arr);
?>