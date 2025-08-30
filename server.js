import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { chromium } from "playwright";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// templating, statics
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/renders", (req, res, next) => {
  if (req.path.endsWith(".png")) {
    res.setHeader("Content-Type", "image/png");
  } else if (req.path.endsWith(".jpg") || req.path.endsWith(".jpeg")) {
    res.setHeader("Content-Type", "image/jpeg");
  }
  next();
}, express.static(path.join(__dirname, "renders"), { maxAge: "365d" }));

app.use(bodyParser.json({ limit: "2mb" }));

// --- Template routes (server-side render of HTML) ---
app.get("/templates/de2fa-card", (req, res) => {
  const b64 = String(req.query.payload || "");
  let data = {};
  try {
    data = JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
    res.render("de2fa-card", { data });
  } catch (error) {
    console.error("Error parsing payload:", error);
    res.status(400).json({ error: "Invalid payload format" });
  }
});

// --- Browser pool (simple) ---
let browser;
async function getBrowser() {
  if (!browser) browser = await chromium.launch({ args: ["--font-render-hinting=medium"] });
  return browser;
}


async function fetchAsDataUrl(src) {
  const r = await fetch(src);
  if (!r.ok) throw new Error(`Image fetch failed: ${r.status}`);
  const buf = await r.arrayBuffer();
  const b64 = Buffer.from(buf).toString("base64");
  const mime = r.headers.get("content-type") || "image/jpeg";
  return `data:${mime};base64,${b64}`;
}

// --- Render API ---
app.post("/api/render", async (req, res) => {
  const { templateId = "de2fa-card", width = 768, height = 1365, data = {} } = req.body;
  if (templateId !== "de2fa-card") {
    return res.status(400).json({ error: "Unknown templateId" });
  }

  try {
    // A) make unstable URLs stable (your step A)
    const dataCopy = { ...data };
    if (dataCopy.imageUrl?.startsWith("http")) {
      dataCopy.imageUrl = await fetchAsDataUrl(dataCopy.imageUrl); // from my previous message
    }

    // B) render EJS to HTML string (no payload in URL)
    const html = await new Promise((resolve, reject) => {
      app.render("de2fa-card", { data: dataCopy }, (err, out) => err ? reject(err) : resolve(out));
    });

    const b = await getBrowser();
    const ctx = await b.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();

    // Load the HTML directly
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluateHandle(`document.fonts ? document.fonts.ready : Promise.resolve()`);

    // Optional: wait until background-image is actually applied
    await page.waitForFunction(() => {
      const el = document.querySelector(".story__media");
      return el && getComputedStyle(el).backgroundImage !== "none";
    }, { timeout: 10000 });

    await fs.promises.mkdir(path.join(__dirname, "renders"), { recursive: true });
    const id = uuidv4();
    const outPath = path.join(__dirname, "renders", `${id}.png`);
    await page.screenshot({ path: outPath, type: "png" });
    await ctx.close();

    const publicUrl = `https://${req.get("host")}/renders/${id}.png`;
    res.json({ id, url: publicUrl, width, height });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Render failed", detail: String(e) });
  }
});

process.on("SIGINT", async () => { if (browser) await browser.close(); process.exit(0); });

app.listen(PORT, () => console.log(`Ready → http://localhost:${PORT}`));
