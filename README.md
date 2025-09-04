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
