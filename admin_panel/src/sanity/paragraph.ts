import { defineField, defineType } from 'sanity';

export const Introduction = defineType({
  name: 'introduction',
  title: 'Introduction Paragraph',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'Paragraph',
      type: 'text', // Multi-line text for paragraphs
      description: 'Enter the paragraph content here.',
    }),
  ],
});