$framesDir = "public/assets/frames"
if (-not (Test-Path $framesDir)) { New-Item -ItemType Directory -Path $framesDir | Out-Null }

for ($i = 2; $i -le 50; $i++) {
    $filename = Join-Path $framesDir "$i.png"
    # Create a minimal valid 1x1 transparent PNG
    $png = @"
    \x89PNG\r\n\x1a\n
    \x00\x00\x00\x0dIHDR
    \x00\x00\x00\x01
    \x00\x00\x00\x01
    \x08\x02\x00\x00\x00
    \x00\x00\x00\x0f
    \x0f\x0f\x0f\xc0
    \x00\x00\x00\x01tEXt
    "compress"
    "@@
    # Actually let's just write a simpler raw PNG bypassing complexity
    $bytes = New-Object byte[] 1
    [System.IO.File]::WriteAllBytes($filename, $bytes)
    Write-Host "Created $filename"
}
Write-Host "Done creating $($framesDir) folder with placeholders"