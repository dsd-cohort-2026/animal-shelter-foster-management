/**
 * @fileoverview Centralized medical log enrichment utilities.
 * ALL enrichment logic lives here - don't duplicate in components or slices.
 *
 * These are pure functions that take raw data and return enriched data.
 * No side effects, no API calls, no dependencies on React or state management.
 */

/**
 * Enrich a single medical log with related data.
 *
 * @param {Object} log - Raw medical log
 * @param {Map<string, string>} animalMap - Map of animal_id -> animal_name
 * @param {Map<string, string>} userMap - Map of user_id -> user_display_name
 * @returns {Object} Enriched log with animal_name, foster_user_name, is_orphaned
 */
export function enrichMedicalLog(log, animalMap, userMap, userRoleMap) {
  const animalName = animalMap?.get(log.animal_id);
  const fosterUserName = userMap?.get(log.foster_user_id);
  const fosterUserRole = userRoleMap?.get(log.foster_user_id);

  return {
    ...log,
    animal_name: animalName || '—',
    foster_user_name: fosterUserName || '—',
    foster_user_role: fosterUserRole || null,
    is_orphaned: !animalName,
  };
}

/**
 * Enrich an array of medical logs with related data.
 * This is the main function - use this instead of enrichMedicalLog when possible.
 *
 * @param {Array<Object>} logs - Array of raw medical logs
 * @param {Array<Object>} animals - Array of animal objects (must have id and name)
 * @param {Array<Object>} [users=[]] - Array of user objects (must have id, first_name, last_name, email)
 * @returns {Array<Object>} Enriched logs
 *
 * @example
 * const logs = await fetchMedicalLogs();
 * const animals = await fetchAnimals();
 * const users = await fetchUsers();
 * const enriched = enrichMedicalLogs(logs, animals, users);
 */
export function enrichMedicalLogs(logs, animals, users = []) {
  // Build lookup maps for O(1) access
  const animalMap = new Map(animals.map((a) => [a.id, a.name]));
  const userMap = new Map(
    users.map((u) => [
      u.id,
      `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email || '—',
    ])
  );
  const userRoleMap = new Map(users.map((u) => [u.id, u.role]));

  return logs.map((log) => enrichMedicalLog(log, animalMap, userMap, userRoleMap));
}

/**
 * Build lookup maps for enrichment.
 * Use this if you need to enrich logs one at a time (rare).
 *
 * @param {Array<Object>} animals - Array of animal objects
 * @param {Array<Object>} [users=[]] - Array of user objects
 * @returns {{ animalMap: Map, userMap: Map }} Lookup maps
 */
export function buildEnrichmentMaps(animals, users = []) {
  return {
    animalMap: new Map(animals.map((a) => [a.id, a.name])),
    userMap: new Map(
      users.map((u) => [
        u.id,
        `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email || '—',
      ])
    ),
  };
}
