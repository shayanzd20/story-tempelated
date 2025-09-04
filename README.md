# Templated Instagram Story Renderer

This project provides an API to render Instagram story templates using Playwright and EJS.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

```markdown
    git clone https://github.com/your-repo/templated.git
    cd templated
```

### Sample Request on production

```bash
curl -X POST https://story-tempelated.onrender.com/api/render \
  -H "Content-Type: application/json" \
  -d '{
     "templateId": "de2fa-card",
     "width": 1080,
     "height": 1920,
     "data": {
        "title": "صبحانه ساده",
        "subtitle": "آیین‌های صبحگاهی",
        "imageUrl": "https://your.cdn/food.jpg",
        "caption": "روزت را با انرژی شروع کن",
        "tags": ["minimalfood", "avocadotoast", "morningritual"],
        "handleText": "@de2fa",
        "lang": "fa",
        "dir": "rtl",
        "debug": false
     }
  }'
```

### Sample Request on localhost

```bash
curl -X POST http://localhost:3000/api/render \
  -H "Content-Type: application/json" \
  -d '{
     "templateId": "de2fa-card",
     "width": 1080,
     "height": 1920,
     "data": {
        "title": "جوانی دیگه چه صیغه‌ایه؟ اینجا همه غصه دارن!",
        "subtitle": "یه تحقیق تازه نشون داده که برخلاف تصور عموم، جوان‌های زیر ۲۵ سال از همه نسل‌ها ناراضی‌تر و غمگین‌ترن! تقریباً ۴۰ درصد از جوانان می‌گن حالشون خوب نیست، در حالی که این رقم برای پدربزرگ‌ها و مادربزرگ‌ها فقط ۱۷ درصده. محققا می‌گن سه تا عامل اصلی مقصرن: بحران اقتصادی، محدودیت‌های کرونا و از همه مهم‌تر، شبکه‌های اجتماعی که مدام آدمو وادار می‌کنن خودشو با زندگی فانتزی بقیه مقایسه کنه (همونایی که多半 دروغن!). به علاوه، ترس از آینده و وضعیت آب و هوا هم مزید بر علت شده. خب چه جوری میشه حال این بچه‌ها رو خوب کرد؟ معلوم نیست، ولی امیدواریم این یه دوره موقت باشه و دوباره بشه قهقهه‌های جوانی رو شنید!",
        "imageUrl": "https://scontent-sea5-1.cdninstagram.com/v/t39.30808-6/541076410_1196204295873137_3295651488751283168_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMDgweDEzNTAuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlLmMyIn0&_nc_ht=scontent-sea5-1.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2QFJxH2IlS_EGBUzRNZE6BYu1cCYrCTqp4u_uAJfJn0NkeyAltFm1YuW3PLnt7jx6S4&_nc_ohc=o6nQQVUAIgAQ7kNvwGNnUbm&_nc_gid=RwrdRuziJdSVfBHjLpvO1g&edm=APs17CUAAAAA&ccb=7-5&oh=00_AfW4xBbRtYW31bPxj4ENBRtrtXS1TTjTlNVIF4TIDoP9iA&oe=68BA11DB&_nc_sid=10d13b",
        "caption": "",
        "tags": [],
        "handleText": "de2fa.info@",
        "lang": "fa",
        "dir": "rtl",
        "debug": false
     }
  }'
```

### Testing a Template

You can test a specific template by accessing the following URL in your browser:

```
http://localhost:3000/templates/project/<projectId>/template/<templateId>
```

Replace `<projectId>` with your project ID and `<templateId>` with the template ID you want to test.

### Sample Request for Project-Specific Template

