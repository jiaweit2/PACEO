import { doPost } from "../AppUtils";
import { apiPaths } from "../routeDefs";

export const joinGame = async (username) => {
  const joinSessionResponse = await doPost(apiPaths.join, {
    username,
  });
  return joinSessionResponse;
};

export const leaveGame = async (token) => {
  return await doPost(apiPaths.leave, {
    token,
  });
};
