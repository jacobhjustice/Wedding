<?php
$host_name = 'db778380322.hosting-data.io';
$database = 'db778380322';
$user_name = 'dbo778380322';
$password = 'Pipopo3MB!';
$connect = mysqli_connect($host_name, $user_name, $password, $database);

if (mysqli_connect_errno()) {
    die('<p>Failed to connect to MySQL: '.mysqli_connect_error().'</p>');
} else {
    echo '<p>Connection to MySQL server successfully established.</p >';
}
?>