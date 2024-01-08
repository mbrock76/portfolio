<?php

//get the database connection
require('db_conn.php');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM inventory ORDER BY id ASC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {

    while($row = $result->fetch_assoc()) {
		echo json_encode($row);
    }
} else {
	echo "0 results";
}

$conn->close();
?>