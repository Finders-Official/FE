export { getLikedPosts } from "./likedPost.api";
export { getMyPosts } from "./myPost.api";
export { favoritePhotoLab } from "./likedPhotoLab";

//notices
export { getNoticeList } from "./notices/getNoticeList";
export { getNoticeDetail } from "./notices/getNoticeList";

//inquiries
export { getInquiries, postInquiry } from "./inquiries/inquiries";

//devices
export {
  getDeviceList,
  deleteDevice,
  getCameraCatalog,
  getFilmCatalog,
  postCreateDevice,
  patchUpdateDevice,
} from "./devices/device";
