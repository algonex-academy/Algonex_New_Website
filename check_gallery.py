import sqlite3
import json

conn = sqlite3.connect('algonex-backend/db.sqlite3')
conn.row_factory = sqlite3.Row

# Check for gallery table
cursor = conn.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%gallery%'")
tables = [r[0] for r in cursor.fetchall()]
print("Gallery tables:", tables)

# Also check for common_gallery or common_adminupload
cursor = conn.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%common%'")
common_tables = [r[0] for r in cursor.fetchall()]
print("Common tables:", common_tables)

# Try to read gallery data
for table in tables + common_tables:
    try:
        cursor = conn.execute(f"SELECT * FROM {table}")
        rows = cursor.fetchall()
        print(f"\n--- {table} ({len(rows)} rows) ---")
        for row in rows:
            print(dict(row))
    except Exception as e:
        print(f"Error reading {table}: {e}")

conn.close()
