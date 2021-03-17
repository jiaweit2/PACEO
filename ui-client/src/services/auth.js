import { doPost } from "../AppUtils";
import { JOIN_GAME } from "../routeDefs";

export const joinGame = async (username) => {
  return await doPost(JOIN_GAME, {
    username,
  });
};
