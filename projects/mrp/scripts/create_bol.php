<?php

$str_json = file_get_contents('php://input');
$obj = json_decode($str_json);

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$myfile = fopen("bol.txt", "w") or die("Unable to open file!");
$txt = "John Doe\n";
fwrite($myfile, $txt);
$txt = "Jane Doe\n";
fwrite($myfile, $txt);
fclose($myfile);
?>