```bash
curl -X POST http://localhost:3000/api/render/project/<projectId>/template/<templateId> \
   -H "Content-Type: application/json" \
   -d '{
       "width": 1080,
       "height": 1920,
       "data": {
            "title": "جوانی دیگه چه صیغه‌ایه؟ اینجا همه غصه دارن!",
            "subtitle": "یه تحقیق تازه نشون داده که برخلاف تصور عموم، جوان‌های زیر ۲۵ سال از همه نسل‌ها ناراضی‌تر و غمگین‌ترن! تقریباً ۴۰ درصد از جوانان می‌گن حالشون خوب نیست، در حالی که این رقم برای پدربزرگ‌ها و مادربزرگ‌ها فقط ۱۷ درصده. محققا می‌گن سه تا عامل اصلی مقصرن: بحران اقتصادی، محدودیت‌های کرونا و از همه مهم‌تر، شبکه‌های اجتماعی که مدام آدمو وادار می‌کنن خودشو با زندگی فانتزی بقیه مقایسه کنه (همونایی که多半 دروغن!). به علاوه، ترس از آینده و وضعیت آب و هوا هم مزید بر علت شده. خب چه جوری میشه حال این بچه‌ها رو خوب کرد؟ معلوم نیست، ولی امیدواریم این یه دوره موقت باشه و دوباره بشه قهقهه‌های جوانی رو شنید!",
            "imageUrl": "https://scontent-sea5-1.cdninstagram.com/v/t39.30808-6/541076410_1196204295873137_3295651488751283168_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMDgweDEzNTAuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlLmMyIn0&_nc_ht=scontent-sea5-1.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2QFJxH2IlS_EGBUzRNZE6BYu1cCYrCTqp4u_uAJfJn0NkeyAltFm1YuW3PLnt7jx6S4&_nc_ohc=o6nQQVUAIgAQ7kNvwGNnUbm&_nc_gid=RwrdRuziJdSVfBHjLpvO1g&edm=APs17CUAAAAA&ccb=7-5&oh=00_AfW4xBbRtYW31bPxj4ENBRtrtXS1TTjTlNVIF4TIDoP9iA&oe=68BA11DB&_nc_sid=10d13b",
            "caption": "Create unique stories effortlessly",
            "tags": ["custom", "story", "renderer"],
            "handleText": "@customHandle",
            "lang": "en",
            "dir": "ltr",
            "debug": false
       }
   }'
```

Replace `<projectId>` with your project ID and `<templateId>` with the template ID you want to use.

# Debugging in VS Code (Node ESM + Express + Playwright)

> Works with your current `package.json` (ESM, `"type": "module"`).
> Requires Node **18+** (recommended: Node 20).

---

## 1) Prerequisites

```bash
# Check Node version
node -v  # should be >= 18

# Install Playwright Chromium deps (already scripted)
npm run render-build
```

(Optional) Load `.env` automatically by adding this on top of `server.js`:

```js
import "dotenv/config";
```

---

## 2) VS Code launch configuration

Create **`.vscode/launch.json`**:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch: server.js (Node ESM)",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server.js",
      "runtimeArgs": ["--inspect=9229", "--enable-source-maps"],
      "cwd": "${workspaceFolder}",
      "envFile": "${workspaceFolder}/.env",
      "env": {
        "NODE_ENV": "development",
        "PWDEBUG": "0",
        "PORT": "3000"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Attach: 9229",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "restart": true,
      "autoAttachChildProcesses": true,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

> If VS Code uses the **wrong Node** (and you see `SyntaxError: Unexpected identifier` on `import`):
> find your Node 18/20 path and set `"runtimeExecutable"` in the first config.

**Find Node path (Linux/macOS):**

```bash
node -v
command -v node
readlink -f "$(command -v node)"   # real path
```

**Find Node path (Windows PowerShell):**

```powershell
node -v
where.exe node
```

Then add, for example:

```json
"runtimeExecutable": "/home/you/.nvm/versions/node/v20.16.0/bin/node"
```

---

## 4) Playwright in “headed” mode while debugging

Add this tweak (if not already present) so Chromium opens visibly and slows a bit when `PWDEBUG=1`:

```js
let browser;
async function getBrowser() {
  if (!browser) {
    const headed = process.env.PWDEBUG === "1" || process.env.HEADFUL === "1";
    browser = await chromium.launch({
      headless: !headed,
      devtools: headed,
      slowMo: headed ? 100 : 0,
      args: ["--font-render-hinting=medium"],
    });
  }
  return browser;
}
```

- In **“Launch: Nodemon (auto-reload)”**, `PWDEBUG=1` is set → headed mode on.
- In **“Launch: server.js”**, `PWDEBUG=0` → headless (faster).

---

## 5) Start debugging

- Open VS Code → **Run and Debug**.
- Pick **Launch: server.js (Node ESM)** (simple) or **Launch: Nodemon (auto-reload)** (hot-reload).
- Set breakpoints anywhere (routes, EJS render, Playwright page workflow) and press **F5**.

---
