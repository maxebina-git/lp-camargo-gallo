<?php
// Pure PHP test - No imports, no DB, no logic.
// This is to check if the server can execute basic PHP.

header('Content-Type: text/plain');

echo "PHP is working!\n";
echo "Server Time: " . date('Y-m-d H:i:s') . "\n";
echo "PHP Version: " . phpversion() . "\n";
?>
