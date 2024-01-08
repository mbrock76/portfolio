<?php

// get the database connection
require('db_conn.php');

// get the JSON string passed with the request
$str_json = file_get_contents('php://input');
$obj = json_decode($str_json);

// check if the 'tableName' property exists in the JSON object
if (isset($obj->tableName)) {
    
    // use prepared statements to prevent SQL injection
    $tableName = $obj->tableName;
    $sql = "SELECT * FROM $tableName";
    $result = $conn->query($sql);

    if ($result) {
        // fetch all rows into an associative array
        $rows = $result->fetch_all(MYSQLI_ASSOC);

        // encode the array as JSON and echo it
        echo json_encode($rows);
    } else {
        // handle the case where the query fails
        echo "Error executing query: " . $conn->error;
    }
} else {
    // handle the case where 'tableName' is not provided in the JSON object
    echo "Error: 'tableName' not provided in the JSON object.";
}

// close the database connection
$conn->close();

?>
