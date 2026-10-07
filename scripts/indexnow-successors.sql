-- Retired boats with a live successor (yacht_successor, backend V9_73), one JSON object per line, for
-- scripts/indexnow-successor-urls.mjs (owner decision 7.10.2026). Read-only; names only, never the agency.
-- Manufacturer via the model, as the list API, the sitemaps and the boat page build the slug (SlugUtils).
--
--   scp scripts/indexnow-successors.sql cusma4:/tmp/
--   ssh -t cusma4 'sudo -u postgres psql -d boat4you_db -X -q -At -v ON_ERROR_STOP=1 \
--     -f /tmp/indexnow-successors.sql -o /tmp/successors.jsonl'
--   scp cusma4:/tmp/successors.jsonl .
SET default_transaction_read_only = on;

SELECT json_build_object(
         'oldId', o.id, 'oldManufacturer', omf.name, 'oldModel', om.name, 'oldName', o.name,
         'newId', n.id, 'newManufacturer', nmf.name, 'newModel', nm.name, 'newName', n.name)
FROM yacht_successor s
JOIN yacht o               ON o.id = s.old_id
LEFT JOIN model om         ON om.id = o.model_id
LEFT JOIN manufacturer omf ON omf.id = om.manufacturer_id
JOIN yacht n               ON n.id = s.new_id
LEFT JOIN model nm         ON nm.id = n.model_id
LEFT JOIN manufacturer nmf ON nmf.id = nm.manufacturer_id
WHERE NOT o.sys_active
  AND n.sys_active
ORDER BY s.old_id;
