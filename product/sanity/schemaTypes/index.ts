import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product'
import { category } from './category'
import {order} from './Orders'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product,category,order]
}
