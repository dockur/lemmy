import {
  ApproveCommunityPendingFollower,
  BlockCommunity,
  BlockCommunityResponse,
  CommunityId,
  CommunityVisibility,
  CreatePrivateMessageReport,
  EditCommunity,
  GetCommunityPendingFollowsCountResponse,
  GetUnreadCountResponse,
  InstanceId,
  LemmyHttp,
  ListCommunityPendingFollows,
  ListCommunityPendingFollowsResponse,
  ListReports,
  ListReportsResponse,
  MyUserInfo,
  DeleteImageParams,
  PersonId,
  PostView,
  PrivateMessageReportResponse,
  SuccessResponse,
  UserBlockInstanceParams,
  ListPersonContentResponse,
  ListPersonContent,
  PersonContentType,
  ListInboxResponse,
  ListInbox,
  InboxDataType,
  GetModlogResponse,
  GetModlog,
} from "lemmy-js-client";
import { CreatePost } from "lemmy-js-client/dist/types/CreatePost";
import { DeletePost } from "lemmy-js-client/dist/types/DeletePost";
import { EditPost } from "lemmy-js-client/dist/types/EditPost";
import { EditSite } from "lemmy-js-client/dist/types/EditSite";
import { AdminAllowInstanceParams } from "lemmy-js-client/dist/types/AdminAllowInstanceParams";
import { FeaturePost } from "lemmy-js-client/dist/types/FeaturePost";
import { GetComments } from "lemmy-js-client/dist/types/GetComments";
import { GetCommentsResponse } from "lemmy-js-client/dist/types/GetCommentsResponse";
import { GetPost } from "lemmy-js-client/dist/types/GetPost";
import { GetPostResponse } from "lemmy-js-client/dist/types/GetPostResponse";
import { LockPost } from "lemmy-js-client/dist/types/LockPost";
import { Login } from "lemmy-js-client/dist/types/Login";
import { Post } from "lemmy-js-client/dist/types/Post";
import { PostResponse } from "lemmy-js-client/dist/types/PostResponse";
import { RemovePost } from "lemmy-js-client/dist/types/RemovePost";
import { ResolveObject } from "lemmy-js-client/dist/types/ResolveObject";
import { ResolveObjectResponse } from "lemmy-js-client/dist/types/ResolveObjectResponse";
import { Search } from "lemmy-js-client/dist/types/Search";
import { SearchResponse } from "lemmy-js-client/dist/types/SearchResponse";
import { Comment } from "lemmy-js-client/dist/types/Comment";
import { BanPersonResponse } from "lemmy-js-client/dist/types/BanPersonResponse";
import { BanPerson } from "lemmy-js-client/dist/types/BanPerson";
import { BanFromCommunityResponse } from "lemmy-js-client/dist/types/BanFromCommunityResponse";
import { BanFromCommunity } from "lemmy-js-client/dist/types/BanFromCommunity";
import { CommunityResponse } from "lemmy-js-client/dist/types/CommunityResponse";
import { FollowCommunity } from "lemmy-js-client/dist/types/FollowCommunity";
import { CreatePostLike } from "lemmy-js-client/dist/types/CreatePostLike";
import { CommentResponse } from "lemmy-js-client/dist/types/CommentResponse";
import { CreateComment } from "lemmy-js-client/dist/types/CreateComment";
import { EditComment } from "lemmy-js-client/dist/types/EditComment";
import { DeleteComment } from "lemmy-js-client/dist/types/DeleteComment";
import { RemoveComment } from "lemmy-js-client/dist/types/RemoveComment";
import { CreateCommentLike } from "lemmy-js-client/dist/types/CreateCommentLike";
import { CreateCommunity } from "lemmy-js-client/dist/types/CreateCommunity";
import { GetCommunity } from "lemmy-js-client/dist/types/GetCommunity";
import { DeleteCommunity } from "lemmy-js-client/dist/types/DeleteCommunity";
import { RemoveCommunity } from "lemmy-js-client/dist/types/RemoveCommunity";
import { PrivateMessageResponse } from "lemmy-js-client/dist/types/PrivateMessageResponse";
import { CreatePrivateMessage } from "lemmy-js-client/dist/types/CreatePrivateMessage";
import { EditPrivateMessage } from "lemmy-js-client/dist/types/EditPrivateMessage";
import { DeletePrivateMessage } from "lemmy-js-client/dist/types/DeletePrivateMessage";
import { LoginResponse } from "lemmy-js-client/dist/types/LoginResponse";
import { Register } from "lemmy-js-client/dist/types/Register";
import { SaveUserSettings } from "lemmy-js-client/dist/types/SaveUserSettings";
import { DeleteAccount } from "lemmy-js-client/dist/types/DeleteAccount";
import { GetSiteResponse } from "lemmy-js-client/dist/types/GetSiteResponse";
import { PostReportResponse } from "lemmy-js-client/dist/types/PostReportResponse";
import { CreatePostReport } from "lemmy-js-client/dist/types/CreatePostReport";
import { CommentReportResponse } from "lemmy-js-client/dist/types/CommentReportResponse";
import { CreateCommentReport } from "lemmy-js-client/dist/types/CreateCommentReport";
import { GetPostsResponse } from "lemmy-js-client/dist/types/GetPostsResponse";
import { GetPosts } from "lemmy-js-client/dist/types/GetPosts";
import { GetPersonDetailsResponse } from "lemmy-js-client/dist/types/GetPersonDetailsResponse";
import { GetPersonDetails } from "lemmy-js-client/dist/types/GetPersonDetails";
import { ListingType } from "lemmy-js-client/dist/types/ListingType";
import { GetCommunityPendingFollowsCountI } from "lemmy-js-client/dist/other_types";

