/**
 * Sanity.io Category Schema Definition
 *
 * Defines the Category document type for Sanity CMS content modeling.
 * Categories are used to organize and classify products in the e-commerce system.
 *
 * @module SanitySchemas/Category
 * @constant {Object} category - Sanity schema configuration
 *
 * @example
 * // Content structure in Sanity Studio:
 * {
 *   "name": "Skincare",
 *   "description": "Products for skin care and maintenance"
 * }
 *
 * @features
 * - Simple category structure with name and description
 * - Searchable and filterable in Sanity Studio
 * - Can be referenced by product documents
 *
 * @dependencies
 * - sanity: Sanity.io CMS framework
 *
 * @see {@link product} For product schema that references categories
 */

import { defineType, defineField } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Category Name", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
  ],
});
