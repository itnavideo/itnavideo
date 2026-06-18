const fs = require("fs");

const path = "remotion/templates/VIDEO_EXPLAINER/SimpleInfographicRenderer.tsx";
let text = fs.readFileSync(path, "utf8");

const oldBlock = `const buildDomainHostingNodes = (overlay?: OverlayLike): SimpleNode[] => {
  const start = typeof overlay?.start === "number" ? overlay.start : 0;

  return [
    {
      id: "domain-name",
      label: "Domain Name",
      start,
    },
    {
      id: "website-address",
      label: "Website Address",
      start: start + 1.1,
    },
    {
      id: "hosting-server",
      label: "Hosting Server",
      start: start + 2.2,
    },
    {
      id: "stores-files",
      label: "Stores Website Files",
      start: start + 3.3,
    },
  ];
};`;

const newBlock = `const buildDomainHostingNodes = (_overlay?: OverlayLike): SimpleNode[] => {
  return [
    {
      id: "domain-name",
      label: "Domain Name",
      start: 0,
    },
    {
      id: "website-address",
      label: "Website Address",
      start: 1.4,
    },
    {
      id: "hosting-server",
      label: "Hosting Server",
      start: 2.8,
    },
    {
      id: "stores-files",
      label: "Stores Website Files",
      start: 4.2,
    },
  ];
};`;

if (!text.includes(oldBlock)) {
  console.error("Could not find buildDomainHostingNodes block");
  process.exit(1);
}

text = text.replace(oldBlock, newBlock);

fs.writeFileSync(path, text, "utf8");
console.log("Domain hosting node timing fixed.");
