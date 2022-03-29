const http = uni.$u.http
// 挂件分类
export const category = (data) => http.get('/pendant.category/index', {
	params: data
})
// 挂件
export const frame = (data) => http.get('/pendant/index', {
	params: data
})