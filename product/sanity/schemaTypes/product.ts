import {defineType, defineField} from 'sanity'

export const product = defineType({
    //create variable to be used later in index.ts

    // basic info:name,title,type
    name:'product',
    title:'Product',
    type:'document',

    fields:[
        defineField({name:'name',
            title:'Product Name',
            type:'string'}),

        defineField({name:'slug',
            title:'Slug',
            type:'slug',
            options:{source:'name',maxLength:90}}),

        defineField({name:'price',
            title:'Price',
            type:'number'}),

        defineField({name:'image',
            title:'Image',
            type:'image',
            options:{hotspot:true}}),

        defineField({name:'description',
            title:'Product description',
            type:'text'}),
        //for the filters references any document of type category 
        defineField({name:'category',
            title:'Category',
            type:'reference',
            to:[{type:'string'}],}),

        defineField({name:'stock',
            title:'available',
            type:'boolean',
             initialValue:true}),
        






    ],

}
)