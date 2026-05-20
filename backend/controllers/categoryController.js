const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");

// @desc  Get all active categories (public — used by Navbar)
// @route GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ sortOrder: 1 });
    res.json(categories);
});

// @desc  Create a category
// @route POST /api/categories
// @access Private/Admin
const createCategory = asyncHandler(async (req, res) => {
    const { name, slug, icon, sortOrder, isActive } = req.body;
    if (!name || !slug) { res.status(400); throw new Error("name and slug are required"); }

    const exists = await Category.findOne({ slug });
    if (exists) { res.status(400); throw new Error(`Category with slug "${slug}" already exists`); }

    const category = await Category.create({
        name,
        slug,
        icon:      icon      || "",
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
        isActive:  isActive  !== undefined ? Boolean(isActive) : true,
    });
    res.status(201).json(category);
});

// @desc  Update a category
// @route PUT /api/categories/:id
// @access Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
    const cat = await Category.findById(req.params.id);
    if (!cat) { res.status(404); throw new Error("Category not found"); }

    const { name, slug, icon, sortOrder, isActive } = req.body;
    if (name      !== undefined) cat.name      = name;
    if (slug      !== undefined) cat.slug      = slug;
    if (icon      !== undefined) cat.icon      = icon;
    if (sortOrder !== undefined) cat.sortOrder = Number(sortOrder);
    if (isActive  !== undefined) cat.isActive  = Boolean(isActive);

    res.json(await cat.save());
});

// @desc  Delete a category
// @route DELETE /api/categories/:id
// @access Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
    const cat = await Category.findById(req.params.id);
    if (!cat) { res.status(404); throw new Error("Category not found"); }
    await cat.deleteOne();
    res.json({ message: "Category removed" });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
