// Pure PHP test - No imports, no DB, no logic.
// This is to check if the server can execute basic PHP.
// Last updated: 2026-10-01 to test FTP deploy - MARKER

header('Content-Type: text/plain');

echo "PHP is working!\n";
echo "Server Time: " . date('Y-m-d H:i:s') . "\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Test line: MARKER\n";

// Try to create a directory
$dir = 'test_dir';
if (mkdir($dir, 0755, true)) {
    echo "Directory created: $dir\n";
} else {
    echo "Failed to create directory.\n";
}

// Try to write a file inside that directory
$file = $dir . '/test.txt';
if (file_put_contents($file, "test")) {
    echo "File written: $file\n";
} else {
    echo "Failed to write file.\n";
}
?>