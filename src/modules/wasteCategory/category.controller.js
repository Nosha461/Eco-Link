import { asyncHandler } from '../../utils/error/index.js';
import * as categoryService from './category.service.js';

export const create = asyncHandler(async (req, res) => {
  const category = await categoryService.addCategory(req.body);
  res.status(201).json({ success: true, data: category });
});

export const remove = asyncHandler(async (req, res) => {
  const result = await categoryService.removeCategory(req.params.id);
  res.status(200).json({ success: true, data: result });
});
