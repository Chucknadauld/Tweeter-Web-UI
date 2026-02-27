import "./PostStatus.css";
import { useState, useRef, useMemo, useContext } from "react";
import useUserInfo from "../../hooks/useUserInfo";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { AuthToken, Status } from "tweeter-shared";
import { ToastType } from "../toaster/Toast";
import { usePostStatusPresenter } from "../../hooks/usePostStatusPresenter";

const PostStatus = () => {
  const { currentUser, authToken } = useUserInfo();
  const { displayToast, deleteToast } = useContext(ToastActionsContext);
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const postingToastIdRef = useRef("");
  const setPostRef = useRef(setPost);
  const displayToastRef = useRef(displayToast);
  const deleteToastRef = useRef(deleteToast);
  setPostRef.current = setPost;
  displayToastRef.current = displayToast;
  deleteToastRef.current = deleteToast;

  const view = useMemo(
    () => ({
      displayInfoMessage: (message: string, duration?: number) => {
        postingToastIdRef.current = displayToastRef.current(
          ToastType.Info,
          message,
          duration ?? 0
        );
      },
      displayErrorMessage: (message: string) => {
        displayToastRef.current(ToastType.Error, message, 0);
      },
      clearInfoMessage: () => {
        deleteToastRef.current(postingToastIdRef.current);
      },
      clearPost: () => setPostRef.current(""),
      setPost: (value: string) => setPostRef.current(value),
    }),
    []
  );

  const presenter = usePostStatusPresenter(view);

  const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (!authToken || !currentUser) return;

    try {
      setIsLoading(true);
      const status = new Status(post, currentUser, Date.now());
      await presenter.postStatus(authToken, status);
    } finally {
      setIsLoading(false);
    }
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const checkButtonStatus = (): boolean => {
    return !post.trim() || !authToken || !currentUser;
  };

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={checkButtonStatus()}
          style={{ width: "8em" }}
          onClick={submitPost}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={checkButtonStatus()}
          onClick={clearPost}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