export const fetchFunction = fetch;
export const imageFetchLimit = 50;
export const sampleImage =
  "https://i.pinimg.com/originals/df/5f/5b/df5f5b1b174a2b4b6026cc6c8f9395c1.jpg";
export const sampleSite = "https://w3.org";

export const alphaUrl = "http://127.0.0.1:8541";
export const betaUrl = "http://127.0.0.1:8551";
export const gammaUrl = "http://127.0.0.1:8561";
export const deltaUrl = "http://127.0.0.1:8571";
export const epsilonUrl = "http://127.0.0.1:8581";

export const alpha = new LemmyHttp(alphaUrl, { fetchFunction });
export const alphaImage = new LemmyHttp(alphaUrl);
export const beta = new LemmyHttp(betaUrl, { fetchFunction });
export const gamma = new LemmyHttp(gammaUrl, { fetchFunction });
export const delta = new LemmyHttp(deltaUrl, { fetchFunction });
export const epsilon = new LemmyHttp(epsilonUrl, { fetchFunction });

const password = "lemmylemmy";

export async function setupLogins() {
  let formAlpha: Login = {
    username_or_email: "lemmy_alpha",
    password,
  };
  let resAlpha = alpha.login(formAlpha);

  let formBeta: Login = {
    username_or_email: "lemmy_beta",
    password,
  };
  let resBeta = beta.login(formBeta);

  let formGamma: Login = {
    username_or_email: "lemmy_gamma",
    password,
  };
  let resGamma = gamma.login(formGamma);

  let formDelta: Login = {
    username_or_email: "lemmy_delta",
    password,
  };
  let resDelta = delta.login(formDelta);

  let formEpsilon: Login = {
    username_or_email: "lemmy_epsilon",
    password,
  };
  let resEpsilon = epsilon.login(formEpsilon);

  let res = await Promise.all([
    resAlpha,
    resBeta,
    resGamma,
    resDelta,
    resEpsilon,
  ]);
  alpha.setHeaders({ Authorization: `Bearer ${res[0].jwt ?? ""}` });
  alphaImage.setHeaders({ Authorization: `Bearer ${res[0].jwt ?? ""}` });
  beta.setHeaders({ Authorization: `Bearer ${res[1].jwt ?? ""}` });
  gamma.setHeaders({ Authorization: `Bearer ${res[2].jwt ?? ""}` });
  delta.setHeaders({ Authorization: `Bearer ${res[3].jwt ?? ""}` });
  epsilon.setHeaders({ Authorization: `Bearer ${res[4].jwt ?? ""}` });

  // Registration applications are now enabled by default, need to disable them
  let editSiteForm: EditSite = {
    registration_mode: "Open",
    rate_limit_message: 999,
    rate_limit_post: 999,
    rate_limit_register: 999,
    rate_limit_image: 999,
    rate_limit_comment: 999,
    rate_limit_search: 999,
  };
  await alpha.editSite(editSiteForm);
  await beta.editSite(editSiteForm);
  await gamma.editSite(editSiteForm);
  await delta.editSite(editSiteForm);
  await epsilon.editSite(editSiteForm);

  // Set the blocks for each
  await allowInstance(alpha, "lemmy-beta");
  await allowInstance(alpha, "lemmy-gamma");
  await allowInstance(alpha, "lemmy-delta");
  await allowInstance(alpha, "lemmy-epsilon");

  await allowInstance(beta, "lemmy-alpha");
  await allowInstance(beta, "lemmy-gamma");
  await allowInstance(beta, "lemmy-delta");
  await allowInstance(beta, "lemmy-epsilon");

  await allowInstance(gamma, "lemmy-alpha");
  await allowInstance(gamma, "lemmy-beta");
  await allowInstance(gamma, "lemmy-delta");
  await allowInstance(gamma, "lemmy-epsilon");

  await allowInstance(delta, "lemmy-beta");

  // Create the main alpha/beta communities
  // Ignore thrown errors of duplicates
  try {
    await createCommunity(alpha, "main");
    await createCommunity(beta, "main");
    // wait for > INSTANCES_RECHECK_DELAY to ensure federation is initialized
    // otherwise the first few federated events may be missed
    // (because last_successful_id is set to current id when federation to an instance is first started)
    // only needed the first time so do in this try
    await delay(10_000);
  } catch {
    //console.log("Communities already exist");
  }
}

