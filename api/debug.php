// Pure PHP test - No imports, no DB, no logic.
// This is to check if the server can execute basic PHP.
// Last updated: 2026-10-01 to test FTP deploy - MARKER

header('Content-Type: text/plain');

echo "PHP is working!\n";
echo "Server Time: " . date('Y-m-d H:i:s') . "\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Test line: MARKER\n";

// Try to write a file
$testFile = 'test_via_php.txt';
$result = file_put_contents($testFile, "Written at " . date('Y-m-d H:i:s') . "\n");
if ($result !== false) {
    echo "File written: $testFile\n";
} else {
    echo "Failed to write file.\n";
}
?>