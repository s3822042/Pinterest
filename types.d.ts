export interface IUser {
  _id: string;
  _type: string;
  userName: string;
  image: string;
}

export interface Pin {
  title: string;
  about: string;
  _id: string;
  image: {
    asset: {
      _id: string;
      url: string;
    };
  };
  postedBy: {
    _id: string;
    userName: string;
    image: string;
  };
  save: {
    userId: string;
    _key: string;
    postedBy: {
      _id: string;
      userName: string;
      image: string;
    };
  }[];
  comments: {
    comment: string;
    _key: string;
    postedBy: {
      _ref: string;
    };
  }[];
  userId: string;
}
