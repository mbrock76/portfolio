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

$sql = $conn->prepare("UPDATE bols SET sors =?, step =? WHERE id =?");
$sql->bind_param("ssi", $obj->sors, $obj->step, $obj->id);

if ($sql->execute()) {
  echo "Bol updated.";
} else {
  echo "Error updating record: " . $conn->error;
}

$sql->close();
$conn->close();
?>