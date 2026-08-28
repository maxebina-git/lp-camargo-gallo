const fs = require('fs');
const path = require('path');

const framesDir = path.join('public', 'assets', 'frames');
if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
}

for (let i = 2; i <= 50; i++) {
  const filePath = path.join(framesDir, `${i}.png`);
  // Write a minimal valid PNG (1x1 transparent)
  const pngData = Buffer.from([
    137, 80, 78, 71, 13, 10, 26, 10, // PNG signature
    0, 0, 0, 13, // IHDR chunk length
    73, 72, 68, 82, // IHDR chunk type
    0, 0, 0, 1, // width
    0, 0, 0, 1, // height
    8, 2, 0, 0, 0, // bit depth, color type, compression, filter, interlace
    0, 0, 0, 0, // IHDR checksum (simplified - real one needs proper CRC)
    0, 0, 0, 0,
    137, 80, 78, 71, 13, 10, 26, 10 // PNG signature end
  ]);
  fs.writeFileSync(filePath, pngData);
  console.log(`Created ${filePath}`);
}

console.log('Done creating 49 frame placeholder PNGs (2-50).');