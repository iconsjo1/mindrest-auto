class CommandGenerator {
 #makeCommand(commandParts, values) {
  return commandParts.reduce((acc, _, i) => acc + commandParts[i] + (i < values.length ? values[i] : ''), '');
 }

 createUpdateCommand(tableName, ...rest) {
  const sqlUpdateCommandParts = ['UPDATE ', ' SET ', ' WHERE ', ' RETURNING *'];
  return this.#makeCommand(sqlUpdateCommandParts, [tableName, ...rest]);
 }

 createInsertCommand(tableName, ...rest) {
  const sqlInsertCommandParts = ['INSERT INTO ', '(', ') VALUES (', ') RETURNING *'];
  return this.#makeCommand(sqlInsertCommandParts, [tableName, ...rest]);
 }

 createDeleteCommand(tableName, ...rest) {
  const sqlDeleteCommandParts = ['DELETE FROM ', ' WHERE ', ' RETURNING *'];
  return this.#makeCommand(sqlDeleteCommandParts, [tableName, ...rest]);
 }
}

class SQLfeatures {
 static IDFilters(idFilters) {
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
  return { filtersArr: conditionSet, filters: conditionSet.join(' AND '), values: valueSet };
 }

 static update({ filters, ...setData }, tableName) {
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

  return undefined === tableName
   ? { sets, values: valueSet, filters: filterSet.join(' AND ') }
   : [new CommandGenerator().createUpdateCommand(tableName, sets, filterSet.join(' AND ')), valueSet];
 }
 static bulkInsert(arrobj, keyFieldsOBJ) {
  const values = [];
  const bulkKeyFields = [];
  const fields = [...new Set(arrobj.flatMap(o => Object.keys(o)))];

  const prepareBulkGenerator = function* (arrobj) {
   let sanitizingIndex = 0;

   const encKeyFields = [];

   if (undefined !== keyFieldsOBJ)
    for (const key in keyFieldsOBJ) {
     encKeyFields.push(`$${++sanitizingIndex}`);
     values.push(keyFieldsOBJ[key]);
     bulkKeyFields.push(key);
    }

   const keyEnc = encKeyFields.reduce((acc, enc) => `${acc + enc}, `, '');

   const setPrefixComma = val => (0 < val ? ', ' : '');

   for (let i = 0; i < arrobj.length; i++) {
    yield setPrefixComma(i) + `(${keyEnc}`;

    for (let j = 0; j < fields.length; j++) {
     const v = arrobj[i][fields[j]];
     const yret = setPrefixComma(j);

     if ('%DEFAULT%' === v) {
      yield `${yret}DEFAULT`;
     } else {
      values.push(v);
      yield `${yret}$${++sanitizingIndex}`;
     }
    }

    yield ')';
   }
  };

  return { rows: [...prepareBulkGenerator(arrobj)].join(''), values, fields: [...bulkKeyFields, ...fields] };
 }

 static insert(body, tableName) {
  const fields = Object.keys(body);
  const $enc = fields.map((_, i) => `$${i + 1}`);

  return [new CommandGenerator().createInsertCommand(tableName, fields, $enc), Object.values(body)];
 }

 static delete({ filters }, tableName) {
  const filterSet = ['1=1'];
  const valueSet = [];

  for (let i = 0, keys = Object.keys(filters); i < keys.length; i++) {
   const k = keys[i];

   filterSet.push(`${k} = $${i + 1}`);
   valueSet.push(filters[k]);
  }

  return [new CommandGenerator().createDeleteCommand(tableName, filterSet.join(' AND ')), valueSet];
 }
}

module.exports = SQLfeatures;
