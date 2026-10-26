# Local SQL Test Database

This SQLite database is a standalone sandbox. It is not connected to the website or a production service. Seed rows use synthetic names and reserved `.test` email addresses.

From the workspace root, create and seed the database:

```sh
sqlite3 database/test.db < database/schema.sql
sqlite3 database/test.db < database/seed.sql
```

Run integrity checks and example queries:

```sh
sqlite3 database/test.db < database/tests.sql
```

The schema has checks for application type, required fields, consent, and status. Edit `seed.sql` to add more synthetic test records, then rerun it. Seed inserts are idempotent by their fixed IDs.
