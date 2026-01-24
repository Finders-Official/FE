// 1. auth
export type {
  SocialoginCompleteData,
  EmptyObject,
  SocialoginCompleteReq,
} from "./oauth.api";
export { oauth } from "./oauth.api";

//2. signUp
export type {
  AgreementItem,
  SocialSignupCompleteData,
  SocialSignupCompleteReq,
} from "./signUp.api";
export { socialSignup } from "./signUp.api";
