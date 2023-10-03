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