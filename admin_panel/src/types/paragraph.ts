export type Introduction = {
    _id: string; // Added by Sanity for all documents
    _type: 'introduction'; // Matches schema name
    _createdAt?: string; // Optional, added by Sanity
    _updatedAt?: string; // Optional, added by Sanity
    content?: string; // Optional multi-line text
  };