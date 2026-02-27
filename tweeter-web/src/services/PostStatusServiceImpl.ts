import { AuthToken, Status } from "tweeter-shared";
import { PostStatusService } from "./PostStatusService";

export class PostStatusServiceImpl implements PostStatusService {
  async postStatus(authToken: AuthToken, status: Status): Promise<void> {
    // Simulate server call. Replace with real API when backend is connected.
    await new Promise((f) => setTimeout(f, 2000));
  }
}
