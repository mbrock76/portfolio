<?php

//get the database connection
require('db_conn.php');

$str_json = file_get_contents('php://input');
$obj = json_decode($str_json);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = $conn->prepare("UPDATE inventory SET qty = qty + ? WHERE id = ?");
$sql->bind_param("ii", $obj->qty, $obj->id);

if($sql->execute()){
	echo "Inventory updated.";
}else{
	echo "Error updating record: " . $conn->error;
}

$sql->close();
$conn->close();
?>