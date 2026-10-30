import { z } from 'zod';

export const emailSchema = z.string().trim().max(254).pipe(z.email({ error: 'Email chưa hợp lệ.' })).transform((email) => email.toLowerCase());
export const passwordSchema = z.string().min(12, 'Mật khẩu cần ít nhất 12 ký tự.').max(128, 'Mật khẩu tối đa 128 ký tự.');
export const displayNameSchema = z.string().trim().min(1, 'Nhập tên hiển thị.').max(150, 'Tên hiển thị tối đa 150 ký tự.');
export const registrationSchema = z.object({
  email: emailSchema, password: passwordSchema,
  displayName: displayNameSchema,
}).strict();
export const forgotPasswordSchema = z.object({
  email: emailSchema,
}).strict();
export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, 'Thiếu mã khôi phục mật khẩu.').max(200, 'Mã khôi phục mật khẩu không hợp lệ.'),
  password: passwordSchema,
}).strict();
