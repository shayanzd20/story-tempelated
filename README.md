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
        "title": "آلمان و عشق بی‌پایانش به ماشین‌های شخصی",
        "subtitle": "آلمان باز هم رکورد زد: حالا برای هر ۱۰۰۰ نفر، ۵۹۰ تا ماشین وجود داره! ساارلند با ۶۴۶ ماشین صدرنشین شده و برلین با ۳۳۴ تا، صرفه‌جویی می‌کنه. جالبه که با وجود اینهمه ماشین، آلودگی دی‌اکسیدکربن نسبت به قبل از کرونا ۱۴٪ کمتر شده. پس معلوم میشه آلمانی‌ها هم عاشق ماشینن، هم هوای محیط زیست رو دارن!",
        "imageUrl": "https://scontent-sea5-1.cdninstagram.com/v/t51.2885-15/536807924_18519756505046463_4780855813158830666_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMDgweDEzNTAuc2RyLmY4Mjc4Ny5kZWZhdWx0X2ltYWdlLmMyIn0&_nc_ht=scontent-sea5-1.cdninstagram.com&_nc_cat=103&_nc_oc=Q6cZ2QHLloF4trsJFqESKgAPVezDqdDL6IdzNbFIqFZpfROZdmVpuL8IXg7okXeXdF6a4gI&_nc_ohc=DgYnwemrTpMQ7kNvwFGUdd5&_nc_gid=_h3T6NT0geKE_D4flCkbng&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfVuBH-Ly4Rlz15SSmOMpA-MEFSJnRuazBI8Ccm__wgDhw&oe=68B94209&_nc_sid=10d13b",
        "caption": "",
        "tags": [],
        "handleText": "de2fa.info@",
        "lang": "fa",
        "dir": "rtl",
        "debug": false
     }
  }'
```
