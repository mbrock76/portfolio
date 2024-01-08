<?php

//get the database connection
require('db_conn.php');

$str_json = file_get_contents('php://input');
$obj = json_decode($str_json);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = $conn->prepare("UPDATE sor SET qty =?, stepQty =?, pickQty =?, step =?, bol =? WHERE id =?");
$sql->bind_param("isssii", $obj->qty, $obj->stepQty, $obj->pickQty, $obj->step, $obj->bol, $obj->id);

if ($sql->execute()) {
  echo "Sor updated.";
} else {
  echo "Error updating record: " . $conn->error;
}

$sql->close();
$conn->close();
?>