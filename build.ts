const outDir = "./build";

await Bun.build({
  entrypoints: ["./main.ts"],
  outdir: outDir,
  target: "browser",
});

const manifest = Bun.file("manifest.json");
await Bun.write(`${outDir}/manifest.json`, manifest);

const icon = Bun.file("icon.png");
await Bun.write(`${outDir}/icon.png`, icon);
