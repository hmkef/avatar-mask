<template>
	<view class="content">
		<image src="https://answer-1251511393.cos.ap-chongqing.myqcloud.com/1212/editor_bg.jpg" class="all-back"
			mode="widthFix"></image>
		<view :class="on?'music on':''">
			<image @click="onStopAudio" src="/static/images/hutou.png" style="width: 60rpx;height: 60rpx;"></image>
		</view>
		<view class="wrap">
			<view class="newtext">
				<text class="text text12">20</text>
				<text class="text text11">22</text>
				<text class="text text10">虎</text>
				<text class="text text9">年</text>
				<text class="text text8">●</text>
				<text class="text text7">虎</text>
				<text class="text text6">虎</text>
				<text class="text text5">生</text>
				<text class="text text4">威</text>
			</view>
		</view>
		<view class="top-content">
			<scroll-view scroll-x :show-scrollbar="false" class="scroll-view">
				<view class="top-title">
					<view class="title-unit" :class="{ 'title-select': item.selected }"
						v-for="(item, index) in category" :key="item.category_id" @click="switchCategory(item)">
						{{ item.title }}
					</view>
				</view>
			</scroll-view>
			<scroll-view scroll-x :show-scrollbar="false" class="scroll-view">
				<view class="image-div" v-if="imageList.length">
					<view :class="{ 'image-margin': index !== 0 }" v-for="(info, index) in imageList"
						:key="info.avatar_id" @click="imageClick(info)">
						<image :src="info.image.file_path"></image>
					</view>
				</view>
				<view class="image-div empty-cover" v-else>
					<u-empty width="41" height="41" text="暂无可用头像框" mode="list"
						icon="http://cdn.uviewui.com/uview/empty/data.png">
					</u-empty>
				</view>
			</scroll-view>
		</view>

		<view class="image-card">
			<view class="photo-main-view">
				<!--  -->
				<view class="avatar-div " id="avatar-container">
					<image class="img" id="avatar-img" :src="avatarImage"></image>
					<view class="empty-view " v-if="!avatarImage">
						<image class="empty"
							src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-08ecbb66-149e-4d2b-93a0-fa6bc6e0e894/c33782ca-cd2f-4bfc-84eb-0713c52f522f.svg">
						</image>
					</view>
					<image class="avatar-default " :src="currentImage.image.file_path"
						v-if="currentImage && currentImage.image.file_path"></image>
				</view>

				<view class="ctlbtn">
					<view class="icon-div btn-margin">
						<view class="icon-zuo iconfont" v-if="showSwitch(-1)" @click="switchAvatar(-1)"></view>
						<view class="icon-you iconfont" v-if="showSwitch(1)" @click="switchAvatar(1)"></view>
					</view>
					<button v-if="userInfo" class="action-btn btn-margin"
						@click="getUserProfile('createImages')">获取头像</button>
					<button class="action-btn btn-margin" v-else open-type="getUserInfo"
						@click="getUserProfile('createImages')">获取头像</button>
					<button class="action-btn btn-primary" @click="shareFc()">保存头像</button>
				</view>
			</view>
		</view>
		<view class="hideCanvasView">
			<canvas class="hideCanvas" id="default_PosterCanvasId" canvas-id="default_PosterCanvasId"
				:style="{ width: (poster.width || 10) + 'px', height: (poster.height || 10) + 'px' }"></canvas>
		</view>
		<!-- 广告 -->
		<view class="ad" v-if="inspire.banner_ad">
			<ad :unit-id="inspire.banner_ad"></ad>
		</view>
		<!-- 底部菜单 -->
		<tabbar name="avatar"></tabbar>
	</view>
</template>

