/**
 * Finds duplicate elements in an array based on the provided identifier function.
 *
 * ```js
 * const items = [
 *   { id: 1, name: 'item1' },
 *   { id: 2, name: 'item2' },
 *   { id: 1, name: 'item3' },
 *   { id: 4, name: 'item4' },
 *   { id: 2, name: 'item5' }
 * ];
 * const duplicates = getDuplicates(items, item => item.id);
 * console.log(duplicates);
 * // Output: [{ id: 1, name: 'item3' }, { id: 2, name: 'item5' }]
 * ```
 *
 * @template T
 * @param {Array<T>} array - The array to search for duplicates.
 * @param {(value: T) => any} identifier - A function that returns a unique identifier for each element.
 * @returns {Array<T>} - An array of duplicate elements.
 */
export function getDuplicates(array, identifier) {
  if (array.length < 2) {
    return [];
  }

  const seen = {};
  return array.filter(function (currentObject) {
    return (
      seen.hasOwnProperty(identifier(currentObject)) ||
      (seen[identifier(currentObject)] = false)
    );
  });
}

/**
 * Returns a new array of unique elements based on the provided identifier function.
 *
 * ```js
 * const items = [
 *   { id: 1, name: 'item1' },
 *   { id: 2, name: 'item2' },
 *   { id: 1, name: 'item3' },
 *   { id: 4, name: 'item4' },
 *   { id: 2, name: 'item5' }
 * ];
 * const uniqueItems = uniqueBy(items, item => item.id);
 * console.log(uniqueItems);
 * // Output: [{ id: 1, name: 'item3' }, { id: 2, name: 'item5' }, { id: 4, name: 'item4' }]
 * ```
 *
 * @template {any} T
 * @export
 * @param {Array<T>} array - The array to filter for unique elements.
 * @param {(data: T) => any} identifier - A function that returns a unique identifier for each element.
 * @returns {Array<T>} - An array of unique elements.
 */
export function uniqueBy(array, identifier) {
  const uniques = {};
  array.forEach((a) => (uniques[identifier(a)] = a));
  return Object.values(uniques);
}

/**
 * Returns a new array of unique values created by applying the provided identifier function to each element.
 *
 * ```js
 * const items = [
 *   { id: 1, name: 'item1' },
 *   { id: 2, name: 'item2' },
 *   { id: 1, name: 'item3' },
 *   { id: 4, name: 'item4' },
 *   { id: 2, name: 'item5' }
 * ];
 * const uniqueValues = uniqueValuesBy(items, item => item.id);
 * console.log(uniqueValues);
 * // Output: [1, 2, 4]
 * ```
 *
 * @template {any} T
 * @template {any} G
 * @export
 * @param {Array<T>} array - The array to filter for unique values.
 * @param {(data: T) => G} identifier - A function that returns a transformed value for each element.
 * @returns {Array<G>} - An array of unique values.
 */
export function uniqueValuesBy(array, identifier) {
  const uniques = uniqueBy(array, identifier);
  return uniques.map((unique) => identifier(unique));
}
