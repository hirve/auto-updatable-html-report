# auto-updatable-html-report
The tool for creating auto-updatable html report for tests, monitoring, etc.

## Use
```javascript
const HtmlReport = require('./HtmlReport');
const report = new HtmlReport('./report.html');
report.title('Some report');
report.text('Some description...');
report.img(400, 400, './img.jpg', 'Image title');
report.svg(400, 400, '<circle cx="200" cy="200" r="100" style="fill:red"/>', 'Svg title', { vx: 0, vy: 0, vw: 500, vh: 500 });
report.save();
```

The `report.html` file will request itself each 2 seconds and reload when changed.
