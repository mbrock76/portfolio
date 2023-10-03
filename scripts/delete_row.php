<?php
$servername = "";
$username = "";
$password = "";
$dbname = "";
$str_json = file_get_contents('php://input');
$obj = json_decode($str_json);

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

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