<?php

$servername = "";
$username = "";
$password = "";
$dbname = "";
$str_json = file_get_contents('php://input');
$obj = json_decode($str_json);

$obj->msg = filter_var($obj->msg, FILTER_SANITIZE_STRING);

$conn = new mysqli($servername, $username, $password, $dbname);
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = $conn->prepare("INSERT INTO chat (name, msg, timestamp) VALUES (?,?,?)");
$sql->bind_param("sss", $obj->name, $obj->msg, $obj->timestamp);

if ($sql->execute()) {
    echo "Message recorded.";
} else {
    echo "error.".$conn->error;
}

$sql->close();
$conn->close();
?>