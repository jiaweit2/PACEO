import axios from "axios";

export const doGet = async (url, params, headers) => {
  const resp = await axios({
    method: "get",
    url,
    params,
    headers,
  });
  return resp.data;
};

export const doPost = async (url, body, headers) => {
  const resp = await axios({
    method: "post",
    url,
    data: body,
    headers,
  });
  return resp.data;
};
