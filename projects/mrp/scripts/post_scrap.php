<?php

//get the database connection
require('db_conn.php');

$str_json = file_get_contents('php://input');
$obj = json_decode($str_json);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = $conn->prepare("INSERT INTO scrap (partID,  qty, emp) VALUES (?,?,?)");
$sql->bind_param("iis", $obj->partID, $obj->scrap, $obj->emp);


if ($sql->execute()) {
    echo "Scrap recorded.";
} else {
    echo "Error creating record: " . $conn->error;
}

$sql->close();
$conn->close();
?>