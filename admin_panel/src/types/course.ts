export type Course = {
    _id: string; // Added by Sanity for all documents
    _type: 'course'; // Matches schema name
    _createdAt?: string; // Optional, added by Sanity
    _updatedAt?: string; // Optional, added by Sanity
    name: string; // Required string
    image: {
      _type: 'image';
      asset: {
        _ref: string;
        _type: 'reference';
      };
      hotspot?: {
        x: number;
        y: number;
        height: number;
        width: number;
      };
      crop?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
      };
    }; // Required image
    dateRange?: {
      startDate?: string; // Optional date (YYYY-MM-DD)
      endDate?: string; // Optional date (YYYY-MM-DD)
    }; // Optional object
    lessons?: {
      name: string; // Required string
      video: {
        _type: 'file';
        asset: {
          _ref: string;
          _type: 'reference';
        };
      }; // Required file
      publishedDate: string; // Required date (YYYY-MM-DD)
    }[]; // Optional array
  };