/**
 * Simple offset/limit pagination for list endpoints.
 */

export function parsePagination(query) {
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const page = Math.max(1, Number(query.page) || 1);
  const offset = (page - 1) * limit;
  return { limit, page, offset };
}

export function buildPageResponse(items, { total, page, limit }) {
  return {
    data: items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}
