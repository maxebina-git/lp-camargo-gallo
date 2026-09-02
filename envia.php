<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /lp-camargo-gallo/');
    exit;
}

require_once('class.phpmailer.php');

$nome     = isset($_POST['nome']) ? trim($_POST['nome']) : '';
$whats    = isset($_POST['whatsapp']) ? trim($_POST['whatsapp']) : '';
$email    = isset($_POST['email']) ? trim($_POST['email']) : '';
$mensagem = isset($_POST['mensagem']) ? trim($_POST['mensagem']) : '';

if ($nome === '' || $whats === '' || $email === '' || $mensagem === '') {
    echo 'Todos os campos são obrigatórios.';
    exit;
}

$mailer = new PHPMailer();
$mailer->IsSMTP();
$mailer->SMTPDebug = 1; // teste
$mailer->Port = 587;
$mailer->Host = 'smtplw.com.br'; // Locaweb SMTP — trocar se usar outro
$mailer->SMTPAuth = true;
$mailer->Username = 'atendimento@camargogallo.com.br'; // preencher credencial real
$mailer->Password = 'COLOQUE_AQUI'; // preencher senha do SMTP
$mailer->FromName = 'Camargo Gallo';
$mailer->From = 'atendimento@camargogallo.com.br';
$mailer->AddAddress('maxebina@gmail.com', 'Max');
$mailer->Subject = 'Novo contato da landing page';
$mailer->Body = "Nome: $nome\nWhatsApp: $whats\nEmail: $email\nMensagem:\n$mensagem\n";
$mailer->IsHTML(false);

if (!$mailer->Send()) {
    echo "Erro: " . $mailer->ErrorInfo;
    exit;
}

header('Location: /lp-camargo-gallo/#contato');
exit;