export async function allowInstance(api: LemmyHttp, instance: string) {
  const params: AdminAllowInstanceParams = {
    instance,
    allow: true,
  };
  // Ignore errors from duplicate allows (because setup gets called for each test file)
  try {
    await api.adminAllowInstance(params);
  } catch {
    // console.error(error);
  }
}

export async function createPost(
  api: LemmyHttp,
  community_id: number,
  url: string = "https://example.com/",
  body = randomString(10),
  // use example.com for consistent title and embed description
  name: string = randomString(5),
  alt_text = randomString(10),
  custom_thumbnail: string | undefined = undefined,
): Promise<PostResponse> {
  let form: CreatePost = {
    name,
    url,
    body,
    alt_text,
    community_id,
    custom_thumbnail,
  };
  return api.createPost(form);
}

export async function editPost(
  api: LemmyHttp,
  post: Post,
): Promise<PostResponse> {
  let name = "A jest test federated post, updated";
  let form: EditPost = {
    name,
    post_id: post.id,
  };
  return api.editPost(form);
}

export async function createPostWithThumbnail(
  api: LemmyHttp,
  community_id: number,
  url: string,
  custom_thumbnail: string,
): Promise<PostResponse> {
  let form: CreatePost = {
    name: randomString(10),
    url,
    community_id,
    custom_thumbnail,
  };
  return api.createPost(form);
}

export async function deletePost(
  api: LemmyHttp,
  deleted: boolean,
  post: Post,
): Promise<PostResponse> {
  let form: DeletePost = {
    post_id: post.id,
    deleted: deleted,
  };
  return api.deletePost(form);
}

export async function removePost(
  api: LemmyHttp,
  removed: boolean,
  post: Post,
): Promise<PostResponse> {
  let form: RemovePost = {
    post_id: post.id,
    removed,
  };
  return api.removePost(form);
}

export async function featurePost(
  api: LemmyHttp,
  featured: boolean,
  post: Post,
): Promise<PostResponse> {
  let form: FeaturePost = {
    post_id: post.id,
    featured,
    feature_type: "Community",
  };
  return api.featurePost(form);
}

export async function lockPost(
  api: LemmyHttp,
  locked: boolean,
  post: Post,
): Promise<PostResponse> {
  let form: LockPost = {
    post_id: post.id,
    locked,
  };
  return api.lockPost(form);
}

