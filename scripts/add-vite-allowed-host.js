const fs = require("fs");
const path = require("path");

const host = process.argv[2];
if (!host) {
  console.error("Usage: node add-vite-allowed-host.js <hostname>");
  process.exit(1);
}

// Extract hostname from URL if a full URL is provided
let hostname = host;
try {
  const url = new URL(host.includes("://") ? host : `https://${host}`);
  hostname = url.hostname;
} catch {
  // Use as-is if not a valid URL
}

const configPath = path.resolve(__dirname, "../frontend/vite.config.ts");
let content = fs.readFileSync(configPath, "utf8");

if (content.includes(`"${hostname}"`)) {
  console.log(`"${hostname}" already in allowedHosts, skipping.`);
  process.exit(0);
}

content = content.replace(
  /allowedHosts:\s*\[/,
  `allowedHosts: ["${hostname}", `
);

fs.writeFileSync(configPath, content);
console.log(`Added "${hostname}" to allowedHosts in vite.config.ts`);
