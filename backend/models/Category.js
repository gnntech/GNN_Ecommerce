const mongoose = require("mongoose");

/**
 * Category model — drives the Navbar "Products" dropdown dynamically.
 * Admin can add/edit/remove categories from the dashboard without any
 * code changes. The frontend fetches this list on mount.
 *
 * Fields:
 *   name      — display label  e.g. "Gemstones"
 *   slug      — URL path       e.g. "/collection"
 *   icon      — lucide icon name (optional) e.g. "Gem"
 *   sortOrder — controls dropdown order (lower = first)
 *   isActive  — false = hidden from navbar
 */
const categorySchema = new mongoose.Schema(
    {
        name:      { type: String, required: true, trim: true },
        slug:      { type: String, required: true, trim: true }, // e.g. "/bracelets"
        icon:      { type: String, default: "" },                // lucide icon name
        sortOrder: { type: Number, default: 0 },
        isActive:  { type: Boolean, default: true },
    },
    { timestamps: true }
);

categorySchema.index({ sortOrder: 1 });
categorySchema.index({ isActive: 1 });

module.exports = mongoose.model("Category", categorySchema);
