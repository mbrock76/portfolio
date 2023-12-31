<?php

//get the database connection
require('db_conn.php');

$str_json = file_get_contents('php://input');
$obj = json_decode($str_json);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = $conn->prepare("UPDATE users SET hangman =?, ttt =?, bird =?, hat =? WHERE id =?");
$sql->bind_param("iiiii", $obj->hangman, $obj->ttt, $obj->bird, $obj->hat, $obj->id);

if ($sql->execute()) {
  echo "Users updated.";
} else {
  echo "Error updating record: " . $conn->error;
}

$sql->close();
$conn->close();
?>