-- Ads-tabellerna nås bara via /api/ads-* med server-side secret key.
-- Ta bort anon-policyerna så att den publika anon-nyckeln inte ger åtkomst.
drop policy if exists anon_read_pending        on public.ads_decisions;
drop policy if exists anon_update_status       on public.ads_decisions;
drop policy if exists anon_insert_performance  on public.ads_performance;
drop policy if exists anon_select_performance  on public.ads_performance;
drop policy if exists anon_update_performance  on public.ads_performance;
drop policy if exists anon_insert_search_terms on public.ads_search_terms;
drop policy if exists anon_select_search_terms on public.ads_search_terms;
drop policy if exists anon_update_search_terms on public.ads_search_terms;

revoke all on public.ads_decisions, public.ads_performance, public.ads_search_terms from anon;
