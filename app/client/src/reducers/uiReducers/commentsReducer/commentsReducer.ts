import { ReduxAction, ReduxActionTypes } from "constants/ReduxActionConstants";
import { createReducer } from "utils/AppsmithUtils";
import { get, uniqBy } from "lodash";
import handleCreateNewCommentThreadSuccess from "./handleCreateNewCommentThreadSuccess";
import handleAddCommentToThreadSuccess from "./handleAddCommentToThreadSuccess";
import handleFetchApplicationCommentsSuccess from "./handleFetchApplicationCommentsSuccess";
import handleNewCommentThreadEvent from "./handleNewCommentThreadEvent";
import handleUpdateCommentThreadSuccess from "./handleUpdateCommentThreadSuccess";
import handleUpdateCommentThreadEvent from "./handleUpdateCommentThreadEvent";

import { CommentsReduxState } from "./interfaces";

const initialState: CommentsReduxState = {
  commentThreadsMap: {},
  applicationCommentThreadsByRef: {},
  unpublishedCommentThreads: {},
  isCommentMode: true,
  creatingNewThread: false,
  creatingNewThreadComment: false,
};

/**
 * Action constants with suffix as `EVENT` are a result of socket updates
 * They are handled separately
 */
const commentsReducer = createReducer(initialState, {
  [ReduxActionTypes.SET_COMMENT_THREADS_SUCCESS]: (
    state: CommentsReduxState,
    action: ReduxAction<any>,
  ) => ({
    ...state,
    ...action.payload,
  }),
  // Only one unpublished comment threads exists at a time
  [ReduxActionTypes.CREATE_UNPUBLISHED_COMMENT_THREAD_SUCCESS]: (
    state: CommentsReduxState,
    action: ReduxAction<any>,
  ) => ({
    ...state,
    unpublishedCommentThreads: action.payload,
  }),
  [ReduxActionTypes.REMOVE_UNPUBLISHED_COMMENT_THREAD_REQUEST]: (
    state: CommentsReduxState,
  ) => ({
    ...state,
    unpublishedCommentThreads: {},
  }),
  [ReduxActionTypes.CREATE_COMMENT_THREAD_SUCCESS]: (
    state: CommentsReduxState,
    action: ReduxAction<any>,
  ) => {
    return handleCreateNewCommentThreadSuccess(state, action);
  },
  [ReduxActionTypes.ADD_COMMENT_TO_THREAD_SUCCESS]: (
    state: CommentsReduxState,
    action: ReduxAction<any>,
  ) => {
    return handleAddCommentToThreadSuccess(state, action);
  },
  [ReduxActionTypes.SET_COMMENT_MODE]: (
    state: CommentsReduxState,
    action: ReduxAction<boolean>,
  ) => ({
    ...state,
    isCommentMode: action.payload,
  }),
  [ReduxActionTypes.SET_IS_COMMENT_THREAD_VISIBLE]: (
    state: CommentsReduxState,
    action: ReduxAction<{ isVisible: boolean; commentThreadId: string }>,
  ) => ({
    ...state,
    commentThreadsMap: {
      ...state.commentThreadsMap,
      [action.payload.commentThreadId]: {
        ...state.commentThreadsMap[action.payload.commentThreadId],
        isVisible: action.payload.isVisible,
      },
    },
  }),
  [ReduxActionTypes.CREATE_COMMENT_THREAD_REQUEST]: (
    state: CommentsReduxState,
  ) => ({
    ...state,
    creatingNewThread: true,
  }),
  [ReduxActionTypes.ADD_COMMENT_TO_THREAD_REQUEST]: (
    state: CommentsReduxState,
  ) => ({
    ...state,
    creatingNewThreadComment: true,
  }),
  [ReduxActionTypes.FETCH_APPLICATION_COMMENTS_SUCCESS]: (
    state: CommentsReduxState,
    action: ReduxAction<any>,
  ) => {
    return handleFetchApplicationCommentsSuccess(state, action);
  },
  [ReduxActionTypes.NEW_COMMENT_THREAD_EVENT]: (
    state: CommentsReduxState,
    action: ReduxAction<any>,
  ) => {
    return handleNewCommentThreadEvent(state, action);
  },
  [ReduxActionTypes.NEW_COMMENT_EVENT]: (
    state: CommentsReduxState,
    action: ReduxAction<any>,
  ) => {
    const { comment } = action.payload;
    const threadInState = state.commentThreadsMap[comment.threadId];
    if (!threadInState) return state;
    const existingComments = get(threadInState, "comments", []);

    return {
      ...state,
      commentThreadsMap: {
        ...state.commentThreadsMap,
        [comment.threadId]: {
          ...threadInState,
          comments: uniqBy(
            [...existingComments, { ...comment, id: comment._id }],
            "id",
          ),
        },
      },
    };
  },
  [ReduxActionTypes.UPDATE_COMMENT_THREAD_SUCCESS]: (
    state: CommentsReduxState,
    action: ReduxAction<any>,
  ) => {
    return handleUpdateCommentThreadSuccess(state, action);
  },
  [ReduxActionTypes.UPDATE_COMMENT_THREAD_EVENT]: (
    state: CommentsReduxState,
    action: ReduxAction<any>,
  ) => {
    return handleUpdateCommentThreadEvent(state, action);
  },
});

export default commentsReducer;