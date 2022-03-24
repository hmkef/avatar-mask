const http = uni.$u.http
// 红包封面分类
export const category = (data) => http.get('/cover.category/index', {
	params: data
})
// 红包封面枚举类型
export const TypeEnum = (data) => http.get('/cover/TypeEnum', {
	params: data
})
// 红包封面列表
export const Cover = (data) => http.get('/cover/index', {
	params: data
})
// 红包封面详情
export const detail = (data) => http.get('/cover/detail', {
	params: data
})
// 红包封面订单
export const order = (data) => http.get('/cover/order', {
	params: data
})

// 购买红包封面
export const buy = (data) => http.post('/cover/buy',data)

// 解锁红包封面
export const unlock = (data) => http.post('/cover/unlock',data)

// 红包封面订单
export const navigation = (data) => http.get('/cover/navigation', {
	params: data
})