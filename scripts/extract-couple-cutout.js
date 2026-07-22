const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const input = path.join(root, 'public', 'assets', 'new.jpeg');
const output = path.join(root, 'public', 'assets', 'couple-cutout.png');

const smoothstep = (edge0, edge1, x) => {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

const insidePolygon = (x, y, points) => {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i][0];
    const yi = points[i][1];
    const xj = points[j][0];
    const yj = points[j][1];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
};

const addPolygon = (mask, width, height, points, amount = 1) => {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.max(0, Math.floor(Math.min(...xs)));
  const maxX = Math.min(width - 1, Math.ceil(Math.max(...xs)));
  const minY = Math.max(0, Math.floor(Math.min(...ys)));
  const maxY = Math.min(height - 1, Math.ceil(Math.max(...ys)));

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      if (insidePolygon(x, y, points)) {
        const idx = y * width + x;
        mask[idx] = Math.max(mask[idx], amount);
      }
    }
  }
};

const addEllipse = (mask, width, height, cx, cy, rx, ry, feather = 0.12, amount = 1) => {
  const minX = Math.max(0, Math.floor(cx - rx * (1 + feather)));
  const maxX = Math.min(width - 1, Math.ceil(cx + rx * (1 + feather)));
  const minY = Math.max(0, Math.floor(cy - ry * (1 + feather)));
  const maxY = Math.min(height - 1, Math.ceil(cy + ry * (1 + feather)));

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d <= 1 + feather) {
        const edge = 1 - smoothstep(1, 1 + feather, d);
        const idx = y * width + x;
        mask[idx] = Math.max(mask[idx], edge * amount);
      }
    }
  }
};

const buildCutout = async () => {
  if (!fs.existsSync(input)) {
    throw new Error(`Missing source image: ${input}`);
  }

  const { data, info } = await sharp(input)
    .rotate()
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const mask = new Float32Array(width * height);
  const core = new Float32Array(width * height);

  const groomBody = [
    [178, 420], [482, 420], [582, 470], [575, 735],
    [665, 775], [635, 938], [538, 918], [510, 1122], [450, 1195],
    [448, 1600], [0, 1600], [0, 525], [178, 426],
  ];
  const brideBody = [
    [560, 426], [712, 456], [774, 626], [805, 930], [762, 1080],
    [842, 1600], [370, 1600], [358, 1055], [300, 950], [328, 802],
    [420, 798], [432, 674], [500, 570],
  ];
  const brideArm = [
    [330, 752], [458, 780], [622, 955], [602, 1068], [365, 980], [302, 900],
  ];
  const groomLeftArm = [
    [0, 830], [112, 838], [118, 1370], [18, 1428], [0, 1388],
  ];
  const groomTorsoCore = [
    [188, 420], [505, 440], [548, 1110], [420, 1220], [40, 1050], [0, 560],
  ];
  const brideCore = [
    [488, 540], [728, 620], [760, 1075], [805, 1600], [392, 1600],
    [390, 1045], [326, 930], [426, 790],
  ];

  addPolygon(mask, width, height, groomBody, 1);
  addPolygon(mask, width, height, brideBody, 1);
  addPolygon(mask, width, height, brideArm, 1);
  addPolygon(mask, width, height, groomLeftArm, 1);
  addPolygon(core, width, height, groomTorsoCore, 1);
  addPolygon(core, width, height, brideCore, 1);

  addEllipse(mask, width, height, 335, 354, 126, 148, 0.14, 1);
  addEllipse(mask, width, height, 333, 480, 118, 78, 0.12, 1);
  addEllipse(mask, width, height, 596, 552, 132, 150, 0.14, 1);
  addEllipse(mask, width, height, 675, 748, 86, 282, 0.14, 1);
  addEllipse(core, width, height, 335, 350, 102, 126, 0.06, 1);
  addEllipse(core, width, height, 596, 552, 104, 124, 0.06, 1);
  addEllipse(core, width, height, 335, 304, 104, 72, 0.06, 1);
  addEllipse(core, width, height, 676, 740, 78, 246, 0.06, 1);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = y * width + x;
      if (mask[idx] <= 0) continue;

      const r = data[idx * 3];
      const g = data[idx * 3 + 1];
      const b = data[idx * 3 + 2];
      const brightness = (r + g + b) / 3;
      const skin = r > 112 && g > 54 && b < 112 && r > g + 18;
      const warmCloth = r > 82 && g > 24 && b < 78 && r > g + 16;
      const lightPants = x < 468 && y > 1020 && brightness > 104 && r > 108 && g > 103;
      const darkGarment = core[idx] > 0 && brightness < 72 && !(b > r + 18 && b > g + 8);
      const hairOrBeard = core[idx] > 0 && brightness < 84;
      const originalSubjectPixel = skin || warmCloth || lightPants || darkGarment || hairOrBeard;
      const backgroundBlue = r < 72 && g < 82 && b < 105 && b > r + 7 && b > g - 2;
      const cityLight = y > 650 && brightness > 95 && b > 65 && x > 680;
      const darkLowDetailBackground =
        brightness < 62 &&
        Math.abs(r - g) < 24 &&
        Math.abs(g - b) < 24 &&
        core[idx] <= 0;

      if (!originalSubjectPixel && (backgroundBlue || cityLight || darkLowDetailBackground)) {
        mask[idx] = 0;
      }
    }
  }

  const alphaSource = Buffer.alloc(width * height);
  for (let i = 0; i < mask.length; i += 1) {
    alphaSource[i] = Math.round(Math.max(0, Math.min(1, mask[i])) * 255);
  }

  const alphaResult = await sharp(alphaSource, { raw: { width, height, channels: 1 } })
    .blur(1.6)
    .linear(1.22, -18)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const alpha = alphaResult.data;
  const alphaChannels = alphaResult.info.channels;

  const samples = [[335, 354], [335, 500], [595, 552], [300, 650]];
  console.log(samples.map(([x, y]) => {
    const idx = y * width + x;
    return {
      x,
      y,
      mask: Number(mask[idx].toFixed(3)),
      alphaSource: alphaSource[idx],
      alpha: alpha[idx * alphaChannels],
      alphaChannels,
    };
  }));

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = y * width + x;
      if (alpha[idx * alphaChannels] > 12) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const pad = 18;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  const cropWidth = maxX - minX + 1;
  const cropHeight = maxY - minY + 1;
  const rgba = Buffer.alloc(cropWidth * cropHeight * 4);

  for (let y = 0; y < cropHeight; y += 1) {
    for (let x = 0; x < cropWidth; x += 1) {
      const srcX = minX + x;
      const srcY = minY + y;
      const srcIdx = srcY * width + srcX;
      const rgbIdx = srcIdx * 3;
      const outIdx = (y * cropWidth + x) * 4;
      rgba[outIdx] = data[rgbIdx];
      rgba[outIdx + 1] = data[rgbIdx + 1];
      rgba[outIdx + 2] = data[rgbIdx + 2];
      rgba[outIdx + 3] = alpha[srcIdx * alphaChannels];
    }
  }

  const composed = await sharp(rgba, { raw: { width: cropWidth, height: cropHeight, channels: 4 } })
    .sharpen({ sigma: 0.7, m1: 0.45, m2: 0.22 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  await fs.promises.writeFile(output, composed);
  console.log(JSON.stringify({ output, width: cropWidth, height: cropHeight, crop: { minX, minY, maxX, maxY } }, null, 2));
};

buildCutout().catch((error) => {
  console.error(error);
  process.exit(1);
});
