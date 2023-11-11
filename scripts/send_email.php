<?php

// Get the JSON data from the HTTP POST request
$json_data = file_get_contents('php://input');

// Decode the JSON data
$data = json_decode($json_data);

// Check if the JSON decoding was successful
if ($data !== null) {
    // Extract data from the JSON
    $sender_email = $data->sender_email;
    $subject = $data->subject;
    $message_body = $data->message_body;

    // Validate email address
    if (filter_var($sender_email, FILTER_VALIDATE_EMAIL)) {
        // Set up the email parameters
        $to = ''; // <-- add your email here
        $headers = 'From: ' . $sender_email . "\r\n" .
                   'Reply-To: ' . $sender_email . "\r\n" .
                   'X-Mailer: PHP/' . phpversion();

        // Send the email
        $success = mail($to, $subject, $message_body, $headers);

        if ($success) {
            echo 'Email sent successfully.';
        } else {
            echo 'Error sending email.';
        }
    } else {
        echo 'Invalid sender email address.';
    }
} else {
    echo 'Invalid JSON data.';
}

?>
