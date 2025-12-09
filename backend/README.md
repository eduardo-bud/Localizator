Backend models generated from `banco_integrador.sql`.

Quick start:

1. Install dependencies in `backend`:

```
npm init -y
npm install sequelize sqlite3
```

2. Configure DB via environment variables (optional):
- `DB_DIALECT` (default: `sqlite`)
- `DB_STORAGE` (default: `database.sqlite`)

3. Use models from `backend/models/index.js`:

```js
const { sequelize, Material, Usuario } = require('./models');
await sequelize.authenticate();
```

Notes:
- Models were generated based on the provided SQL file and some assumptions due to inconsistent/malformed SQL (composite keys and duplicate table definitions). Review associations and adapt to your exact schema.
