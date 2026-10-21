<?php
// Probe temporario 2: encadeamento de ?? (usado na versao que quebrava).
$a = array('x' => 1);
$v = $a['x'] ?? $a[0] ?? '';
echo 'OK chain_coalesce';
