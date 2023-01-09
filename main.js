import axios from "axios";
import { JSDOM } from "jsdom";
import * as diff from "diff";
import fs from "fs";

const rawVsRendered = (link, outputPath) => {
  axios
    .get(link)
    .then((response) => {
      const dom = new JSDOM(response.data);
      const renderedHtml = dom.serialize();
      const rawHtml = response.data;

      const rawHtmlTags = rawHtml;
      const renderedHtmlTags = renderedHtml;
      let numAddedLines = 0;
      let numRemovedLines = 0;

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
          bottom: 10%;
          left: 80px;
          font-size: xx-large;
          margin-right: 10px;
          margin-top: calc(100vh + var(--offset));
          text-decoration: none;
          padding: 10px;
          font-family: sans-serif;
          color: #fff;
          background: #000;
          border-radius: 100px;
          white-space: nowrap;
          user-select: none;
        }

        #prev {
          position: fixed;
          bottom: 10%;
          left: 160px;
          font-size: xx-large;
          margin-right: 10px;
          margin-top: calc(100vh + var(--offset));
          text-decoration: none;
          padding: 10px;
          font-family: sans-serif;
          color: #fff;
          background: #000;
          border-radius: 100px;
          white-space: nowrap;
          user-select: none;
        }
        .text-button {
          font-family: "Open Sans", sans-serif;
          font-size: 16px;
          letter-spacing: 2px;
          text-align: center;
          text-decoration: none;
          text-transform: uppercase;
          color: #000;
          cursor: pointer;
          border: 3px solid;
          padding: 0.25em 0.5em;
          margin: 10px;
          box-shadow: 1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px, 5px 5px 0px 0px;
          position: relative;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
        }

        .text-button:active {
          box-shadow: 0px 0px 0px 0px;
          top: 5px;
          left: 5px;
        }

        @media (min-width: 768px) {
          .text-button {
            padding: 0.25em 0.75em;
          }
        }
        .top {
          --offset: 50px;
          left: 80px;
          position: sticky;
          bottom: 20px;
          margin-right: 10px;
          place-self: end;
          margin-top: calc(100vh + var(--offset));
          text-decoration: none;
          padding: 10px;
          font-family: sans-serif;
          color: #fff;
          background: #000;
          border-radius: 100px;
          white-space: nowrap;
        }

        #line-count {
            position: relative;
            left: 85%;
            font-family: sans-serif;
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
          renderedOutput = `<span class="added">++++ ${line.value
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")}</span>`;
          rowClass = "added";
          numAddedLines++;
        } else if (line.removed) {
          rawOutput = `<span class="removed">--- ${line.value
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")}
</span>`;
          renderedOutput = "";
          rowClass = "removed";
          numRemovedLines++;
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
        outputPath,
        `<div>
  <div id="show-all" class="text-button" role="button">Show All</div>
  <div id="show-diff" class="text-button" role="button">Show Diff</div>
</div>
 <div id="line-count">
    Added: <span id="num-added">${numAddedLines}</span> | Removed: <span id="num-removed">${numRemovedLines}</span>
</div>
<table>
<tr>
    </table>
    </body>
    <div>
  <div id="prev">&#8593;</div>
  <div id="next">&#8595;</div>
</div>
<a href="#" class="top">Back to Top &#8593;</a>

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
      currentRow.scrollIntoView({behavior:"smooth"});
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
    currentRow.scrollIntoView({behavior:"smooth"});
  });

  // Add click event listener for the next button
  nextButton.addEventListener("click", function () {
    // If the current row is not set, set it to the first row
    if (!currentRow) {
      currentRow = rows[0];
      currentRow.style.backgroundColor = "yellow";
      currentRow.scrollIntoView({behavior:"smooth"});
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
    currentRow.scrollIntoView({behavior:"smooth"});
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
    })
    .catch(function (error) {
      console.log(error);
      return Promise.reject(error);
    });
};

export default rawVsRendered;
