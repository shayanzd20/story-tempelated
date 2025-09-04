import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { chromium } from "playwright";
import { v4 as uuidv4 } from "uuid";
import ejs from "ejs";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;


/** ---------- DEFAULT TEST PAYLOAD (used for GET without payload) ---------- */
const DEFAULT_TEST_DATA = {
  title: "جوانی دیگه چه صیغه‌ایه؟ اینجا همه غصه دارن!",
  subtitle:
    "یه تحقیق تازه نشون داده که برخلاف تصور عموم، جوان‌های زیر ۲۵ سال از همه نسل‌ها ناراضی‌تر و غمگین‌ترن! تقریباً ۴۰ درصد از جوانان می‌گن حالشون خوب نیست، در حالی که این رقم برای پدربزرگ‌ها و مادربزرگ‌ها فقط ۱۷ درصده. محققا می‌گن سه تا عامل اصلی مقصرن: بحران اقتصادی، محدودیت‌های کرونا و از همه مهم‌تر، شبکه‌های اجتماعی که مدام آدمو وادار می‌کنن خودشو با زندگی فانتزی بقیه مقایسه کنه (همونایی که多半 دروغن!). به علاوه، ترس از آینده و وضعیت آب و هوا هم مزید بر علت شده. خب چه جوری میشه حال این بچه‌ها رو خوب کرد؟ معلوم نیست، ولی امیدواریم این یه دوره موقت باشه و دوباره بشه قهقهه‌های جوانی رو شنید!",
  imageUrl:
    "https://scontent-sea5-1.cdninstagram.com/v/t39.30808-6/541076410_1196204295873137_3295651488751283168_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMDgweDEzNTAuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlLmMyIn0&_nc_ht=scontent-sea5-1.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2QFJxH2IlS_EGBUzRNZE6BYu1cCYrCTqp4u_uAJfJn0NkeyAltFm1YuW3PLnt7jx6S4&_nc_ohc=o6nQQVUAIgAQ7kNvwGNnUbm&_nc_gid=RwrdRuziJdSVfBHjLpvO1g&edm=APs17CUAAAAA&ccb=7-5&oh=00_AfW4xBbRtYW31bPxj4ENBRtrtXS1TTjTlNVIF4TIDoP9iA&oe=68BA11DB&_nc_sid=10d13b",
  caption: "",
  tags: [],
  handleText: "de2fa.info@",
  lang: "fa",
  dir: "rtl",
  debug: false
};


/** ---------------------------- Templating & statics ---------------------------- */
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

/** ---------------------- Browser test route (GET render) ---------------------- */
/**
 * Visit in browser:
 *   http://localhost:3000/templates/project/test/template/de2fa-card
 *
 * Optional:
 *   ?width=1080&height=1920
 *   ?payload=<base64url-of-JSON>  (overrides default data)
 *
 * The EJS template name must match :templateId (e.g. "de2fa-card.ejs")
 */
app.get("/templates/project/:projectId/template/:templateId", async (req, res) => {
  const { templateId, projectId } = req.params;
  if (!templateId) {
    return res.status(400).json({ error: "Missing templateId" });
  }

  const width = Number(req.query.width) || 1080;
  const height = Number(req.query.height) || 1920;

  const b64 = typeof req.query.payload === "string" ? req.query.payload : undefined;

  let data = DEFAULT_TEST_DATA;
  if (b64) {
    try {
      data = JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
    } catch (error) {
      console.error("Error parsing payload:", error);
      return res.status(400).json({ error: "Invalid payload format" });
    }
  }

  try {
    const templateFile = resolveTemplatePath({ projectId, templateId });
    const html = await ejs.renderFile(templateFile, { data, width, height, projectId, templateId }, { async: true });
    res.send(html);
  } catch (e) {
    res.status(404).json({ error: String(e) });
  }
});


/** ------------------------------ Browser pool ------------------------------ */
let browser;
async function getBrowser() {
  if (!browser)
    browser = await chromium.launch({ args: ["--font-render-hinting=medium"] });
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

function sanitizeSegment(s, fallback = "default") {
  const clean = String(s || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "-");
  return clean || fallback;
}


// resolve a concrete file path for the template
function resolveTemplatePath({ projectId, templateId }) {
  const safeProject = sanitizeSegment(projectId);
  const candidates = [
    path.join(__dirname, "templates", safeProject, `${templateId}.ejs`),
    path.join(__dirname, "templates", `${templateId}.ejs`),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  const tried = candidates.map(p => p.replace(__dirname + "/", "")).join(" | ");
  throw new Error(`Template not found. Tried: ${tried}`);
}

// --- Render API (dynamic projectId + templateId) ---
app.post("/api/render/project/:projectId/template/:templateId", async (req, res) => {
  const { projectId, templateId } = req.params;
  const { width = 768, height = 1365, data = {} } = req.body;

  const safeProject = sanitizeSegment(projectId);
  const safeTemplate = sanitizeSegment(templateId);

  try {
    // 1) pick the actual .ejs file
    const templateFile = resolveTemplatePath({ projectId: projectId, templateId: safeTemplate });


    const dataCopy = { ...data };
    if (dataCopy.imageUrl?.startsWith("http")) {
      dataCopy.imageUrl = await fetchAsDataUrl(dataCopy.imageUrl);
    }

    // 3) render EJS from file path (not app.render)
    const html = await ejs.renderFile(
      templateFile,
      { data: dataCopy, width, height, projectId: safeProject, templateId: safeTemplate },
      { async: true }
    );

    const b = await getBrowser();
    const ctx = await b.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluateHandle(`document.fonts ? document.fonts.ready : Promise.resolve()`);

    await page.waitForFunction(() => {
      const el = document.querySelector(".story__media");
      return el && getComputedStyle(el).backgroundImage !== "none";
    }, { timeout: 10000 });

    // --- WRITE under renders/<project>/<template>/<id>.png ---
    const id = uuidv4();
    const dir = path.join(__dirname, "renders", safeProject, safeTemplate);
    await fs.promises.mkdir(dir, { recursive: true });
    const outPath = path.join(dir, `${id}.png`);
    await page.screenshot({ path: outPath, type: "png" });
    await ctx.close();

    const publicUrl = `${req.protocol}://${req.get("host")}/renders/${safeProject}/${safeTemplate}/${id}.png`;
    res.json({ id, url: publicUrl, projectId: safeProject, templateId: safeTemplate, width, height });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Render failed", detail: String(e) });
  }
});


process.on("SIGINT", async () => { if (browser) await browser.close(); process.exit(0); });

app.listen(PORT, () => console.log(`Ready → http://localhost:${PORT}`));
