const http = uni.$u.http
// 用户登录
export const login = (data) => http.post('/user/login',data)
// 获取用户信息
export const detail = (data) => http.get('/user.index/detail', {
	params: data
})