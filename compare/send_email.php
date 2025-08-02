<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $recaptcha_secret = '6LdqDp4qAAAAAGmGZ7dO3leJ35DE7dfOHKlb9uW1';
    $recaptcha_response = $_POST['g-recaptcha-response'];
    $spam_check = htmlspecialchars($_POST['reason-booking']);

    //check if spam using honeypot fields

    if(!empty($spam_check)){
        header("Location: sent.html");
    }
    else{
        //checking the captcha
        $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$recaptcha_secret&response=$recaptcha_response");
        $response_keys = json_decode($response, true);
    
        if (intval($response_keys["success"]) !== 1) {
            header("Location: contact-us.html?captcha=fail");
        }
        else{
            //proceed to send emails
            
            if (isset($_POST['form_token'])) {
                $token = base64_decode($_POST['form_token']);
                $submittedTime = (int)$token;
                $currentTime = time() * 1000; // milliseconds

                $timeDiff = $currentTime - $submittedTime;

                if ($timeDiff < 3000) {
                    die("Something went wrong.");
                }

                if ($timeDiff > 15 * 60 * 1000) {
                    die("Form expired. Please reload and try again.");
                }

                //logging IP address and time of submission
                //ignore request if it is from the same IP within 60 seconds
                $ip = $_SERVER['REMOTE_ADDR'];
                $time = time();
                $logFile = 'form_submissions.log';

                $entries = file_exists($logFile) ? file($logFile) : [];
                $entries = array_filter($entries, function($line) use ($time) {
                    list($entryTime) = explode('|', $line);
                    return ($time - (int)$entryTime) < 60; // Keep entries from the last 60 seconds
                });

                file_put_contents($logFile, implode('', $entries)); // Clean old entries

                $recentSubmissions = array_filter($entries, function($line) use ($ip) {
                    return strpos($line, $ip) !== false;
                });

                if (count($recentSubmissions) > 3) {
                    die("Too many submissions. Please wait a moment.");
                }

                file_put_contents($logFile, "$time|$ip\n", FILE_APPEND);


                $name = htmlspecialchars($_POST['name']);
                $email = htmlspecialchars($_POST['email']);
                $contact = htmlspecialchars($_POST['mobile']);
                $tourDate = htmlspecialchars($_POST['tourDate']);
                $query = isset($_POST['query']) ? $_POST['query'] : [];
                $query_imploded = implode(",", $query);
                $groupSize = htmlspecialchars($_POST['groupSize']);
                $message = htmlspecialchars($_POST['message']);    


                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    die("Invalid email address.");
                }

                // Optional: block disposable email domains
                $disposableDomains = ['mailinator.com', '10minutemail.com', 'tempmail.com'];
                $emailDomain = substr(strrchr($email, "@"), 1);
                if (in_array($emailDomain, $disposableDomains)) {
                    die("Disposable email addresses are not allowed.");
                }

                
                if (preg_match('/(https?:\/\/|www\.|\.\w{2,})/i', $message)) {
                    die("Something went wrong.");
                }

                $subject = "Benders Bus Tours";
                $body = <<<EOD
                Name: $name
                Email ID: $email
                Contact No.: $contact
                Tour Requested date: $tourDate
                Tour\Query Type: $query_imploded
                Group Size: $groupSize
                Message:
                $message
                EOD;

                $benders_headers = "From: info@bendersbustours.com.au";

                // Email to Benders
                if(mail("bendersbustour@gmail.com", $subject, $body, $benders_headers)) {
                    //Sending email to user
                    $user_subject = "Thank you for query - Benders Bus Tours";
                    $user_body = <<<EOD
                    Dear $name,

                    Thank you for your query.
                    You are very important to us, all the information received will always remain confidential. We will contact you as soon as we review your message.

                    If you fail to receive a reply from us within a day please contact us via:
                    Email: bendersbustour@gmail.com
                    Phone No: 0481313409

                    Regards,
                    Benders Bus Tours
                    EOD;

                    $user_headers = "From: info@bendersbustours.com.au";

                    mail($email, $user_subject, $user_body, $user_headers);

                    header("Location: sent.html");
                    
                }
            }else{
                die("Missing form token");
            }
            
        }
    }
    exit();
}
?>