<?php
// Probe temporario 3: cast de array para string (usado na versao que quebrava).
$a = array('x' => 1);
$v = (string) $a;
echo 'OK string_cast';
