import esbuild from "esbuild";
import fs from "fs";

esbuild
  .build({
    entryPoints: ["index.ts"], // Entry point to bundle
    outfile: "dist/bundle.js", // Output file
    bundle: true, // Bundle all dependencies
    globalName: "ipfsHelpers", // Set the global name
    platform: "browser", // Target platform
  })
  .then(() => {
    const bundle = fs.readFileSync("dist/bundle.js", "utf8");
    const updated = bundle.replace(
      "var ipfsHelpers",
      "export const ipfsHelpers"
    );
    fs.writeFileSync("dist/bundle.js", updated);

    console.log("Bundle created successfully");

    // get the dist/index.d.ts file, and wrap everything in a export namespace ipfsHelpers { ... }
    const declaration = fs.readFileSync("dist/index.d.ts", "utf8");
    const updatedDeclaration = `export namespace ipfsHelpers {\n${declaration}\n}`;
    fs.writeFileSync("dist/index.d.ts", updatedDeclaration);
    console.log("Declaration file updated successfully");

    // check if there's --bump flag
    if (process.argv.includes("--bump")) {
      console.log("Bumping version...");
      // bump a patch version on package.json
      const packageJson = JSON.parse(
        fs.readFileSync("dist/package.json", "utf8")
      );
      const [major, minor, patch] = packageJson.version.split(".");
      packageJson.version = `${major}.${minor}.${parseInt(patch) + 1}`;
      fs.writeFileSync(
        "dist/package.json",
        JSON.stringify(packageJson, null, 2)
      );
    } else {
      console.log("Skipping version bump...");
      return;
    }
  })
  .catch(() => process.exit(1)); // Exit with error code on failure
