const fs = require('fs');
const path = require('path');

const framesDir = path.join('public', 'assets', 'frames');
if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
}

for (let i = 2; i <= 50; i++) {
  const filePath = path.join(framesDir, `${i}.png`);
  // Write a 1x1 transparent PNG
  const pngBuffer = Buffer.from([
    137, 80, 78, 71, 13, 10, 26, 10,                          // PNG signature
    0, 0, 0, 13, 'IHDR',                                      // IHDR chunk
    0, 0, 0, 1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 0, 0, 137, 80, 78, 71, 13, 10, 26, 10, // IHDR + CRC + signature end
    0, 0, 0, 'IDAT', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 73, 68, 65, 84, 120, 88, 95, 110, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 80, 78, 71, 13, 10, 26, 10  // IDAT end + signature
  ]);
  fs.writeFileSync(filePath, pngBuffer);
  console.log(`Created ${i}.png`);
}

console.log('Done creating placeholder PNGs');