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
        "title": "صبحانه ساده",
        "subtitle": "ده سال پیش، آنگلا مرکل با اطمینان گفت: «ما از پسش برمی‌آییم!» و کلی کار هم کرد. یادته؟ حالا بحث پناهندگی و برگردوندن آدما، خیلی‌ها رو درگیر کرده. دولت چقدر باید سخت‌گیری کنه؟ چرا بعضی که حتی  شدن رو هم می‌کنن، مج",
        "imageUrl": "https://scontent-sea1-1.cdninstagram.com/v/t39.30808-6/540692055_1164409325716193_5022594382419109685_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMDgweDEzNTAuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlLmMyIn0&_nc_ht=scontent-sea1-1.cdninstagram.com&_nc_cat=1&_nc_oc=Q6cZ2QH0R5NK-GcX-sXUKiRAxus9uWqalrogj9dLW4vJ5jPXzRWT3ONs1yuS9oG8_rU0DME&_nc_ohc=QCyXmq5GXQkQ7kNvwGk8AN0&_nc_gid=-MxvE7ECwYx8jJdrZDN7Bw&edm=APs17CUAAAAA&ccb=7-5&oh=00_AfU-eb-1zWLCAPbPWfDlAw40Z9Fsr2m7dJZlrWhNLq0k0A&oe=68B7DEC9&_nc_sid=10d13b",
        "caption": "ده سال پیش، آنگلا مرکل با اطمینان گفت: «ما از پسش برمی‌آییم!» و کلی کار هم کرد. یادته؟ حالا بحث پناهندگی و برگردوندن آدما، خیلی‌ها رو درگیر کرده. دولت چقدر باید سخت‌گیری کنه؟ چرا بعضی که حتی  شدن رو هم می‌کنن، مج",
        "tags": ["minimalfood", "avocadotoast", "morningritual"],
        "handleText": "@de2fa",
        "lang": "fa",
        "dir": "rtl",
        "debug": false
     }
  }'
```
