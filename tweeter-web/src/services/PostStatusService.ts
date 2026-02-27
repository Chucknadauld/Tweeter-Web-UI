import { AuthToken, Status } from "tweeter-shared";

export interface PostStatusService {
  postStatus: (authToken: AuthToken, status: Status) => Promise<void>;
}
