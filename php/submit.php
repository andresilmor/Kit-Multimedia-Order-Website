<?php


// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader
require '../vendor/autoload.php';

// Instantiation and passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      // Enable verbose debug output
    $mail->isSMTP();                                            // Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                    // Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
    $mail->Username   = 'NEM2020.2021@gmail.com';                     // SMTP username
    $mail->Password   = /*[REDACTED]*/;                               // SMTP password
    $mail->SMTPSecure = 'tls';         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
    $mail->Port       = 587;                                    // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above
    $mail->CharSet = 'UTF-8';

    $mail->SMTPOptions = array(
        'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
        )
        );

    //Recipients
    $mail->setFrom('NEM2020.2021@gmail.com', 'Núcleo de Estudantes de Multimédia');
    $mail->addAddress($_POST["email"], $_POST["nome"]);     // Add a recipient

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Encomenda do Kit de Multimédia';

    //Produtos Ids
    $produtosArray = array( 
        'Impermeavel_Normal', 
        'Hoddie',
        'Impermeavel_Kanguru',
        'Sweatshirt',
        'Tshirt',
        'Calcas_Treino',
        'Gorro',
        'Porta_Chaves', 
        'Mascara'
    );

    ob_start();

    $encomenda = "<html><head><meta charset=\"UTF-8\"></head><body>";
    $encomenda .= "<h2>Dados da Pessoa:</h2>";

    $encomenda .= "<p>Nome: " . $_POST["nome"] .  "</p>";
    $encomenda .= "<p>Email: " . $_POST["email"] . "</p>";
    $encomenda .= "<p>Telem&oacute;vel: " . $_POST["telemovel"] . "</p>";
    $encomenda .= "<p>N&uacute;mero Mecanogr&aacute;fico: " . $_POST["numMec"] . "</p><hr>";

    $encomenda .= "<h3>Encomenda:</h3>";

    $precoTotal = 0;
    $totalPecas = 0;
        
    foreach ($produtosArray as $value) {
        if(!empty($_POST['checkbox_' . $value])) {
            $encomenda .= "<h4>> " . $_POST['nomeProduto_' . $value] . "</h4>";
            $encomenda .= "<p>Quantidade: " . $_POST['select_Quantidade_' . $value] . "</p>";
            if (!empty($_POST['select_Tamanho_' . $value])) {
                $encomenda .= "<p>Tamanho: " . $_POST['select_Tamanho_' . $value] . "</p>";
            }
            $encomenda .= "<p>Pre&ccedil;o: " . $_POST['precoUsado_' . $value] . "&euro;</p>";
            $totalPecas += $_POST['select_Quantidade_' . $value];
            $precoTotal += ($_POST['precoUsado_' . $value] * $_POST['select_Quantidade_' . $value]);
        }
    }

    
    if ($totalPecas <= 0) {
        header("location: /");
        return;
    }

    if($totalPecas >= 5) {
        $precoTotal += 5;
    }

    $encomenda .= "<hr><h4>Total Pe&ccedil;as: " . $totalPecas . "</h4>";
    $encomenda .= "<h4>Total: " . sprintf('%0.2f', $precoTotal) . "&euro;</h4>";
    $encomenda .= "</body></html>";
    
    $mail->Body    = $encomenda;
    $mail->AltBody = $encomenda;
    $mail->send();
    ob_end_clean( );
    exit(header("Location: ../feedback.html?result=success"));
    
} catch (Exception $e) {
    exit(header("Location: ../feedback.html?result=" . $mail->ErrorInfo));
}
?>