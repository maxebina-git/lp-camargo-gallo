<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /lp-camargo-gallo/');
    exit;
}

$nome     = isset($_POST['nome']) ? trim($_POST['nome']) : '';
$whats    = isset($_POST['whatsapp']) ? trim($_POST['whatsapp']) : '';
$email    = isset($_POST['email']) ? trim($_POST['email']) : '';
$mensagem = isset($_POST['mensagem']) ? trim($_POST['mensagem']) : '';

if ($nome === '' || $whats === '' || $email === '' || $mensagem === '') {
    echo 'Todos os campos são obrigatórios.';
    exit;
}

$to      = 'maxebina@gmail.com';
$subject = 'Novo contato da landing page';
$body    = "Nome: $nome\nWhatsApp: $whats\nEmail: $email\nMensagem:\n$mensagem\n";
$headers = "From: atendimento@camargogallo.com.br\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) {
    header('Location: /lp-camargo-gallo/#contato');
    exit;
} else {
    echo 'Erro ao enviar. Tente novamente.';
}
