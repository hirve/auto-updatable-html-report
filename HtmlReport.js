const fs = require('fs');

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
              padding: 10px;
            }
            p, div, img, svg, h3, h4 {
              padding: 5px;
              margin: 5px;
            }
            img, svg {
              border: 1px solid #eee;
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

module.exports = HtmlReport;
