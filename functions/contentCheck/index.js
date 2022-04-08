// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios');
cloud.init({
	 env: 'touxiang-img-3g7p52ycff534a65',
	 traceUser: true
})
// 云函数入口函数
exports.main = async (event, context) => {
	console.log(event.txt);
	const {
		value,
		txt
	} = event;
	try {
		let msgR = false;
		let imageR = false;
		//检查 文字内容是否违规
		if (txt) {
			msgR = await cloud.openapi.security.msgSecCheck({
				content: txt
			})
		}
		//检查 图片内容是否违规
		if (value) {
			let buffer = null;
					let ccc = await axios({
						method: 'get',
						url: event.imgData, // imgData是刚才传过来的
						responseType: 'arraybuffer',
						headers: { "Content-Type": "*" }
					}).then(res => {
						buffer = res.data;
					});
			
			
			imageR = await cloud.openapi.security.imgSecCheck({
				media: {
					// header: {
					// 	'Content-Type': 'application/octet-stream'
					// },
					contentType: 'image/png',
					value: buffer
				}
			})
		}
		return {
			msgR, //内容检查返回值
			imageR //图片检查返回值
		};
	} catch (err) {
		// 错误处理
		// err.errCode !== 0
		return err
	}
}