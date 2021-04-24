import request from "@/utils/request";

// 登录
export function login(data) {
  return request({
    url: "/sysAdmin/login",
    method: "post",
    data
  });
}

// 获取角色管理
export function getRole(roleId) {
  return request({
    url: `/sysRole/${roleId}`,
    method: "get"
  });
}
