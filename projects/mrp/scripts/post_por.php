<?php

//get the database connection
require('db_conn.php');

$str_json = file_get_contents('php://input');
$obj = json_decode($str_json);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = $conn->prepare("INSERT INTO por (partID,  emp, ordDate, recDate, qty) VALUES (?,?,?,?,?)");
$sql->bind_param("isssi", $obj->partID, $obj->emp, $obj->ordDate, $obj->recDate, $obj->qty);

if ($sql->execute()) {
    echo "New Por created.";
} else {
    echo "Error creating record: " . $conn->error;
}

$sql->close();
$conn->close();
?>