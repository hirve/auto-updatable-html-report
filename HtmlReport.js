const fs = require('fs');

const toSvg = (shape) => `<${shape.type} ${
  Object.keys(shape).filter(key => key !== 'type')
    .filter(key => key !== 'text')
    .map(key => `${key}="${shape[key]}"`).join(' ')
}>
  ${shape.type === 'text' ? shape.text : ''}
  ${shape.title ? '<title>' + shape.title + '</title>' : ''}
</${shape.type}>`;

const toSvgPath = (color = 'darkcyan', d = 0.1) => (section) => ({
  type: 'path',
  d: 'M' + section.map(point => ' ' + point.x + ',' + point.y).join(' '),
  style: 'stroke:' + color + ';stroke-width:' + d + ';fill:none;opacity:0.7',
});
const toSvgPoint = (color, d = 0.1, title) => (point) => ({
  type: 'circle',
  cx: point.x, cy: point.y, r: d / 2,
  style: 'stroke:none;fill:' + color + ';opacity:0.5',
  title: title || point.title,
});
const toSvgText = (color, font = 2, text) => (point) => ({
  type: 'text',
  'font-size': font,
  x: point.x, y: point.y,
  style: 'stroke:none;fill:' + color + ';opacity:0.5',
  text: text || point.text,
});
const toSvgLine = (color, d = 0.05, r = 0.05) => (line) => ({
  type: 'line',
  x1: line[0].x, y1: line[0].y, x2: line[1].x, y2: line[1].y,
  style: 'stroke:' + color + ';stroke-width:' + d + ';fill:none;opacity:0.4',
});

class HtmlReport {
  constructor (reportFilePath) {
    this.reportFilePath = reportFilePath;
    this.hash = Date.now();
    this.src = `<!DOCTYPE html>
      <html>
        <head>
          <style>
            * {
              padding: 0;
              margin: 0;
              font-family: monospace;
              box-sizing: border-box;
            }
            body {
              padding: 3px;
            }
            p, div, img, svg, h3, h4 {
              padding: 3px 0;
              margin: 3px;
            }
            img, svg {
              border: 1px solid #eee;
            }
            svg {
              transform: scaleY(-1);
            }
          </style>
        </head>
        <body>
          <!--cursor/-->
          <script>
            setInterval(() => {
              fetch(window.location.href)
                .then((response) => {
                  response.text()
                    .then((text) => {
                      if (!text.includes(${this.hash})) {
                        window.location.href += '';
                      }
                    });
                });
            }, 2000);
          </script>
        </body>
      </html>`;
  }
  title (contents) {
    this.add(`<h3>${contents}</h3>`);
  }
  text (contents) {
    this.add(`<p>${contents}</p>`);
  }
  img (w, h, contents, title = 'Image') {
    w = w || '';
    h = h || '';
    this.add(`
      <h4>${title}</h4>
      <img width="${w}" height="${h}" src="${contents}"/>
    `);
  }
  svg (w, h, contents, title = 'Svg', { vx, vy, vw, vh } = { vx: '', vy: '', vw: '', vh: '' }) {
    if (typeof (contents) === 'object') {
      if (Array.isArray(contents)) {
        contents = contents.map(toSvg).join('\n');
      } else {
        contents = toSvg(contents) + '\n';
      }
    }
    this.add(`
      <h4>${title}</h4>
      <svg width="${w}" height="${h}"
        viewBox="${vx} ${vy} ${vw} ${vh}">
        ${contents}
      </svg>
    `);
  }
  add (contents) {
    this.src = this.src.replace('<!--cursor/-->', `
      ${contents}
      <!--cursor/-->
    `);
  }
  save () {
    fs.writeFileSync(this.reportFilePath, this.src.replace('<!--cursor/-->', `<!--hash=${this.hash}-->`));
  }
  createColumnsFile (columns, columnsFilePath) {
    fs.writeFileSync(columnsFilePath, `<!DOCTYPE html>
      <html>
        <head>
          <style>
            * {
              padding: 0;
              margin: 0;
              font-family: monospace;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
        ` + columns.map((columnFilePath, i) => `
          <iframe
            frameborder="0"
            style="position: fixed; top: 0; height: 100%; left: ${100 / columns.length * i}%; width: ${100 / columns.length}%"
            src="${columnFilePath}"
          ></iframe>
        `).join('\n') + `
        </body>
      </html>
    `);
  }
}

module.exports = { HtmlReport, toSvgPath, toSvgPoint, toSvgText, toSvgLine };
