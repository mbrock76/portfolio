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

$sql = $conn->prepare("INSERT INTO rou (sorID, step, emp, compQty, scrapQty, lot, serial) VALUES (?,?,?,?,?,?,?)");
$sql->bind_param("issiiss", $obj->sorID, $obj->step, $obj->emp, $obj->compQty, $obj->scrapQty, $obj->lot, $obj->serial);

if ($sql->execute()) {
    echo "Router transaction recorded.";
} else {
    echo "Error creating record: \n" . $conn->error;
}

$sql->close();
$conn->close();
?>