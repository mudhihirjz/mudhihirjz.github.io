# KILIVO LABS Public Website and Admin API Proposal

**Status:** Proposal  
**Version:** 1  
**Base path:** `/api/v1`  
**Audience:** Public website, Tauri admin app, and backend implementers

## 1. Lengo na mipaka

API hii itawezesha website ya umma kuonyesha maudhui yanayochapishwa na admin,
na Tauri desktop app kusimamia mfumo wa KILIVO LABS kama inavyoonekana kwenye
Admin Dashboard reference: kampuni, members, divisions, projects, impact,
news/media, public website content, analytics, na audit logs.

- Wageni wa website hawana akaunti wala hawahitaji kuingia ili kusoma maudhui.
- Admin pekee ndiye anayeingia kwenye Tauri admin app ili kuunda, kuhariri,
  kupanga muda wa kuchapisha, kuchapisha, au kuondoa maudhui.
- Wageni wanaweza kutuma ombi/ujumbe kupitia fomu za Join, Membership, na
  Contribution. Hii ni fomu ya mawasiliano, si akaunti ya mtumiaji wala
  malipo ya mchango.
- Website ya umma haina login. Tauri admin app ina login na ruhusa za admin.
- API hii haibadilishi mikataba ya member-only API iliyo kwenye
  `kilivo-android/API_SPECIFICATION.md`; data zinazohusiana zitumie backend
  na sera zinazolingana.

## 2. Pendekezo la usanifu

Tumia REST/JSON API yenye prefix `/api/v1`, na database ya kudumu kwa maudhui,
members, projects, audit events, na maombi. Hifadhi picha kwenye object/media
storage; database ihifadhi metadata na URL ya picha. Public website itumie
public endpoints tu. Tauri admin app itaingia kupitia admin-only endpoints
zenye uthibitishaji na ruhusa za server.

Tauri ni desktop client ya admin, si backend wala mbadala wa API: data
inayoshirikiwa na website na vifaa vingine ibaki kwenye backend. Tauri
frontend inaweza kutumia React; native Rust commands zitumike pale tu uwezo wa
desktop unapohitajika, si kuweka ruhusa za admin au siri za API ndani ya app.

Maudhui ya public yarudishwe tu ikiwa `status` ni `published` na muda wake wa
`publishAt` umefika. Kufuta maudhui yaliyokuwa live kwa kawaida kuwe `archived`
au `draft` badala ya kufuta rekodi, ili historia ihifadhiwe.

## 3. Kanuni za API

- Tumia HTTPS nje ya local development na JSON UTF-8.
- Tumia UUID kwa `id`, ISO-8601 UTC kwa tarehe, na slugs za URL kwa makala.
- Public list endpoints zitumie `page` (1-based), `pageSize` (default 20,
  maximum 100), pamoja na metadata ya pagination.
- Maudhui yatakayojumuisha lugha nyingi yahifadhiwe kwa `en` na `sw` fields
  au muundo wa translations; lugha inayotumika ichaguliwe kwa `?locale=en|sw`.
- Admin authentication itumie session salama ya `HttpOnly`, `Secure`,
  `SameSite` cookie inapowezekana. Kwa Tauri, API ichague login/session flow
  inayoweza kutumika salama na desktop client; token ikihitajika, ihifadhiwe
  kwenye OS credential store kupitia native integration, kamwe si localStorage
  wala ndani ya frontend bundle.
- Admin endpoints zote zihitaji role inayofaa na uthibitisho wa ruhusa upande
  wa server. Usirudishe rasimu, maelezo binafsi, au credentials kupitia public
  endpoints.

### Muundo wa majibu

Jibu la resource moja:

```json
{
  "data": {
    "id": "uuid",
    "title": "Together for a Brighter Future"
  }
}
```

Jibu la list:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

