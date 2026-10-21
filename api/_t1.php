<?php
// Probe temporario 1: isset() com operador ?? (usado na versao que quebrava).
$a = array('x' => 1);
$v = isset($a['x'] ?? '');
echo 'OK isset_coalesce';
