const validateAddCategory = (body) => {
  const { name, description } = body || {};
  if (!name || !String(name).trim()) return 'Name is required';
  if (!description || !String(description).trim()) return 'Description is required';
  return null;
};

/** Use second arg `req` so DELETE with empty body still reads `req.params.id`. */
const validateCategoryIdParam = (_data, req) => {
  const id = req?.params?.id;
  if (!id || !String(id).trim()) return 'Category id is required';
  return null;
};

export { validateAddCategory, validateCategoryIdParam };