Jibu la hitilafu:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": [
      { "field": "email", "message": "Enter a valid email address." }
    ],
    "requestId": "request-id"
  }
}
```

Tumia status codes zinazolingana na matokeo: `400` request isiyo sahihi,
`401` session haipo/imeisha, `403` ruhusa haitoshi, `404` haipo au haionekani,
`409` mgongano, `422` validation, `429` rate limit, na `5xx` hitilafu ya server.

## 4. Public endpoints

Hizi hazihitaji authentication. Zinaonyesha published content pekee.

| Method | Endpoint | Matumizi |
|---|---|---|
| `GET` | `/api/v1/site/home` | Data ya ukurasa wa mwanzo kwa request moja |
| `GET` | `/api/v1/site/settings` | Jina, tagline, navigation, social links na footer |
| `GET` | `/api/v1/hero-slides` | Slides zinazotumika, kwa mpangilio wa admin |
| `GET` | `/api/v1/divisions` | Divisions zinazotumika, kwa mpangilio wa admin |
| `GET` | `/api/v1/articles?page=1&pageSize=12` | Orodha ya makala yaliyochapishwa |
| `GET` | `/api/v1/articles/{slug}` | Maudhui kamili ya makala moja |
| `POST` | `/api/v1/inquiries` | Kutuma ombi/ujumbe kutoka fomu ya public |

`GET /site/home` ni endpoint ya aggregation inayopendekezwa kwa landing page:

```json
{
  "data": {
    "site": {
      "name": "KILIVO LABS",
      "tagline": "Build. Innovate. Empower.",
      "locale": "en"
    },
    "heroSlides": [],
    "divisions": [],
    "featuredArticles": [],
    "community": {
      "joinTitle": "Join KILIVO LABS",
      "joinDescription": "Be part of a forward-thinking community.",
      "impactTitle": "Support Our Community Impact",
      "impactDescription": "Contribute to projects that uplift our society."
    },
    "socialLinks": []
  }
}
```

### Muundo wa maudhui

Hero slide:

```json
{
  "id": "uuid",
  "title": "Together for a Brighter Future",
  "body": "Organization introduction.",
  "image": {
    "url": "https://cdn.example.org/media/hero.jpg",
    "alt": "Community standing together"
  },
  "primaryAction": { "label": "Learn More", "url": "#about" },
  "secondaryAction": { "label": "Join Our Community", "url": "#join" },
  "position": 1
}
```

Division:

```json
{
  "id": "uuid",
  "slug": "kilivo-business",
  "name": "KILIVO BUSINESS",
  "description": "Commerce & More",
  "iconKey": "business",
  "image": {
    "url": "https://cdn.example.org/media/business.jpg",
    "alt": "Business district"
  },
  "theme": "business",
  "linkUrl": "/divisions/kilivo-business",
  "position": 1
}
```

`iconKey` na `theme` ni keys zilizoruhusiwa na frontend (kwa mfano
`business`, `technology`, `projects`, `impact`); admin asitume arbitrary SVG
au HTML itakayochorwa moja kwa moja kama code.

Article:

```json
{
  "id": "uuid",
  "slug": "innovation-for-a-better-tomorrow",
  "title": "Innovation for a Better Tomorrow",
  "summary": "Short article summary.",
  "body": "<p>Full article content.</p>",
  "image": {
    "url": "https://cdn.example.org/media/article.jpg",
    "alt": "Technology and circuit board"
  },
  "publishedAt": "2026-11-13T12:00:00Z",
  "divisionId": "division-uuid"
}
```

Body ya article iwe HTML iliyosafishwa na backend au rich-text format
inayosafishwa na renderer; usionyeshe arbitrary HTML kutoka admin bila
sanitization.

### Kutuma ombi kutoka public form

```http
POST /api/v1/inquiries
Content-Type: application/json
```

```json
{
  "type": "membership",
  "name": "Amina",
  "email": "amina@example.org",
  "phone": "+255...",
  "message": "Ningependa kujua zaidi.",
  "consent": true
}
```

`type` iwe mojawapo ya `join`, `membership`, `contribution`, au `contact`.
Jibu la mafanikio liwe `202 Accepted` na reference ID; lisidai kwamba uanachama
umekubaliwa au mchango umelipwa. Thibitisha fields server-side, weka rate limit
na spam protection, na hifadhi data binafsi kwa muda unaohitajika tu. Usirudishe
maombi haya kupitia public API.

## 5. Admin endpoints

Endpoints hizi zinahitaji admin authentication na role inayofaa. Orodha hii
ni contract ya proposal kwa Tauri desktop app; server ndiyo itekeleze
authorization, hata kama app imeficha vitufe visivyoruhusiwa.

| Method | Endpoint | Ruhusa / matokeo |
|---|---|---|
| `POST` | `/api/v1/admin/auth/login` | Kuingia kwa admin; MFA inapendekezwa |
| `POST` | `/api/v1/admin/auth/logout` | Kufunga session/revoke token |
| `POST` | `/api/v1/admin/auth/refresh` | Kusasisha session/token iliyothibitishwa |
| `GET` | `/api/v1/admin/auth/me` | Kuangalia admin na role/permissions |
| `GET` | `/api/v1/admin/dashboard?range=30d` | KPI cards, trends, read-only Company Overview, divisions overview, recent activities |
| `GET` | `/api/v1/admin/companies` | Kuorodhesha kampuni |
| `GET/PATCH` | `/api/v1/admin/companies/{id}` | Kusoma/kusasisha taarifa za kampuni |
| `GET/POST` | `/api/v1/admin/members` | Kutafuta/kuorodhesha au kuongeza member |
| `GET/PATCH` | `/api/v1/admin/members/{id}` | Kusoma/kusasisha member kulingana na role |
| `POST` | `/api/v1/admin/members/{id}/deactivate` | Kuzima member bila kufuta historia |
| `GET/POST` | `/api/v1/admin/divisions` | Kuorodhesha/kuunda division |
| `GET/PATCH/DELETE` | `/api/v1/admin/divisions/{id}` | Kusoma/kubadilisha/archive division |
| `GET/POST` | `/api/v1/admin/divisions/{divisionId}/projects` | Kusoma/kuunda projects ndani ya division |
| `GET/PATCH/DELETE` | `/api/v1/admin/divisions/{divisionId}/projects/{id}` | Kusoma/kubadilisha/archive project ya division |
| `GET/POST` | `/api/v1/admin/divisions/{divisionId}/impact-programs` | Kusoma/kuunda impact programs ndani ya division |
| `GET/PATCH/DELETE` | `/api/v1/admin/divisions/{divisionId}/impact-programs/{id}` | Kusoma/kubadilisha/archive impact program ya division |
| `GET/POST` | `/api/v1/admin/articles` | Kuorodhesha/kuunda article au news |
| `GET/PATCH/DELETE` | `/api/v1/admin/articles/{id}` | Kusoma/kubadilisha/archive article |
| `POST` | `/api/v1/admin/articles/{id}/publish` | Kuchapisha au kupanga muda wa kuchapisha |
| `POST` | `/api/v1/admin/articles/{id}/unpublish` | Kurudisha article kuwa draft |
| `GET/POST` | `/api/v1/admin/hero-slides` | Kuorodhesha/kuunda slide |
| `PATCH/DELETE` | `/api/v1/admin/hero-slides/{id}` | Kuhariri/kuondoa slide |
| `GET/PATCH` | `/api/v1/admin/site/settings` | Kusoma/kusasisha taarifa za site |
| `POST` | `/api/v1/admin/media` | Kuanzisha upload ya picha |
| `GET` | `/api/v1/admin/inquiries` | Kusoma maombi; admin pekee |
| `PATCH` | `/api/v1/admin/inquiries/{id}` | Kubadili status/maelezo ya ndani |
| `GET` | `/api/v1/admin/analytics/overview?range=30d` | Takwimu za dashboard zilizo ndani ya ruhusa |
| `GET` | `/api/v1/admin/audit-logs` | Kusoma audit log; role maalum |

Content create/update endpoints ziunge mkono `draft`, `published`, na
`archived`; `publishAt` inaweza kuwa tarehe ya baadaye. Kwa `DELETE`, pendekezo
ni soft-delete/archive na kutoruhusu kufuta content inayotumika bila
uthibitisho au ruhusa maalum.

### Dashboard summary

`GET /api/v1/admin/dashboard?range=30d` inaweza kurudisha data zinazohitajika
na dashboard bila kuita kila endpoint ya widget kivyake:

```json
{
  "data": {
    "range": "30d",
    "metrics": {
      "companies": 1,
      "divisions": 4,
      "members": 248,
      "projects": 12,
      "articles": 48
    },
    "series": [],
    "divisionBreakdown": [],
    "recentActivities": [],
    "latestArticles": [],
    "companyOverview": {
      "asOf": null,
      "mission": null,
      "achievements": [],
      "plans": [],
      "divisions": [],
      "financials": {
        "revenue": { "amount": null, "currency": null, "period": null },
        "contributions": { "amount": null, "currency": null, "period": null }
      }
    },
    "communityImpact": {
      "activeProjects": 5,
      "supportAmount": null,
      "currency": "TZS"
    }
  }
}
```

Takwimu ni za mfano wa response tu; dashboard isionyeshe thamani ya kubuni
kama taarifa halisi. Backend irudishe `null` au hali ya "haipatikani" pale
metric haijakusanywa au user hana ruhusa ya kuiona. `recentActivities` zisitaje
data binafsi zaidi ya inavyohitajika kwa admin.

`companyOverview` ni sehemu ya kusoma tu ya Company Overview. Hakuna `POST`,
`PATCH`, au `DELETE` ya sehemu hii. `mission` inaweza kuwa `null`; `achievements`,
`plans`, na `divisions` ni orodha za rekodi zilizoidhinishwa kuonekana kwa admin.
Kila achievement itumie `{ "id", "title", "summary", "status", "achievedAt" }`;
kila plan itumie `{ "id", "title", "summary", "status", "targetDate" }`; na
kila division itumie `{ "id", "name", "summary", "status" }`. Tarehe na
maelezo yasiyopatikana yawekwe `null`. Kiasi cha `revenue` na `contributions`
kirudishwe kama namba au `null`, pamoja na `currency` na `period` au `null`.
Backend isijaze sample values kama taarifa halisi.

Projects na impact programs ni maudhui ya division husika, si sehemu za admin
zilizo juu ya divisions. Article/news inaweza kuwa ya kampuni nzima au
kuhusishwa na division kwa hiari kupitia `divisionId: null | UUID`; tangazo
nalo linaweza kuhusishwa kwa hiari. Backend ihakikishe division hiyo ipo na
admin ana ruhusa ya kuibadilisha.

### Tauri desktop client

- Tauri app iwasiliane na API ya HTTPS; usiweke database credentials, admin
  passwords, au permanent API keys ndani ya installer/bundle.
- Tumia Tauri capabilities/permissions za chini kabisa. Usiruhusu remote
  content kuendesha native commands au kufikia filesystem bila sababu.
- Hifadhi session credentials kwenye OS credential store kupitia Rust/native
  integration, na zifute wakati wa logout. Epuka kuandika credentials kwenye
  logs, crash reports, au local app data.
- Hakiki certificates za HTTPS kwa kawaida; usizime TLS verification kwa
  production. Tumia API-side authorization kwa kila operation.
- Updates za Tauri app zitumie signed artifacts na update metadata
  inayothibitishwa.
- Network ikishindwa, onyesha ujumbe wa hitilafu na retry inayodhibitiwa;
  usionyeshe mabadiliko ya admin kama yamefanikiwa kabla ya server kuyakubali.

### Upload za media

`POST /admin/media` ithibitishe aina na ukubwa wa faili, itoe upload URL ya muda
mfupi au ipokee faili yenyewe, kisha irudishe `url`, `alt`, `width`, `height`,
na `contentType`. Ruhusu image formats zinazohitajika tu; hifadhi faili kwenye
media storage, si ndani ya database. Usikubali executable files au kutegemea
filename pekee kuthibitisha aina ya faili.

## 6. Usalama na uendeshaji

- Admin authentication tofauti kabisa na access ya public; tumia MFA kwa admin
  na audit log ya login, mabadiliko ya kampuni/members/content, publish/unpublish
  na archive.
- Cookies zilindwe dhidi ya CSRF; weka CORS allowlist ya domains zinazotumika.
- Throttle login, inquiry, search, na media upload routes.
- Limitia request body na image dimensions/filesize; validate URL fields na
  rich text; sanitize output.
- Admin edits ziwe na `updatedAt`/`updatedBy`; tumia `ETag` au version field
  kuzuia admin mmoja kufuta mabadiliko ya mwingine bila kujua.
- Public GET responses ziwe cacheable (CDN/ETag); invalidate cache baada ya
  publish, unpublish, au mabadiliko ya settings.
- Usihifadhi passwords za admin bila password hashing inayokubalika, wala
  secrets kwenye frontend bundle.

## 7. Vigezo vya kukubali

1. Mgeni anaweza kuona published slides, divisions, na articles bila login.
2. Draft, archived, na scheduled content isiyoanza haionekani public.
3. Admin pekee anaweza kuunda/kuhariri/kuchapisha maudhui na kusoma inquiries.
4. Maudhui ya homepage yanabadilika kutoka admin bila kubuild upya frontend.
5. Fomu ya public inakataa data isiyo sahihi na inathibitisha wazi kupokelewa
   kwa ombi; haidai kuwa payment au membership imekamilika.
6. Makala na picha zina title/alt text inayohitajika; errors zina muundo wa
   kawaida na hazivuji data za admin.

## 8. Hatua za utekelezaji zinazopendekezwa

1. Kubaliana backend/database, admin identity provider, media storage, roles,
   na support ya lugha kabla ya kuanza implementation.
2. Tengeneza schema na seed content kwa data inayoonekana sasa; ainisha pia
   company, member, division, project, impact project na audit log.
3. Jenga public read endpoints na admin endpoints pamoja na auth, role checks,
   validation, dashboard aggregation, audit log na media upload.
4. Unganisha public React website na `GET /site/home`, article routes, na inquiry
   endpoint; tengeneza Tauri admin app kwa dashboard na admin resources. Zote
   zionyeshe loading/error/empty states.
5. Jaribu role authorization, publish scheduling, rate limiting, media
   validation, session storage ya Tauri, na kutovuja kwa draft/private content
   kabla ya production.

Hakuna backend endpoint katika proposal hii inayodhaniwa kuwa tayari ipo au
imeunganishwa kwenye website/Tauri app. Admin Dashboard reference ni mwongozo
wa scope na UX; idadi za dashboard kwenye picha si data ya production.
