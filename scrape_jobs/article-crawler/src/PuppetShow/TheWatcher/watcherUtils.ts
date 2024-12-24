import isEmpty from 'lodash/isEmpty';
/**
 * Check an object to be undefined/null/empty-object/blank-string
 * @param {any} toCheck:T object to check
 * @returns {any} boolean: true if needs to be log
 */
function checkObjectToLog(toCheck: any): boolean {
  return !toCheck || isEmpty(toCheck) || toCheck === '';
}

export { checkObjectToLog };
