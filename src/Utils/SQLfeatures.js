module.exports = {
 IDFilters(idFilters) {
  const { isValidObject, isPositiveInteger } = require('.');

  const conditionSet = ['1=1'];
  const valueSet = [];

  if (!isValidObject(idFilters)) return { filters: conditionSet[0], values: [] };

  for (let i = 0, filterIndex = 0, keys = Object.keys(idFilters); i < keys.length; i++) {
   const k = keys[i];
   const v = idFilters[k];

   if (isPositiveInteger(v)) {
    conditionSet.push(`${k} = $${++filterIndex}`);
    valueSet.push(v);
   }
  }
  return { filters: conditionSet.join(' AND '), values: valueSet };
 },
 update({ filters, ...setData }) {
  const sets = [];
  const valueSet = [];
  let objIndex = 0;

  for (let i = 0, keys = Object.keys(setData); i < keys.length; i++) {
   const k = keys[i];

   sets.push(`${k} = $${++objIndex}`);
   valueSet.push(setData[k]);
  }

  const filterSet = ['1=1'];
  for (let i = 0, keys = Object.keys(filters); i < keys.length; i++) {
   const k = keys[i];

   filterSet.push(`${k} = $${++objIndex}`);
   valueSet.push(filters[k]);
  }

  return { sets: sets, values: valueSet, filters: filterSet.join(' AND ') };
 },
 bulkInsert(arrobj, keyFieldsOBJ = {}) {
  const values = [];
  const bulkKeyFields = [];
  const fields = [...new Set(arrobj.flatMap(o => Object.keys(o)))];

  const prepareBulkGenerator = function* (arrobj) {
   let sanitizingIndex = 0;

   const encKeyFields = [];

   if (0 < Object.keys(keyFieldsOBJ).length)
    for (const key in keyFieldsOBJ) {
     encKeyFields.push(`$${++sanitizingIndex}`);
     values.push(keyFieldsOBJ[key]);
     bulkKeyFields.push(key);
    }

   const keyEnc = encKeyFields.reduce((acc, enc) => (acc += enc + ', '), '');

   const setPrefixComma = val => (0 < val ? ', ' : '');

   for (let i = 0; i < arrobj.length; i++) {
    yield setPrefixComma(i) + `(${keyEnc}`;

    for (let j = 0; j < fields.length; j++) {
     values.push(arrobj[i][fields[j]]);
     yield setPrefixComma(j) + '$' + ++sanitizingIndex;
    }

    yield ')';
   }
  };

  return { rows: [...prepareBulkGenerator(arrobj)].join(''), values, fields: [...bulkKeyFields, ...fields] };
 },
};
