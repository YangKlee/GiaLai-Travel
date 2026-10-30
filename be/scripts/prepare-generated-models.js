import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function prepareGeneratedModels(directory) {
  const file = join(directory, 'init-models.js');
  let source = readFileSync(file, 'utf8');
  source = source.replace(/(_\w+)\.init\(sequelize, DataTypes\)/g, 'initializeModel($1, sequelize, DataTypes)');
  if (!source.includes("from '../model-runtime.js'")) source = "import { initializeModel } from '../model-runtime.js';\n" + source;
  // Composite FK ownership stays enforced in DB and in the repository predicate.
  source = source.split(/\r?\n/).filter((line) => !/ContentItems.belongsTo\(ContentRevisions, \{ as: "id_content_revision"|ContentRevisions.hasOne\(ContentItems, \{ as: "content_item"/.test(line)).join('\n');
  writeFileSync(file, source);
}
