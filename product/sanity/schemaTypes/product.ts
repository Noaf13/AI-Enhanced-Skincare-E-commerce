/**
 * Sanity.io Product Schema Definition
 *
 * Defines the Product document type for Sanity CMS content modeling.
 * Contains all product information including pricing, images, descriptions,
 * and categorization for the e-commerce platform.
 *
 * @module SanitySchemas/Product
 * @constant {Object} product - Sanity schema configuration
 *
 * @example
 * // Example product document structure:
 * {
 *   "name": "Premium Moisturizer",
 *   "slug": { "current": "premium-moisturizer" },
 *   "price": 29.99,
 *   "image": { ...imageAsset },
 *   "description": "Hydrating moisturizer for all skin types",
 *   "category": { "_ref": "skincare", "_type": "reference" },
 *   "stock": true
 * }
 *
 * @features
 * - Complete product information for e-commerce
 * - Image optimization with hotspot support
 * - Category reference for organization
 * - Stock availability tracking
 * - SEO-friendly slugs
 *
 * @dependencies
 * - sanity: Sanity.io CMS framework
 * - category: Reference to category schema
 *
 * @see {@link category} For referenced category schema
 */

import { defineType, defineField } from "sanity";

export const product = defineType({
  //create variable to be used later in index.ts

  // basic info:name,title,type
  name: "product",
  title: "Product",
  type: "document",

  fields: [
    defineField({ name: "name", title: "Product Name", type: "string" }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 90 },
    }),

    defineField({ name: "price", title: "Price", type: "number" }),

    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "description",
      title: "Product description",
      type: "text",
    }),
    //for the filters references any document of type category
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "string" }],
    }),

    defineField({
      name: "stock",
      title: "available",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