export async function resolvePost(
  api: LemmyHttp,
  post: Post,
): Promise<ResolveObjectResponse> {
  let form: ResolveObject = {
    q: post.ap_id,
  };
  return api.resolveObject(form);
}

export async function searchPostLocal(
  api: LemmyHttp,
  post: Post,
): Promise<SearchResponse> {
  let form: Search = {
    search_term: post.name,
    type_: "Posts",
    listing_type: "All",
  };
  return api.search(form);
}

/// wait for a post to appear locally without pulling it
export async function waitForPost(
  api: LemmyHttp,
  post: Post,
  checker: (t: PostView | undefined) => boolean = p => !!p,
) {
  return waitUntil<PostView>(
    () => searchPostLocal(api, post).then(p => p.results[0] as PostView),
    checker,
  );
}

export async function getPost(
  api: LemmyHttp,
  post_id: number,
): Promise<GetPostResponse> {
  let form: GetPost = {
    id: post_id,
  };
  return api.getPost(form);
}

export async function getComments(
  api: LemmyHttp,
  post_id?: number,
  listingType: ListingType = "All",
): Promise<GetCommentsResponse> {
  let form: GetComments = {
    post_id: post_id,
    type_: listingType,
    sort: "New",
    limit: 50,
  };
  return api.getComments(form);
}

export async function getUnreadCount(
  api: LemmyHttp,
): Promise<GetUnreadCountResponse> {
  return api.getUnreadCount();
}

export async function listInbox(
  api: LemmyHttp,
  type_?: InboxDataType,
  unread_only: boolean = false,
): Promise<ListInboxResponse> {
  let form: ListInbox = {
    unread_only,
    type_,
  };
  return api.listInbox(form);
}

export async function resolveComment(
  api: LemmyHttp,
  comment: Comment,
): Promise<ResolveObjectResponse> {
  let form: ResolveObject = {
    q: comment.ap_id,
  };
  return api.resolveObject(form);
}

export async function resolveBetaCommunity(
  api: LemmyHttp,
): Promise<ResolveObjectResponse> {
  // Use short-hand search url
  let form: ResolveObject = {
    q: "!main@lemmy-beta:8551",
  };
  return api.resolveObject(form);
}

export async function resolveCommunity(
  api: LemmyHttp,
  q: string,
): Promise<ResolveObjectResponse> {
  let form: ResolveObject = {
    q,
  };
  return api.resolveObject(form);
}

export async function resolvePerson(
  api: LemmyHttp,
  apShortname: string,
): Promise<ResolveObjectResponse> {
  let form: ResolveObject = {
    q: apShortname,
  };
  return api.resolveObject(form);
}

export async function banPersonFromSite(
  api: LemmyHttp,
  person_id: number,
  ban: boolean,
  remove_or_restore_data: boolean,
): Promise<BanPersonResponse> {
  // Make sure lemmy-beta/c/main is cached on lemmy_alpha
  let form: BanPerson = {
    person_id,
    ban,
    remove_or_restore_data,
  };
  return api.banPerson(form);
}

export async function banPersonFromCommunity(
  api: LemmyHttp,
  person_id: number,
  community_id: number,
  remove_or_restore_data: boolean,
  ban: boolean,
): Promise<BanFromCommunityResponse> {
  let form: BanFromCommunity = {
    person_id,
    community_id,
    remove_or_restore_data,
    ban,
  };
  return api.banFromCommunity(form);
}

export async function followCommunity(
  api: LemmyHttp,
  follow: boolean,
  community_id: number,
): Promise<CommunityResponse> {
  let form: FollowCommunity = {
    community_id,
    follow,
  };
  const res = await api.followCommunity(form);
  await waitUntil(
    () => getCommunity(api, res.community_view.community.id),
    g =>
      g.community_view.subscribed === (follow ? "Subscribed" : "NotSubscribed"),
  );
  // wait FOLLOW_ADDITIONS_RECHECK_DELAY (there's no API to wait for this currently)
  await delay(2000);
  return res;
}

export async function likePost(
  api: LemmyHttp,
  score: number,
  post: Post,
): Promise<PostResponse> {
  let form: CreatePostLike = {
    post_id: post.id,
    score: score,
  };

  return api.likePost(form);
}

