-- ============================================================================
-- One-off fix: make product photo URLs domain-independent.
--
-- The first seed hardcoded https://g-gorgeous.pages.dev, which stopped
-- resolving when that Cloudflare project was deleted. Root-relative paths
-- work on whatever domain the site is served from, including a custom
-- domain later.
--
-- Run once in the SQL Editor. Safe to run again - it does nothing the
-- second time.
-- ============================================================================

update public.product_media
   set url = '/assets/img/products/' || split_part(url, '/assets/img/products/', 2)
 where url like 'http%/assets/img/products/%';

-- check: every row should now start with /assets/
select
  count(*)                                              as total,
  count(*) filter (where url like '/assets/img/%')      as relative_ok,
  count(*) filter (where url like 'http%')              as still_absolute
from public.product_media;
