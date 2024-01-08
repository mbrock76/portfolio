<?php

//get the database connection
require('db_conn.php');

$sql = "SELECT * FROM chat";
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