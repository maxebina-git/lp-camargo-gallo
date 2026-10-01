<?php
// Test write permissions
$file = 'test_write.txt';
$content = "Test at " . date('Y-m-d H:i:s') . "\n";
if (file_put_contents($file, $content)) {
    echo "File written successfully.\n";
} else {
    echo "Failed to write file.\n";
}
?>