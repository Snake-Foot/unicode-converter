/* Bulk input cost-control rules. Render-on-type is reserved for short lists.
 * Larger lists are edited freely and committed explicitly by the user. */
const BULK_AUTO_RENDER_LIMIT = 30;
const BULK_AUTO_RENDER_DELAY_MS = 450;

function countBulkUnicodeTokens(raw) {
  const source = String(raw || "").trim();
  return source ? source.split(/[\s,]+/).filter(Boolean).length : 0;
}

function bulkUnicodeRequiresManualApply(raw) {
  return countBulkUnicodeTokens(raw) > BULK_AUTO_RENDER_LIMIT;
}
