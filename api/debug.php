<?php
// Pure PHP test - No imports, no DB, no logic.
// This is to check if the server can execute basic PHP.
// Last updated: 2026-10-01 to test FTP deploy

header('Content-Type: text/plain');

echo "PHP is working!\n";
echo "Server Time: " . date('Y-m-d H:i:s') . "\n";
echo "PHP Version: " . phpversion() . "\n";
?>