export async function createComment(
  api: LemmyHttp,
  post_id: number,
  parent_id?: number,
  content = "a jest test comment",
): Promise<CommentResponse> {
  let form: CreateComment = {
    content,
    post_id,
    parent_id,
  };
  return api.createComment(form);
}

export async function editComment(
  api: LemmyHttp,
  comment_id: number,
  content = "A jest test federated comment update",
): Promise<CommentResponse> {
  let form: EditComment = {
    content,
    comment_id,
  };
  return api.editComment(form);
}

export async function deleteComment(
  api: LemmyHttp,
  deleted: boolean,
  comment_id: number,
): Promise<CommentResponse> {
  let form: DeleteComment = {
    comment_id,
    deleted,
  };
  return api.deleteComment(form);
}

export async function removeComment(
  api: LemmyHttp,
  removed: boolean,
  comment_id: number,
): Promise<CommentResponse> {
  let form: RemoveComment = {
    comment_id,
    removed,
  };
  return api.removeComment(form);
}

export async function likeComment(
  api: LemmyHttp,
  score: number,
  comment: Comment,
): Promise<CommentResponse> {
  let form: CreateCommentLike = {
    comment_id: comment.id,
    score,
  };
  return api.likeComment(form);
}

export async function createCommunity(
  api: LemmyHttp,
  name_: string = randomString(10),
  visibility: CommunityVisibility = "Public",
): Promise<CommunityResponse> {
  let description = "a sample description";
  let form: CreateCommunity = {
    name: name_,
    title: name_,
    description,
    visibility,
  };
  return api.createCommunity(form);
}

export async function editCommunity(
  api: LemmyHttp,
  form: EditCommunity,
): Promise<CommunityResponse> {
  return api.editCommunity(form);
}

export async function getCommunity(
  api: LemmyHttp,
  id: number,
): Promise<CommunityResponse> {
  let form: GetCommunity = {
    id,
  };
  return api.getCommunity(form);
}

export async function getCommunityByName(
  api: LemmyHttp,
  name: string,
): Promise<CommunityResponse> {
  let form: GetCommunity = {
    name,
  };
  return api.getCommunity(form);
}

export async function deleteCommunity(
  api: LemmyHttp,
  deleted: boolean,
  community_id: number,
): Promise<CommunityResponse> {
  let form: DeleteCommunity = {
    community_id,
    deleted,
  };
  return api.deleteCommunity(form);
}

export async function removeCommunity(
  api: LemmyHttp,
  removed: boolean,
  community_id: number,
): Promise<CommunityResponse> {
  let form: RemoveCommunity = {
    community_id,
    removed,
  };
  return api.removeCommunity(form);
}

export async function createPrivateMessage(
  api: LemmyHttp,
  recipient_id: number,
): Promise<PrivateMessageResponse> {
  let content = "A jest test federated private message";
  let form: CreatePrivateMessage = {
    content,
    recipient_id,
  };
  return api.createPrivateMessage(form);
}

export async function editPrivateMessage(
  api: LemmyHttp,
  private_message_id: number,
): Promise<PrivateMessageResponse> {
  let updatedContent = "A jest test federated private message edited";
  let form: EditPrivateMessage = {
    content: updatedContent,
    private_message_id,
  };
  return api.editPrivateMessage(form);
}

export async function deletePrivateMessage(
  api: LemmyHttp,
  deleted: boolean,
  private_message_id: number,
): Promise<PrivateMessageResponse> {
  let form: DeletePrivateMessage = {
    deleted,
    private_message_id,
  };
  return api.deletePrivateMessage(form);
}

export async function registerUser(
  api: LemmyHttp,
  url: string,
  username: string = randomString(5),
): Promise<LemmyHttp> {
  let form: Register = {
    username,
    password,
    password_verify: password,
    show_nsfw: true,
  };
  let login_response = await api.register(form);

  expect(login_response.jwt).toBeDefined();
  let lemmy_http = new LemmyHttp(url, {
    headers: { Authorization: `Bearer ${login_response.jwt ?? ""}` },
  });
  return lemmy_http;
}