<script>
	import _app from '@/utils/QS-SharePoster/app.js';
	import {
		store
	} from '@/api/app.js';
	import AD from "@/utils/ad.js"
	import {
		getSharePoster
	} from '@/utils/QS-SharePoster/QS-SharePoster.js';
	import {
		category,
		frame
	} from '@/api/avatar.js';
	import {
		detail as UserDetail
	} from '@/api/user.js';
	let Audio = null;
	import tabbar from '@/components/tabbar/index.vue';
	export default {
		components: {
			tabbar
		},
		data() {
			return {
				store: [],
				inspire: [],
				poster: {},
				posterImage: '',
				canvasId: 'default_PosterCanvasId',
				userInfo: '',
				code: '',
				avatarImage: uni.getStorageSync('avatar_image'),
				currentImage: {},
				currentIndex: 0,
				imageList: [],
				categoriesList: [],
				category: [],
				shareInfo: {},
				on: true
			};
		},
		onLoad() {
			let _this = this
			_this.getCategoriesList();
			_this.AudioPlay()
			_this.getStore()
			_this.getUser()
		},
		onUnload() {
			let _this = this
			_this.muteBgMusic = !_this.muteBgMusic
			if (_this.muteBgMusic) {
				// 开启静音
				_this.$music.playBgm({
					mute: true
				})
			}
		},
		onShareAppMessage() {
			let _this = this
			return {
				title: _this.store.share.title,
				desc: _this.store.share.desc,
				path: '/pages/avatar/index?referee_id=' + +(_this.userInfo ? _this.userInfo
					.user_id : '')
			}
		},
		onShareTimeline() {
			let _this = this
			return {
				title: _this.store.share.title,
				desc: _this.store.share.desc,
				path: '/pages/avatar/index?referee_id=' + (_this.userInfo ? _this.userInfo
					.user_id : '')
			}
		},
		methods: {
			async getUser() {
				let _this = this
				await UserDetail({}).then(res => {
					if (res.userInfo) {
						_this.userInfo = res.userInfo
					}
				}).catch(err => {
					console.log(err)
				})
			},
			async getStore() {
				let _this = this
				await store({}).then(res => {
					_this.store = res.store
					_this.inspire = res.inspire
					if (res.inspire.ins_ad) {
						AD.interstitial.load(res.inspire.ins_ad)
						setTimeout(() => {
							AD.interstitial.show();
						}, 1000)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			onStopAudio() {
				let _this = this
				_this.muteBgMusic = !_this.muteBgMusic
				console.log(_this.muteBgMusic, _this.muteBgMusic ? '已关闭音乐####' : '已开启音乐####');
				if (_this.muteBgMusic) {
					// 开启静音
					_this.$music.playBgm({
						mute: true
					})
				} else {
					// 关闭 静音
					_this.$music.playBgm({
						mute: false
					})
				}
			},
			AudioPlay() {
				let _this = this
				// 播放背景音乐
				_this.$music.playBgm({
					mute: false
				})
			},
			/**
			 * 获取分类
			 */
			getCategoriesList() {
				let _this = this
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				category({}).then(res => {
					uni.hideLoading();
					_this.category = res.category
					if (_this.category.length > 0) {
						_this.$set(_this.category[0], 'selected', true);
						_this.getImagesList(_this.category[0].category_id);
					} else {
						_this.category = []
					}
				}).catch(err => {
					uni.hideLoading();
				})
			},
			/**
			 * @param {Object} id
			 * 获取头像
			 */
			getImagesList(id, num) {
				let _this = this
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				frame({
					category_id: id
				}).then(res => {
					_this.imageList = res.avatar.data;
					if (num < 0) {
						_this.currentImage = _this.imageList[_this.imageList.length - 1];
					} else {
						_this.currentImage = _this.imageList[0];
					}
					uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
				})
			},
			/**
			 * @param {Object} item
			 * 切换分类
			 */
			switchCategory(item, num) {
				let _this = this
				let info = _this.category.filter(el => el.selected);
				if (info && info.length > 0) {
					info[0].selected = false;
				}
				_this.$set(item, 'selected', true);
				_this.getImagesList(item.category_id, num);
			},
			/**
			 * @param {Object} num
			 * 切换图片
			 */
			switchAvatar(num) {
				AD.interstitial.show();
				let currentIndex = this.imageList.findIndex(el => el._id === this.currentImage._id);
				if ((num > 0 && currentIndex < this.imageList.length - 1) || (num < 0 && currentIndex > 0)) {
					currentIndex += num;
					this.currentImage = this.imageList[currentIndex];
				} else {
					let currentType = this.category.findIndex(data => data.selected);
					currentType += num;
					if (this.category[currentType] && this.category[currentType]._id) {
						this.switchCategory(this.category[currentType], num);
					}
				}
			},
			/**
			 * @param {Object} item
			 * 图片点击事件
			 */
			imageClick(item) {
				this.currentImage = item;
			},
			/**
			 * @param {Object} val
			 * 是否展示左右切换
			 */
			showSwitch(val) {
				let currentType = this.category.findIndex(data => data.selected);
				let currentIndex = this.imageList.findIndex(el => el._id === this.currentImage._id);
				let res = (val < 0 && currentType <= 0 && currentIndex <= 0) || (val > 0 && currentType >= this
					.category.length - 1 && currentIndex >= this.imageList.length - 1);
				return !res;
			},
			/**
			 * 获取微信code
			 */
			getWeixinCode() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						success(res) {
							resolve(res.code);
						},
						fail(err) {
							reject(new Error('微信登录失败'));
						}
					});
				});
			},
			/**
			 * 生成新头像
			 */
			async shareFc() {
				if (!this.avatarImage) {
					uni.showToast({
						title: '请先获取头像',
						icon: 'none'
					});
					return;
				}
				try {
					uni.showLoading({
						title: '加载中',
						mask: true
					});
					_app.log('准备生成:' + new Date());
					const d = await getSharePoster({
						_this: this, //若在组件中使用 必传
						type: 'testShareType',
						formData: {
							//访问接口获取背景图携带自定义数据
						},
						backgroundImage: this.avatarImage,
						posterCanvasId: this.canvasId, //canvasId
						delayTimeScale: 20, //延时系数
						drawArray: ({
							bgObj,
							type,
							bgScale
						}) => {
							//可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
							return new Promise((rs, rj) => {
								rs([{
									type: 'image',
									url: this.currentImage.image.file_path,
									dx: 0,
									dy: 0,
									infoCallBack(imageInfo) {
										return {
											dWidth: bgObj.width, // 因为设置了圆形图片 所以要乘以2
											dHeight: bgObj.height
										};
									}
								}]);
							});
						},
						setCanvasWH: ({
							bgObj,
							type,
							bgScale
						}) => {
							// 为动态设置画布宽高的方法，
							this.poster = bgObj;
						}
					});
					_app.log('海报生成成功, 时间:' + new Date() + '， 临时路径: ' + d.poster.tempFilePath);
					this.posterImage = d.poster.tempFilePath;
					this.savefile();
					uni.hideLoading();
				} catch (e) {
					uni.hideLoading();
					_app.hideLoading();
					_app.showToast(JSON.stringify(e));
				}
			},
			/**
			 * 保存图片
			 */
			savefile() {
				//获取相册授权
				let _self = this;
				uni.getSetting({
					success(res) {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success() {
									//这里是用户同意授权后的回调
									_self.saveImgToLocal();
								},
								fail(e) {
									uni.hideLoading();
									wx.showModal({
										content: '检测到您没打开下载图片功能权限，是否去设置打开？',
										confirmText: '确认',
										cancelText: '取消',
										success: function(res) {
											//点击“确认”时打开设置页面
											if (res.confirm) {
												wx.openSetting();
											}
										}
									});
								}
							});
						} else {
							//用户已经授权过了
							_self.saveImgToLocal();
						}
					}
				});
			},
			/**
			 * @param {Object} e
			 * 保存到相册
			 */
			saveImgToLocal(e) {
				let _self = this;
				uni.saveImageToPhotosAlbum({
					filePath: _self.posterImage,
					success: function() {
						_self.saveImageInfo();
						uni.setStorageSync('currentImage', _self.posterImage);
					},
					fail: function() {
						uni.hideLoading();
						uni.showToast({
							title: '保存失败',
							icon: 'none'
						});
					}
				});
			},
			/**
			 * 头像
			 */
			saveImageInfo() {
				AD.interstitial.show();
				uni.showToast({
					title: '头像已保存',
					icon: 'none'
				});
			},
			/**
			 * @param {Object} type
			 * 获取头像
			 */
			async getUserProfile(type) {
				let _this = this;
				uni.getUserProfile({
					desc: '获取您的头像信息',
					success(result) {
						let data = {
							code: _this.code,
							signature: result.signature,
							encrypted_data: result.encryptedData,
							iv: result.iv,
							userInfo: result.userInfo
						};
						let info = data.userInfo.avatarUrl;
						if (type === 'createImages') {
							_this.avatarImage = info.substring(0, info.lastIndexOf('/') + 1) + '0';
							uni.setStorageSync('avatar_image', _this.avatarImage);
						}
					},
					fail(fall) {}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.empty-cover {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.ad {
		margin: 100rpx 0rpx;
	}

	.music {
		display: inline-block;
		height: 60rpx;
		left: 40rpx;
		position: fixed;
		top: 40px;
		width: 60rpx;
		z-index: 9999;
	}

	.on {
		animation: rotating 2.5s linear infinite;
	}

	@-webkit-keyframes rotating {
		from {
			transform: rotate(0);
		}

		to {
			transform: rotate(1turn);
		}
	}

	@keyframes rotating {
		from {
			transform: rotate(0);
		}

		to {
			transform: rotate(1turn);
		}
	}

	.wrap {
		margin-top: 170rpx;

		.contentwrap {
			padding-bottom: 50px;
			padding-top: 180px;
			position: relative;
			z-index: 100;
		}

		.newtext {
			color: #ffe6bf;
			left: 50%;
			position: relative;
			text-align: center;
			text-transform: uppercase;
			transform: translateX(-50%);
			white-space: nowrap;
		}

		.newtext .text {
			display: inline-block;
			font-size: 18px;
			font-weight: 700;
			position: relative;
			transition: .1s;
			z-index: 10;
		}

		.newtext .text1 {
			animation: jump .75s ease-in-out 3.6s infinite normal forwards, color .75s ease-in-out 3.5s 1 normal forwards;
		}

		.newtext .text2 {
			animation: jump .75s ease-in-out 3.4s infinite normal forwards, color .75s ease-in-out 3.5s 1 normal forwards;
		}

		.newtext .text3 {
			animation: jump .75s ease-in-out 3.2s infinite normal forwards, color .75s ease-in-out 3.5s 1 normal forwards;
		}

		.newtext .text4 {
			animation: jump .75s ease-in-out 3s infinite normal forwards, color .75s ease-in-out 3.5s 1 normal forwards;
		}

		.newtext .text5 {
			animation: jump .75s ease-in-out 2.8s infinite normal forwards, color .75s ease-in-out 3.5s 1 normal forwards;
		}

		.newtext .text6 {
			animation: jump .75s ease-in-out 2.6s infinite normal forwards, color .75s ease-in-out 3.5s 1 normal forwards;
		}

		.newtext .text7 {
			animation: jump .75s ease-in-out 2.4s infinite normal forwards, color .75s ease-in-out 3.5s 1 normal forwards;
		}

		.newtext .text8 {
			animation: jump .75s ease-in-out 2.2s infinite normal forwards, color .75s ease-in-out 3.5s 1 normal forwards;
		}

		.newtext .text9 {
			animation: jump .75s ease-in-out 2s infinite normal forwards, color .75s ease-in-out 3.5s 1 normal forwards;
		}

		.newtext .text10 {
			animation: jump .75s ease-in-out 1.8s infinite normal forwards, color .75s ease-in-out 3.5s 1 normal forwards;
		}

		.newtext .text11 {
			animation: jump .75s ease-in-out 1.6s infinite normal forwards, color .75s ease-in-out 3.5s 1 normal forwards;
		}

		.newtext .text12 {
			animation: jump .75s ease-in-out 1.4s infinite normal forwards, color .75s ease-in-out 3.5s 1 normal forwards;
		}

		@-webkit-keyframes blink {
			33% {
				color: #cf959c;
			}

			66% {
				color: #ff8260;
			}
		}

		@keyframes blink {
			33% {
				color: #cf959c;
			}

			66% {
				color: #ff8260;
			}
		}

		@-webkit-keyframes jump {
			0% {
				transform: translateY(0);
			}

			50% {
				transform: translateY(-1px);
			}

			75% {
				transform: translateY(1px);
			}

			100% {
				transform: translateY(0);
			}
		}

		@keyframes jump {
			0% {
				transform: translateY(0);
			}

			50% {
				transform: translateY(-1px);
			}

			75% {
				transform: translateY(1px);
			}

			100% {
				transform: translateY(0);
			}
		}
	}

	.content {
		background-size: 100% 100%;
		padding-top: 200rpx;

		.all-back {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			min-height: 100vh;
			width: 750rpx;
		}

		.top-content {
			width: 610rpx;
			background-color: #ffffff;
			margin: 30rpx;
			border-radius: 50rpx;
			padding: 0 40rpx 30rpx;
			position: relative;

			.top-title {
				display: flex;
				align-items: center;
				white-space: nowrap;

				.title-unit {
					padding: 40rpx 20rpx;
					font-size: 30rpx;
				}

				.title-select {
					font-size: 30rpx;
					font-weight: bold;
					color: #ff4500;
				}
			}

			.image-div {
				display: flex;
				align-items: center;
				padding-left: 20rpx;
				padding-bottom: 20rpx;
				background-color: #ffffff;

				image {
					width: 120rpx;
					height: 120rpx;
					border: 1rpx solid #f8f8f8;
					box-shadow: 0px -5px 15px 0px rgba(224, 224, 224, 0.4);
					flex-shrink: 0;
				}

				.image-margin {
					margin: 0 20rpx;
				}
			}
		}

		.image-card {
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

			.iconfont {
				color: #f7f8fa;
				font-size: 80rpx;
				font-weight: bold;
			}
		}
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.avatar-div {
		height: 370rpx;
		margin-right: 40rpx;
		position: relative;
		width: 370rpx;
	}

	.avatar-div,
	.empty-view {
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-webkit-box-pack: center;
		-webkit-box-align: center;
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		z-index: 1;
	}

	.empty {
		height: 100px;
		margin-bottom: 24px;
		width: 100px;
	}

	.img {
		background-color: #fff;
		border-radius: 48rpx;
		height: 370rpx;
		position: absolute;
		width: 370rpx;
		z-index: 0;
	}

	.avatar-default {
		border-radius: 48rpx;
		height: 100%;
		left: 0;
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 10;
	}

	.container {
		background-color: #fbebe1;
		min-height: 100vh;
		overflow: hidden;
	}

	.photo-main-view {
		display: flex;
		justify-content: space-between;
		width: 690rpx;
		margin: 30rpx 30rpx 0;
	}

	.icon-div {
		position: relative;
		height: 80rpx;

		.icon-zuo {
			position: absolute;
			left: 0;
		}

		.icon-you {
			position: absolute;
			right: 0;
		}
	}

	.action-btn {
		background: #fff;
		border: 1rpx solid #efefef;
		border-radius: 48rpx;
		box-shadow: 0 12rpx 16rpx -8rpx rgba(0, 0, 0, 0.1);
		color: #4d4d4d;
		font-weight: bolder;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 30rpx;
		padding: 0 60rpx;
	}

	.btn-margin {
		margin-bottom: 50rpx;
	}

	.btn-primary {
		background: linear-gradient(97.71deg, #ffa462, #ff4d42 88.36%);
		border: 1rpx solid #ff7852;
		border-radius: 48rpx;
		box-shadow: 0 12rpx 16rpx -8rpx rgba(255, 88, 35, 0.6);
		color: #fff;
	}

	.btn-card {
		padding: 30rpx 30rpx;
		box-sizing: border-box;
		width: 750rpx;

		.primary-btn {
			width: 330rpx;
			display: inline-block;
			margin-right: 30rpx;
			background: linear-gradient(97.71deg, #ffa462, #ff4d42 88.36%);
			border: 1rpx solid #ff7852;
			border-radius: 48rpx;
			box-shadow: 0 12rpx 16rpx -8rpx rgba(255, 88, 35, 0.6);
			color: #fff;
			padding: 0;
			font-size: 30rpx;
			height: 90rpx;
			line-height: 90rpx;
		}

		.share-btn {
			width: 330rpx;
			display: inline-block;
			background: linear-gradient(97.71deg, #ffd01e, #ff8917 60%);
			border: 1rpx solid #ff7852;
			border-radius: 48rpx;
			box-shadow: 0 12rpx 16rpx -8rpx rgba(255, 88, 35, 0.6);
			color: #fff;
			padding: 0;
			font-size: 30rpx;
			height: 90rpx;
			line-height: 90rpx;
		}
	}

	.hideCanvasView {
		position: relative;
	}

	.hideCanvas {
		position: fixed;
		top: -99999upx;
		left: -99999upx;
		z-index: -99999;
	}
</style>
