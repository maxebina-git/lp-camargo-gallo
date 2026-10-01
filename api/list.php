<?php
header('Content-Type: text/plain');
$dir = '.';
$files = scandir($dir);
echo "Files in " . realpath($dir) . ":\n";
foreach ($files as $file) {
    if ($file != '.' && $file != '..') {
        echo "- $file\n";
    }
}
?>