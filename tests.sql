-- Run with: sqlite3 database/test.db < database/tests.sql
PRAGMA integrity_check;

SELECT 'seed_rows' AS test,
       CASE WHEN COUNT(*) = 3 THEN 'PASS' ELSE 'FAIL' END AS result
FROM applications;

SELECT 'consent_required' AS test,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS result
FROM applications
WHERE consent <> 1;

SELECT 'allowed_statuses' AS test,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS result
FROM applications
WHERE status NOT IN ('pending', 'approved', 'rejected');

-- Example application lookup; change the type to 'tribune' to test the other flow.
SELECT id, application_type, first_name, last_name, status, created_at
FROM applications
WHERE application_type = 'competitor'
ORDER BY created_at DESC;

-- Summary by application type and status.
SELECT application_type, status, COUNT(*) AS total
FROM applications
GROUP BY application_type, status
ORDER BY application_type, status;
