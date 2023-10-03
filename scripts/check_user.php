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

$sql = $conn->prepare("SELECT * FROM users WHERE name =?");
$sql->bind_param("s", $obj->name);
$sql->execute();
$result = $sql->get_result();

if ($result->num_rows > 0) {

	$myUser = $result->fetch_assoc();
	
	if(password_verify($obj->pwd, $myUser["pwd"])){
		
		echo json_encode($myUser);
		
	} else {
		
		echo "wrong password";
	}
} else {
	
	echo "not found";
}

$sql->close();
$conn->close();
?>