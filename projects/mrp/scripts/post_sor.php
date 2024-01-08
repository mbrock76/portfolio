<?php

//get the database connection
require('db_conn.php');

$str_json = file_get_contents('php://input');
$obj = json_decode($str_json);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = $conn->prepare("INSERT INTO sor (partID,  orderQty, qty, emp) VALUES (?,?,?,?)");
$sql->bind_param("iiis", $obj->partID, $obj->orderQty, $obj->orderQty , $obj->emp);


if ($sql->execute()) {
    echo "Sales order created.";
} else {
    echo "Error creating record: " . $conn->error;
}

$sql->close();
$conn->close();
?>