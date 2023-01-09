import rawVsRendered from "../main";
test("rawVsRendered handles invalid input correctly", async () => {
  // Arrange
  const link = "invalid-link";
  const outputPath = "output.html";

  // Act and assert
  await expect(rawVsRendered(link, outputPath)).rejects.toThrow();
});
