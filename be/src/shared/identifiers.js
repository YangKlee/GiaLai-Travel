import { randomUUID } from 'node:crypto';
import { z } from 'zod';

export const createId = () => randomUUID();
export const guidSchema = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
