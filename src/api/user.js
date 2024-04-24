import request from "@/utils/request";

export function getRequest(url, paramObj) {
  return request({
    method: "get",
    url,
    params: paramObj,
    headers: {
      Authorization: `${sessionStorage.getItem("token")}`
    }
  });
}

export function getRequestWithRestful(url) {
  return request({
    method: "get",
    url,
    headers: {
      Authorization: `${sessionStorage.getItem("token")}`
    }
  });
}

export function postRequest(url, data) {
  return request({
    method: "post",
    url,
    data,
    headers: {
      Authorization: `${sessionStorage.getItem("token")}`
    }
  })
}
