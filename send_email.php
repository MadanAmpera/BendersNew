<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);
    
    // Email to yourself
    $to = "your-email@example.com"; // Replace with your email address
    $subject = "New Contact Form Submission";
    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
    $headers = "From: $email";
    
    // Email to the user
    $user_subject = "Thank you for contacting us!";
    $user_body = "Hi $name,\n\nThank you for reaching out. We have received your message and will get back to you shortly.\n\nBest regards,\nYour Company Name";
    $user_headers = "From: your-email@example.com"; // Replace with your email address
    
    // Send emails
    $mail_sent = mail($to, $subject, $body, $headers);
    $user_mail_sent = mail($email, $user_subject, $user_body, $user_headers);
    
    if ($mail_sent && $user_mail_sent) {
        echo "Emails successfully sent!";
    } else {
        echo "Failed to send emails.";
    }
}
?>