export async function loginUser(
  api: LemmyHttp,
  username: string,
): Promise<LoginResponse> {
  let form: Login = {
    username_or_email: username,
    password: password,
  };
  return api.login(form);
}

export async function saveUserSettingsBio(
  api: LemmyHttp,
): Promise<SuccessResponse> {
  let form: SaveUserSettings = {
    show_nsfw: true,
    blur_nsfw: false,
    theme: "darkly",
    default_post_sort_type: "Active",
    default_listing_type: "All",
    interface_language: "en",
    show_avatars: true,
    send_notifications_to_email: false,
    bio: "a changed bio",
  };
  return saveUserSettings(api, form);
}

export async function saveUserSettingsFederated(
  api: LemmyHttp,
): Promise<SuccessResponse> {
  let bio = "a changed bio";
  let form: SaveUserSettings = {
    show_nsfw: false,
    blur_nsfw: true,
    default_post_sort_type: "Hot",
    default_listing_type: "All",
    interface_language: "",
    display_name: "user321",
    show_avatars: false,
    send_notifications_to_email: false,
    bio,
  };
  return await saveUserSettings(api, form);
}

export async function saveUserSettings(
  api: LemmyHttp,
  form: SaveUserSettings,
): Promise<SuccessResponse> {
  return api.saveUserSettings(form);
}

export async function getPersonDetails(
  api: LemmyHttp,
  person_id: number,
): Promise<GetPersonDetailsResponse> {
  let form: GetPersonDetails = {
    person_id: person_id,
  };
  return api.getPersonDetails(form);
}

export async function listPersonContent(
  api: LemmyHttp,
  person_id: number,
  type_?: PersonContentType,
): Promise<ListPersonContentResponse> {
  let form: ListPersonContent = {
    person_id,
    type_,
  };
  return api.listPersonContent(form);
}

export async function deleteUser(api: LemmyHttp): Promise<SuccessResponse> {
  let form: DeleteAccount = {
    delete_content: true,
    password,
  };
  return api.deleteAccount(form);
}

export async function getSite(api: LemmyHttp): Promise<GetSiteResponse> {
  return api.getSite();
}

export async function getMyUser(api: LemmyHttp): Promise<MyUserInfo> {
  return api.getMyUser();
}

export async function unfollowRemotes(api: LemmyHttp): Promise<MyUserInfo> {
  // Unfollow all remote communities
  let my_user = await getMyUser(api);
  let remoteFollowed =
    my_user.follows.filter(c => c.community.local == false) ?? [];
  await Promise.all(
    remoteFollowed.map(cu => followCommunity(api, false, cu.community.id)),
  );

  return await getMyUser(api);
}

export async function followBeta(api: LemmyHttp): Promise<CommunityResponse> {
  let betaCommunity = (await resolveBetaCommunity(api)).community;
  if (betaCommunity) {
    let follow = await followCommunity(api, true, betaCommunity.community.id);
    return follow;
  } else {
    return Promise.reject("no community worked");
  }
}

export async function reportPost(
  api: LemmyHttp,
  post_id: number,
  reason: string,
): Promise<PostReportResponse> {
  let form: CreatePostReport = {
    post_id,
    reason,
  };
  return api.createPostReport(form);
}

export async function listReports(
  api: LemmyHttp,
  show_community_rule_violations: boolean = false,
): Promise<ListReportsResponse> {
  let form: ListReports = { show_community_rule_violations };
  return api.listReports(form);
}

export async function reportComment(
  api: LemmyHttp,
  comment_id: number,
  reason: string,
): Promise<CommentReportResponse> {
  let form: CreateCommentReport = {
    comment_id,
    reason,
  };
  return api.createCommentReport(form);
}

export async function reportPrivateMessage(
  api: LemmyHttp,
  private_message_id: number,
  reason: string,
): Promise<PrivateMessageReportResponse> {
  let form: CreatePrivateMessageReport = {
    private_message_id,
    reason,
  };
  return api.createPrivateMessageReport(form);
}

export function getPosts(
  api: LemmyHttp,
  listingType?: ListingType,
  community_id?: number,
): Promise<GetPostsResponse> {
  let form: GetPosts = {
    type_: listingType,
    limit: 50,
    community_id,
  };
  return api.getPosts(form);
}

