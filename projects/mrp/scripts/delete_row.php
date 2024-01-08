<?php

//get the database connection
require('db_conn.php');

//get the json string passed with the request
$str_json = file_get_contents('php://input');
$obj = json_decode($str_json);

$tables = array("bols", "inventory", "por", "rou", "scrap", "sor", "users");

if(in_array($obj->table, $tables) && is_numeric($obj->id)){
	
	$sql = "DELETE FROM ".$obj->table." WHERE id = ".$obj->id;

	if (mysqli_query($conn, $sql)) {
	  echo "Record deleted.";
	} else {
	  echo "Error deleting record: " . $conn->error;
	}

	$conn->close();
}else{
	echo "NO!";
}
?>