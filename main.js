const request = require("request");
const { JSDOM } = require("jsdom");
const diff = require("diff");
const fs = require("fs");

request("https://www.alamy.com/", (error, response, html) => {
  const dom = new JSDOM(html);

  const renderedHtml = dom.serialize();
  const rawHtml = html;

  // Split the raw and rendered HTML into arrays of individual tags
  const rawHtmlTags = rawHtml;
  const renderedHtmlTags = renderedHtml;

  const diffLines = diff.diffArrays(rawHtmlTags, renderedHtmlTags);

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
#next {
  position: fixed;
  bottom: 0;
  left: 40px;
  font-size: xx-large;
  user-select: none;
}
#prev {
  position: fixed;
  bottom: 0;
  left: 110px;
  font-size: xx-large;
  user-select: none;
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
    <div>
  <div id="prev">⬆️</div>
  <div id="next">⬇️</div>
</div>

    <script>

  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const rows = document.querySelectorAll("tr");

  // Set the current row to null initially
  let currentRow = null;

  // Add click event listener for the prev button
  prevButton.addEventListener("click", function () {
    // If the current row is not set, set it to the first row
    if (!currentRow) {
      currentRow = rows[0];
      currentRow.style.backgroundColor = "yellow";
      currentRow.scrollIntoView();
      return;
    }

    // If the current row is the first row, do nothing
    if (currentRow === rows[0]) {
      return;
    }

    // Otherwise, set the current row to the previous row and scroll to it
    currentRow.style.backgroundColor = "white";
    currentRow = currentRow.previousElementSibling;
    currentRow.style.backgroundColor = "yellow";
    currentRow.scrollIntoView();
  });

  // Add click event listener for the next button
  nextButton.addEventListener("click", function () {
    // If the current row is not set, set it to the first row
    if (!currentRow) {
      currentRow = rows[0];
      currentRow.style.backgroundColor = "yellow";
      currentRow.scrollIntoView();
      return;
    }

    // If the current row is the last row, do nothing
    if (currentRow === rows[rows.length - 1]) {
      return;
    }

    // Otherwise, set the current row to the next row and scroll to it
    currentRow.style.backgroundColor = "white";
    currentRow = currentRow.nextElementSibling;
    currentRow.style.backgroundColor = "yellow";
    currentRow.scrollIntoView();
  });

  const showAllButton = document.getElementById("show-all");
  const showDiffButton = document.getElementById("show-diff");

  // Add click event listener for the show all button
  showAllButton.addEventListener("click", function () {
    // Show all rows
    rows.forEach((row) => {
      row.style.display = "table-row";
    });
  });

  // Add click event listener for the show diff button
  showDiffButton.addEventListener("click", function () {
    // Hide all rows that are not added or removed
    rows.forEach((row) => {
      if (!row.classList.contains("added") && !row.classList.contains("removed")) {
        row.style.display = "none";
      }
    });
  });
</script>
</html>`
  );
});
