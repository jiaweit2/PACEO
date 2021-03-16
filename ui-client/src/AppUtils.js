export const doGet = async (url, params) => {};

export const doPost = async (url, body, headers) => {
  const resp = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return resp.json();
};
