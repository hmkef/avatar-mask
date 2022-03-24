const http = uni.$u.http

// 开团 
export const creator = (data) => http.post('/cover.invite/creator', data)

// 查询组团
export const invite = (data) => http.get('/cover.invite/index', {
	params: data
})

// 助力
export const help = (data) => http.post('/cover.invite/help', data)
