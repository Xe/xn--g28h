import {Drash} from "../deps.ts";
import AuthService from "../services/auth_service.ts";

export default class ProtectedResource extends Drash.Resource {
  public services = {
    ALL: [AuthService],
  };
}
