import { AuthToken } from "tweeter-shared";

export interface UserService {
  logout: (authToken: AuthToken) => Promise<void>;
}
