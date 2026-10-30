import { randomUUID } from 'node:crypto';
import { registrationSchema } from '../../shared/credentials.js';
import { hashPassword } from '../../shared/password.js';
import { appendAudit } from '../../shared/audit.js';

export async function bootstrapAdmin(database, input) {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) throw new Error('INVALID_BOOTSTRAP_INPUT');
  const { email, password, displayName } = parsed.data;
  const passwordHash = await hashPassword(password);
  const id = randomUUID();
  try {
    await database.transaction(async (transaction) => {
      await database.models.Users.create({ id, email, password_hash: passwordHash, display_name: displayName }, { transaction });
      await database.models.UserRoles.create({ user_id: id, role_code: 'ADMIN' }, { transaction });
      await appendAudit(database, transaction, { actorId: id, action: 'ADMIN_BOOTSTRAP', targetType: 'USER', targetId: id, requestId: randomUUID() });
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') throw new Error('ACCOUNT_ALREADY_EXISTS_NO_ROLE_CHANGED');
    throw error;
  }
  return { id, role: 'ADMIN' };
}
