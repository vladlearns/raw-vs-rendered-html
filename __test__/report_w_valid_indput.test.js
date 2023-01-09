import rawVsRendered from "../main";
import fs from "fs";

test("rawVsRendered produces correct output", async () => {
  // Arrange
  const link = "https://www.example.com/";
  const outputPath = "output.html";

  // Act
  await rawVsRendered(link, outputPath);

  // Assert
  const output = fs.readFileSync(outputPath, "utf8");
  expect(output).toMatchSnapshot();
});
