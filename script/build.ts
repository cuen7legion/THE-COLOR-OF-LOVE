#!/usr/bin/env tsx
import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { readFile } from "node:fs/promises";
import * as path from 'path';

const allowlist = [
  "@anthropic-ai/sdk",
  "@google/generative-ai",
  "axios",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
  "dotenv",
];

async function main() {
  console.log('🏗️ Building client...');
  
  // Construir frontend desde carpeta client
  await viteBuild({
    configFile: path.resolve(__dirname, 'vite.config.ts'),
  });
  
  console.log('✅ Client built');

  console.log('🏗️ Bundling server...');
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: false,
    external: externals,
    logLevel: "info",
    sourcemap: false,
  });

  console.log('✅ Server bundled');
  console.log('🎉 Build complete!');
}

main().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
