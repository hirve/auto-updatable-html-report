:warning: The organized criminal group has occupied Russia and now is destroying my peaceful city. I was walking down the street when a rocket landed next to me. Some time ago it was simply unbelievable, now the destruction of my city and the killing of civilians is my reality.

If you are a responsible citizen of Russia, you are personally guilty of this. Stop it. If you are an irresponsible resident of Russia, just ignore this message.

# auto-updatable-html-report
The tool for creating auto-updatable html report for tests, monitoring, etc.

## Basic usage
```javascript
const { HtmlReport } = require('./HtmlReport');

const report = new HtmlReport('./report.html');

report.title('Some report');
report.text('Some description...');
report.img(400, 400, './img.jpg', 'Image title');
report.svg(400, 400, '<circle cx="200" cy="200" r="100" style="fill:red"/>', 'Svg title', { vx: 0, vy: 0, vw: 500, vh: 500 });

report.save();
```

## Extended SVG usage
```javascript
const { HtmlReport, toSvgPath, toSvgPoint, toSvgText, toSvgLine } = require('./HtmlReport');

const report = new HtmlReport('./report.html');
const points = [
  { x: 100, y: 500 },
  { x: 200, y: 300 },
];

report.svg(400, 400, [
  ...points.map(toSvgPoint('gray', 1)),
], 'Svg title', { vx: 0, vy: 0, vw: 500, vh: 500 });

report.save();
```

The `report.html` file will request itself each 2 seconds and reload when changed.
