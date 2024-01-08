<?php
//don't remember the purpose of this, zero's out all inventory locations

//get the database connection
require('db_conn.php');


$ltr = ["A", "B", "C", "D", "E", "F"];
$num = ["1", "2", "3", "4", "5", "6"];

for ($i = 0; $i < 6; $i++) {
    for ($j = 0; $j < 6; $j++) {
        for ($k = 0; $k < 6; $k++) {
            for ($l = 1; $l < 6; $l++) {
                $loc = $ltr[$i] . $num[$j] . $ltr[$k];
                $partID = $l;
                $qty = 0;
                popinv($loc, $partID, $qty, $conn);
            }
        }
    }
}

function popinv($loc, $partID, $qty, $conn)
{
    $sql = "INSERT INTO inventory (loc, partID, qty) VALUES ('$loc', $partID, $qty)";

    if (mysqli_query($conn, $sql)) {
        // echo "created";
    } else {
        // echo "error: " . $conn->error;
    }
}

$conn->close();

?>
