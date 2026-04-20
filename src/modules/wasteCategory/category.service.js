import { Waste } from '../../DB/models/waste.model.js';
import { WasteCategory } from '../../DB/models/wasteCategory.model.js';

export const addCategory = async (payload) => {
  const name = String(payload.name).trim();
  const description = String(payload.description).trim();

  const duplicate = await WasteCategory.findOne({ name });
  if (duplicate) {
    throw new Error('Category name already exists', { cause: 409 });
  }

  const category = await WasteCategory.create({ name, description });
  return category;
};

export const removeCategory = async (categoryId) => {
  const category = await WasteCategory.findById(categoryId);
  if (!category) {
    throw new Error('Category not found', { cause: 404 });
  }

  const inUse = await Waste.exists({ category: categoryId });
  if (inUse) {
    throw new Error('Cannot delete category while waste listings still reference it', { cause: 400 });
  }

  await category.deleteOne();
  return { deleted: true, id: categoryId };
};
