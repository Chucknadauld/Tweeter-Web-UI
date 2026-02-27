import { AuthToken } from "tweeter-shared";
import { UserService } from "./UserService";

export class UserServiceImpl implements UserService {
  async logout(authToken: AuthToken): Promise<void> {
    // Simulate server call. Replace with real API when backend is connected.
    await new Promise((res) => setTimeout(res, 1000));
  }
}
