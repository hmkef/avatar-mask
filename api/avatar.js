const http = uni.$u.http
// 头像分类
export const category = (data) => http.get('/avatar.category/index', {
	params: data
})
// 头像
export const frame = (data) => http.get('/avatar/index', {
	params: data
})