<?php

$servername = "";
$username = "";
$password = "";
$dbname = "";
$str_json = file_get_contents('php://input');
$obj = json_decode($str_json);

$conn = new mysqli($servername, $username, $password, $dbname);
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$sql = "INSERT INTO inventory (loc, partID, qty)
VALUES ('".$obj->loc."',".$obj->partID.",".$obj->qty.")";

if(mysqli_query($conn, $sql)){
	echo "created";
}else{
	echo "error: ".$conn->error;
}

$conn->close();
?>