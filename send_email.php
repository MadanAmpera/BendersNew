<?php

$name = htmlspecialchars($_POST['name']);
$email = htmlspecialchars($_POST['email']);
$contact = htmlspecialchars($_POST['mobile']);
$tourDate = htmlspecialchars($_POST['tourDate']);
$query = htmlspecialchars($_POST['query']);
$groupSize = htmlspecialchars($_POST['groupSize']);
$message = htmlspecialchars($_POST['message']);    

// Email to yourself
$to = "bendersbustour@gmail.com"; // Replace with your email address
$subject = "Benders Bus Tours";
$body = "Name: $name\nEmail ID: $email\nContact No.: $contact\nTour Requested date: $tourDate\nTour\Query Type: $query\nGroup Size: $groupSize\nMessage:\n$message";
    
// Email to the user
$user_subject = "Thank you for query - Benders Bus Tours";
$user_body = "Dear $name,\n\nThank you for your query.\n\nYou are very important to us, all the information received will always remain confidential. \nWe will contact you as soon as we review your message.\n\nIf you fail to receive a reply from us within a day please contact us via:\nEmail:bendersbustour@gmail.com\nPhone No: 0481313409\n\nRegards,\nBenders Bus Tours";
 
require "vendor/autoload.php";

//Sending email to Benders

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

$mailBenders = new PHPMailer(true);
$mailBenders->isSMTP();
$mailBenders->SMTPAuth = true;

$mailBenders->Host = "smtp.gmail.com";
$mailBenders->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mailBenders->Port = 587;

$mailBenders->Username = "bendersbustour@gmail.com";
$mailBenders->Password = "jyop lukl crqi aupy";

$mailBenders->setFrom("bendersbustour@gmail.com", "Benders Bus Tours");
$mailBenders->addAddress("bendersbustour@gmail.com", "Benders Bus Tours");

$mailBenders->Subject = $subject;
$mailBenders->Body = $body;

$mailBenders->send();

//Sending email to user

$mailUser = new PHPMailer(true);
$mailUser->isSMTP();
$mailUser->SMTPAuth = true;

$mailUser->Host = "smtp.gmail.com";
$mailUser->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mailUser->Port = 587;

$mailUser->Username = "bendersbustour@gmail.com";
$mailUser->Password = "jyop lukl crqi aupy";

$mailUser->setFrom("bendersbustour@gmail.com", "Benders Bus Tours");
$mailUser->addAddress($email);

$mailUser->Subject = $user_subject;
$mailUser->Body = $user_body;

$mailUser->send();

header("Location: sent.html");    

?>