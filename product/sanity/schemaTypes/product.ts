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

    // fixed this - was "string" before which was wrong, needs to reference the category schema
    defineField({
      name: "category",title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),

    // added skin type for the filtering system
    defineField({
      name: "skinType",
      title: "Skin Type",
      type: "array",
      of: [{ type: "string" }],
      options:{
        list: [
          {title:"Normal",value:"normal"},
          {title:"Oily",value:"oily"},
          {title:"Dry",value:"dry"},
          {title:"Combination",value:"combination"},
          {title:"Sensitive",value:"sensitive"},
          {title:"All Skin Types",value:"all"},
        ]
      }
    }),

    // added ingredients - needed for the ingredient filter
    defineField({
      name: "ingredients",
      title: "Key Ingredients",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Hyaluronic Acid", value: "hyaluronic-acid" },
          { title: "Vitamin C", value: "vitamin-c" },
          { title: "Retinol", value: "retinol" },
          { title: "Niacinamide", value: "niacinamide" },
          { title: "Salicylic Acid", value: "salicylic-acid" },
          { title: "Ceramides", value: "ceramides" },
          { title: "AHA/BHA", value: "aha-bha" },
          { title: "SPF", value: "spf" },
          { title: "Aloe Vera", value: "aloe-vera" },
          { title: "Tea Tree", value: "tea-tree" },
          { title: "Peptides", value: "peptides" },
          { title: "Squalane", value: "squalane" },
        ],
      },
    }),

    defineField({
      name: "stock",
      title: "available",
      type: "boolean",
      initialValue: true,
    }),
  ],
});