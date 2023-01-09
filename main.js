const request = require("request");
const { JSDOM } = require("jsdom");
const diff = require("diff");
const fs = require("fs");

request("https://www.alamy.com/", (error, response, html) => {
  console.log(typeof html);

  const dom = new JSDOM(html);

  const renderedHtml = dom.serialize();
  const rawHtml = html;

  const diffLines = diff.diffLines(rawHtml, renderedHtml);

  fs.writeFileSync(
    "output.html",
    `<html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          word-wrap: break-word;
        }
        td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
          inline-size: 150px;
          word-break: break-all;
        }
        .added {
          background-color: #ddffdd;
          word-break: break-all;
        }
        .removed {
          background-color: #ffdddd;
          word-break: break-all;
        }

      </style>
    </head>
    <body>
      <table>
        <tr>
          <th class="num-raw" style="width: 50px">#</th>
          <th>Raw HTML</th>
          <th>Rendered HTML</th>
        </tr>
    `
  );

  let i = 0;
  diffLines.forEach((line) => {
    let rawOutput = line.value;
    let renderedOutput = line.value;
    let rowClass = "";
    if (line.added) {
      rawOutput = "";
      renderedOutput = `<span class="added">+ ${line.value
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</span>`;
      rowClass = "added";
    } else if (line.removed) {
      rawOutput = `<span class="removed">- ${line.value
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}
</span>`;
      renderedOutput = "";
      rowClass = "removed";
    }
    fs.appendFileSync(
      "output.html",
      `<tr class="${rowClass}">
        <td style="width: 50px">${i}</td>
        <td >${rawOutput.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
        <td>${renderedOutput.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
      </tr>`
    );
    i++;
  });

  fs.appendFileSync(
    "output.html",
    `<div>
  <button id="show-all">Show All</button>
  <button id="show-diff">Show Diff</button>
</div>

    </table>
    </body>
    <script>
  document.getElementById("show-all").addEventListener("click", function () {
    const rows = document.querySelectorAll("tr");
    rows.forEach((row) => (row.style.display = "table-row"));
  });

  document.getElementById("show-diff").addEventListener("click", function () {
    const rows = document.querySelectorAll("tr");
    rows.forEach((row) => {
      if (row.classList.contains("added") || row.classList.contains("removed")) {
        row.style.display = "table-row";
      } else {
        row.style.display = "none";
      }
    });
  });

  </script>

    </html>`
  );
});
