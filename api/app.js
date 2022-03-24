const http = uni.$u.http
// 系统信息
export const store = (data) => http.get('/wxapp/store', {
	params: data
})