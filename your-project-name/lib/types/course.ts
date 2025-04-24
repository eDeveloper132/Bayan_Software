export type Course = {
    _id: string;
    _type: 'course';
    _createdAt?: string;
    _updatedAt?: string;
    name: string;
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
    };
    dateRange?: {
      startDate?: string;
      endDate?: string;
    };
    lessons?: {
      name: string;
      video: {
        _type: 'file';
        asset: {
          _ref: string;
          _type: 'reference';
        };
      };
      publishedDate: string;
    }[];
  };