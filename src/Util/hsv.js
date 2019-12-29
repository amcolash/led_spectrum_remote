// ported from arduino code so that it is comsistent across platforms
export function rgbFromHsv(h, s, v) {
  // this is the algorithm to convert from RGB to HSV
  h = Math.floor((h * 192) / 256); // 0..191
  let i = Math.floor(h / 32); // We want a value of 0 thru 5
  let f = (h % 32) * 8; // 'fractional' part of 'i' 0..248 in jumps

  let sInv = 255 - s; // 0 -> 0xff, 0xff -> 0
  let fInv = 255 - f; // 0 -> 0xff, 0xff -> 0
  let pv = (v * sInv) / 256; // pv will be in range 0 - 255
  let qv = (v * (256 - (s * f) / 256)) / 256;
  let tv = (v * (256 - (s * fInv) / 256)) / 256;

  let rgb;
  switch (i) {
    case 0:
      rgb = [v, tv, pv];
      break;
    case 1:
      rgb = [qv, v, pv];
      break;
    case 2:
      rgb = [pv, v, tv];
      break;
    case 3:
      rgb = [pv, qv, v];
      break;
    case 4:
      rgb = [tv, pv, v];
      break;
    case 5:
    default:
      rgb = [v, pv, qv];
      break;
  }

  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
}
