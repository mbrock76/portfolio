<?php

//get the database connection
require('db_conn.php');

$str_json = file_get_contents('php://input');
$obj = json_decode($str_json);

$obj->name = filter_var($obj->name, FILTER_SANITIZE_STRING);
$obj->pwd = password_hash($obj->pwd, PASSWORD_DEFAULT);

$sql = $conn->prepare("INSERT INTO users (name, pwd) VALUES (?,?)");
$sql->bind_param("ss", $obj->name, $obj->pwd);

if ($sql->execute()) {
    echo "New user created.";
} else {
    echo "That username is already taken.";
}

$sql->close();
$conn->close();
?>