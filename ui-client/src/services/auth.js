import { doPost } from "../AppUtils";
import { apiPaths } from "../routeDefs";

export const joinGame = async (username) => {
  return await doPost(apiPaths.join, {
    username,
  });
};

export const leaveGame = async (token) => {
  return await doPost(apiPaths.leave, {
    token,
  });
};
