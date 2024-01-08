<?php

//get the database connection
require('db_conn.php');

$str_json = file_get_contents('php://input');
$obj = json_decode($str_json);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$sql = $conn->prepare("INSERT INTO bols (carrier, shipDate) VALUES (?,?)");
$sql->bind_param("ss", $obj->carrier, $obj->shipDate);


if ($sql->execute()) {
    echo "New bol created.";
} else {
    echo "Error creating record: \n" . $conn->error;
}

$sql->close();
$conn->close();
?>