const { cleanNetwork } = require("../src/scripts/cleanNetwork");

test("cleanNetwork debería ejecutarse sin errores", async () => {
  await expect(cleanNetwork("MiRedBesu")).resolves.not.toThrow();
});
