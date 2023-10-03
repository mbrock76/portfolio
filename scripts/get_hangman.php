<?php

if ($file = fopen("hangman.txt", "r")){
    while(!feof($file)) {
        $line = fgets($file);
         echo $line;
    }
    fclose($file);
}else{
	echo "Error reading file." . $conn->error;
}
?>