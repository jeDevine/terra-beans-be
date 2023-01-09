import { ObjectId } from "mongodb";

export default interface Account {
  _id: ObjectId;
  uid: string;
  email: string;
  photoURL: string;
  displayName: string;
  uploadedPhotos: Photo[];
}

interface Photo {
  url: string;
  title: string;
  date: string;
}
