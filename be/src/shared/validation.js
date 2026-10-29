import { AppError } from './app-error.js';

export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const fields = result.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }));
      return next(new AppError(422, 'VALIDATION_ERROR', 'Dữ liệu không hợp lệ.', fields));
    }
    // Express 5 req.query is a getter; retain parsed input separately.
    req.validated = { ...req.validated, [source]: result.data };
    next();
  };
}