export function userBlockInstance(
  api: LemmyHttp,
  instance_id: InstanceId,
  block: boolean,
): Promise<SuccessResponse> {
  let form: UserBlockInstanceParams = {
    instance_id,
    block,
  };
  return api.userBlockInstance(form);
}

export function blockCommunity(
  api: LemmyHttp,
  community_id: CommunityId,
  block: boolean,
): Promise<BlockCommunityResponse> {
  let form: BlockCommunity = {
    community_id,
    block,
  };
  return api.blockCommunity(form);
}

export function listCommunityPendingFollows(
  api: LemmyHttp,
): Promise<ListCommunityPendingFollowsResponse> {
  let form: ListCommunityPendingFollows = {
    pending_only: true,
    all_communities: false,
    page: 1,
    limit: 50,
  };
  return api.listCommunityPendingFollows(form);
}

export function getCommunityPendingFollowsCount(
  api: LemmyHttp,
  community_id: CommunityId,
): Promise<GetCommunityPendingFollowsCountResponse> {
  let form: GetCommunityPendingFollowsCountI = { community_id };
  return api.getCommunityPendingFollowsCount(form);
}

export function approveCommunityPendingFollow(
  api: LemmyHttp,
  community_id: CommunityId,
  follower_id: PersonId,
  approve: boolean = true,
): Promise<SuccessResponse> {
  let form: ApproveCommunityPendingFollower = {
    community_id,
    follower_id,
    approve,
  };
  return api.approveCommunityPendingFollow(form);
}
export function getModlog(api: LemmyHttp): Promise<GetModlogResponse> {
  let form: GetModlog = {};
  return api.getModlog(form);
}

export function delay(millis = 500) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

export function longDelay() {
  return delay(10000);
}

export function wrapper(form: any): string {
  return JSON.stringify(form);
}

export function randomString(length: number): string {
  var result = "";
  var characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function deleteAllImages(api: LemmyHttp) {
  const imagesRes = await api.listAllMedia({
    limit: imageFetchLimit,
  });
  Promise.all(
    imagesRes.images
      .map(image => {
        const form: DeleteImageParams = {
          filename: image.local_image.pictrs_alias,
        };
        return form;
      })
      .map(form => api.deleteImage(form)),
  );
}

export async function unfollows() {
  await Promise.all([
    unfollowRemotes(alpha),
    unfollowRemotes(beta),
    unfollowRemotes(gamma),
    unfollowRemotes(delta),
    unfollowRemotes(epsilon),
  ]);
  await Promise.all([
    purgeAllPosts(alpha),
    purgeAllPosts(beta),
    purgeAllPosts(gamma),
    purgeAllPosts(delta),
    purgeAllPosts(epsilon),
  ]);
}

export async function purgeAllPosts(api: LemmyHttp) {
  // The best way to get all federated items, is to find the posts
  let res = await api.getPosts({ type_: "All", limit: 50 });
  await Promise.all(
    Array.from(new Set(res.posts.map(p => p.post.id)))
      .map(post_id => api.purgePost({ post_id }))
      // Ignore errors
      .map(p => p.catch(e => e)),
  );
}

export function getCommentParentId(comment: Comment): number | undefined {
  let split = comment.path.split(".");
  // remove the 0
  split.shift();

  if (split.length > 1) {
    return Number(split[split.length - 2]);
  } else {
    console.error(`Failed to extract comment parent id from ${comment.path}`);
    return undefined;
  }
}

export async function waitUntil<T>(
  fetcher: () => Promise<T>,
  checker: (t: T) => boolean,
  retries = 10,
  delaySeconds = [0.2, 0.5, 1, 2, 3],
) {
  let retry = 0;
  let result;
  while (retry++ < retries) {
    try {
      result = await fetcher();
      if (checker(result)) return result;
    } catch (error) {
      console.error(error);
    }
    await delay(
      delaySeconds[Math.min(retry - 1, delaySeconds.length - 1)] * 1000,
    );
  }
  console.error("result", result);
  throw Error(
    `Failed "${fetcher}": "${checker}" did not return true after ${retries} retries (delayed ${delaySeconds}s each)`,
  );
}
