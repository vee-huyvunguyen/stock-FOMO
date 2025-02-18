import _ from 'lodash';
/**
 * Check an object to be undefined/null/empty-object/blank-string
 * @param {any} toCheck:T object to check
 * @returns {any} boolean: true if needs to be log
 */
function isNotValuable(toCheck: object): boolean {
  return !toCheck || _.isEmpty(toCheck) || String(toCheck) === '';
}

export { isNotValuable };
