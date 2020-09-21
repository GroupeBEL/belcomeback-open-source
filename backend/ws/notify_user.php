<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require_once '../PHPMailer/src/Exception.php';
require_once '../PHPMailer/src/PHPMailer.php';
require_once '../PHPMailer/src/SMTP.php';
include('../inc/connect.php');
include('../inc/utils.php');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS , Content-Type, Accept');

// Instantiation and passing `true` enables exceptions
$mail = new PHPMailer(true);

try {

    $token 	    = getValueFromArray($_GET, 'token', '');  
    $user_id	= getValueFromArray($_GET, 'user_id', '0');
    $reg_id     = getValueFromArray($_GET, 'reg_id', '0'); 

    //Invalid token
    if (!token_is_valid($conn, $user_id, $token)) {
    	throw new Exception("User Unauthorized", 401);
    }
    $userData = getUserData($conn, $user_id, $reg_id);
    
    $body = '<p>Bel Come Back ' . $userData['firstname'] . ',</p>';
    $body .= '<p>Votre inscription pour le <strong>' . $userData['regDate'] . '</strong> est validée, et votre badge activé.</p>';
    $body .= '<p>Rappel de votre inscription:</p><ul>';
    if ($userData['leCreneau']) {
        $body .= '<li>Heure de passage à la cantine: <strong>' . $userData['leCreneau'] . '</strong></li>';
    }
    $body .= '<li>L\'emplacement pour le parking est libre.</li></ul>';
    $body .= '<p>Le groupe a mis en place de nouvelles règles sur site pour faire respecter les consignes sanitaires.</p>';
    $body .= '<p>Merci de respecter les consignes et heures de passage indiquées.</p>';
    $body .= '<p>A demain pour de nouvelles inscriptions</p>';

    $ical = generateEvent($userData['startEvent'], $userData['endEvent']);
    //we do not match this user id in DB
    if (!register_exists($conn, $user_id, $reg_id)) {
    	throw new Exception("Data not found", 404);
    }
    

    //Server settings
    $mail->SMTPDebug = 0;                                       // Enable verbose debug output
    $mail->isSMTP();                                            // Set mailer to use SMTP
    $mail->Host       = $YOUR_SMTP_HOST;  // Specify main and backup SMTP servers
    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
    $mail->Username   = $YOUR_SMTP_USERNAME;                     // SMTP username
    $mail->Password   = $YOUR_SMTP_PASSWORD;                               // SMTP password
    //$mail->SMTPSecure = 'tls';                                  // Enable TLS encryption, `ssl` also accepted
    $mail->Port       =  $YOUR_SMTP_PORT;                                    // TCP port to connect to

    //Recipients
    $mail->setFrom($YOUR_MAIL_SENDER, 'Belcome Back');
    //$mail->addAddress('ctlig-ext@groupe-bel.com', 'websites_push');     // Add a recipient
    $mail->addAddress($YOUR_MAIL_RECIPIENT, 'websites_push');     // Add a recipient
    /*$mail->addAddress('abenoistlucy@groupe-bel.com', 'Aurelien Benoist-lucy');     // Add a recipient
    $mail->addAddress('afrad_ext@groupe-bel.com', 'Ali FRAD');               // Name is optional*/
    //$mail->addAddress('ctlig-ext@groupe-bel.com');
    //$mail->addReplyTo('info@example.com', 'Information');
    //$mail->addCC('cc@example.com');
    //$mail->addBCC('bcc@example.com');

    // Attachments
    //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
    //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->CharSet = 'UTF-8';
    $mail->Subject = '[Bel Come Back] Inscription validée';
    $mail->addStringAttachment($ical,'ical.ics','base64','text/calendar');
    $mail->Body    = $body;
    //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();
    deleteUsedtoken($conn, $user_id, $token);

    //header('Content-Type: application/json');
    echo json_encode(['data' => 'OK', 'code' => 200]);
} catch (Exception $e) {
	$code = $e->getCode();
    error_log("Error ".$e);
    error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
    //header('Content-Type: application/json');
    //echo json_encode(['data' => 'KO', 'code' => $e->getCode()]);
    header("HTTP/1.1 ". $code. " KO");
}

die;