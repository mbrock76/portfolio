<?php

//get the database connection
require('db_conn.php');

//get the json string passed with the request
$str_json = file_get_contents('php://input');
$obj = json_decode($str_json);

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