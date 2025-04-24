import { defineField, defineType } from 'sanity';

export const Course = defineType({
  name: 'course',
  title: 'Video Courses',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Course Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(3).max(100),
      description: 'The name of the course.',
    }),
    defineField({
      name: 'image',
      title: 'Course Image',
      type: 'image',
      options: {
        hotspot: true, // Enable image hotspot for cropping
      },
      validation: (Rule) => Rule.required(),
      description: 'An image representing the course.',
    }),
    defineField({
      name: 'dateRange',
      title: 'Date Range',
      type: 'object',
      description: 'Optional start and end dates for the course.',
      fields: [
        defineField({
          name: 'startDate',
          title: 'Start Date',
          type: 'date',
          options: {
            dateFormat: 'YYYY-MM-DD',
          },
        }),
        defineField({
          name: 'endDate',
          title: 'End Date',
          type: 'date',
          options: {
            dateFormat: 'YYYY-MM-DD',
          },
        }),
      ],
      validation: (Rule) =>
        Rule.custom((fields: { startDate?: string; endDate?: string } | undefined) => {
          if (!fields || (!fields.startDate && !fields.endDate)) return true; // Optional, so valid if both are empty
          if (fields.startDate && fields.endDate && fields.startDate > fields.endDate) {
            return 'End date must be after start date.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Lesson Name',
              type: 'string',
              validation: (Rule) => Rule.required().min(3).max(100),
              description: 'The name of the lesson.',
            }),
            defineField({
              name: 'video',
              title: 'Lesson Video',
              type: 'file',
              description: 'Upload a video file for the lesson.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'publishedDate',
              title: 'Published Date',
              type: 'date',
              options: {
                dateFormat: 'YYYY-MM-DD',
              },
              validation: (Rule) => Rule.required(),
              description: 'The date the lesson was published.',
            }),
          ],
        },
      ],
      description: 'An optional list of lessons for the course.',
      // No validation needed; arrays are optional by default
    }),
  ],
});