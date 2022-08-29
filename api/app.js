const http = uni.$u.http
// 系统信息
export const store = (data) => http.get('/wxapp/store', {
	params: data
})
//帮助信息
export const help = (data) => http.get('/wxapp/help', {
	params: data
})