import { AxiosPromise } from "axios";
import Api from "./Api";
import { ApiResponse } from "./ApiResponses";
import {
  CreateCommentThreadRequest,
  CreateCommentRequest,
} from "components/ads/Comments/CommentsInterfaces";

class CommentsApi extends Api {
  static baseURL = "v1/comments";
  static getThreadsAPI = () => `${CommentsApi.baseURL}/threads`;
  static getCommentsAPI = () => CommentsApi.baseURL;

  static createNewThread(
    request: CreateCommentThreadRequest,
  ): AxiosPromise<ApiResponse> {
    return Api.post(CommentsApi.getThreadsAPI(), request);
  }

  static createNewThreadComment(
    request: CreateCommentRequest,
    threadId: string,
  ): AxiosPromise<ApiResponse> {
    return Api.post(CommentsApi.getCommentsAPI(), request, {
      threadId,
    });
  }

  static fetchAppCommentThreads(
    applicationId: string,
  ): AxiosPromise<ApiResponse> {
    return Api.get(CommentsApi.getThreadsAPI(), { applicationId });
  }

  static updateCommentThread(
    updateCommentRequest: Partial<CreateCommentThreadRequest>,
    threadId: string,
  ): AxiosPromise<ApiResponse> {
    return Api.put(
      `${CommentsApi.getThreadsAPI()}/${threadId}`,
      updateCommentRequest,
    );
  }
}

export default CommentsApi;