import { fn } from 'sequelize';

export function initializeModel(Source, sequelize, types) {
  const RuntimeModel = class extends Source {};
  Object.defineProperty(RuntimeModel, 'name', { value: Source.name });
  const model = RuntimeModel.init(sequelize, types);
  for (const attribute of Object.values(model.rawAttributes)) {
    if (attribute.defaultValue === 'CURRENT_TIMESTAMP(6)') attribute.defaultValue = fn('UTC_TIMESTAMP', 6);
  }
  model.refreshAttributes();
  return model;
}
