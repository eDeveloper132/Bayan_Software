import { type SchemaTypeDefinition } from 'sanity'
import { Introduction } from '../paragraph'
import { Course } from '../courses'
import { AudioCourse } from '../audiocourses'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [Introduction,Course,AudioCourse],
}
