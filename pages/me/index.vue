<template>
	<view class="container">
		<view class="background"></view>
		<view class="head">
			<view class="user">
				<view class="avatar">
					<u-avatar size="61" mp-avatar></u-avatar>
				</view>
				<view class="nickname">
					<view class="text">{{ store.name }}</view>
					<view class="vip">
						<u-icon name="level" size="20" color="#FFAB3B"></u-icon>尊贵的VIP用户
					</view>
				</view>
			</view>
			<!-- 系统特色 -->
			<view class="special">
				<u-grid :border="false" @click="click" col="4">
					<u-grid-item>
						<u-icon class="icon" :name="store.navigation.item_1.icon" size="32"></u-icon>
						<view class="item">{{ store.navigation.item_1.title }}</view>
					</u-grid-item>
					<u-grid-item>
						<u-icon class="icon" :name="store.navigation.item_2.icon" size="32"></u-icon>
						<view class="item">{{ store.navigation.item_2.title }}</view>
					</u-grid-item>
					<u-grid-item>
						<u-icon class="icon" :name="store.navigation.item_3.icon" size="32"></u-icon>
						<view class="item">{{ store.navigation.item_3.title }}</view>
					</u-grid-item>
					<u-grid-item>
						<u-icon class="icon" :name="store.navigation.item_4.icon" size="32"></u-icon>
						<view class="item">{{ store.navigation.item_4.title }}</view>
					</u-grid-item>
				</u-grid>
			</view>
		</view>
		<view class="tool">
			<view class="title">
				<view>工具栏</view>
			</view>
			<u-cell-group :border="false">
				<view class="item" v-for="(item,index) in navigation" :key="index" @click="onJump(item)">
					<u-cell size="large" isLink :titleStyle="{color:'#595959'}" :border="false" :title="item.title">
						<u-icon slot="icon" size="32" :name="item.image.file_path"></u-icon>
					</u-cell>
				</view>
			</u-cell-group>
		</view>
		<view class="copyright">
			<view class="company">{{ store.copyright }}</view>
			<view class="version">version v4.0.0</view>
		</view>
		<!-- <view class="head">
			<view class="avatar">
				<u-avatar size="81" mp-avatar src="http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg">
				</u-avatar>
			</view>
		</view>
		<view class="cell">
			<view class="item">
				<button class="btn" hover-class='none' open-type="contact">
					<view class="label">在线客服</view>
					<view class="right-icon">
						<u-icon name="arrow-right"></u-icon>
					</view>
				</button>
			</view>
			<view class="item">
				<button class="btn" hover-class='none' open-type="share">
					<view class="label">合作建议</view>
					<view class="right-icon">
						<u-icon name="arrow-right"></u-icon>
					</view>
				</button>
			</view>
		</view> -->
		<!-- 底部菜单 -->
		<tabbar name="me"></tabbar>
	</view>
</template>

<script>
	import {
		store
	} from '@/api/app.js';
	import {
		detail as UserDetail
	} from '@/api/user.js';
	import {
		navigation
	} from '@/api/cover.js';
	import tabbar from '@/components/tabbar/index.vue';
	export default {
		components: {
			tabbar
		},
		data() {
			return {
				store: [],
				inspire: [],
				userInfo: [],
				navigation: []
			};
		},
		onLoad() {
			this.getStore()
			this.getUser()
			this.getNavigation()
		},
		methods: {
			onJump(item) {
				if (item.show_type == 10) {
					uni.reLaunch({
						url: item.url
					})
					return false;
				}
				if (item.show_type == 20) {
					uni.redirectTo({
						url: "../webview/index?url=" + encodeURIComponent(item.url)
					})
					return false;
				}
				if (item.show_type == 30) {
					uni.navigateToMiniProgram({
						appId: item.app_id,
						path: item.url,
						extraData: {},
						success(res) {}
					})
					return false;
				}
			},
			getNavigation() {
				let _this = this
				navigation({}).then(res => {
					_this.navigation = res.navigation
				}).catch(err => {

				})
			},
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
						}, 1500)
					}
				}).catch(err => {
					console.log(err)
				})
			},
		},
		onShareAppMessage() {
			let _this = this
			return {
				title: _this.store.share.title,
				desc: _this.store.share.desc,
				path: '/pages/cover/index?referee_id=' + (_this.userInfo ? _this.userInfo
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
	}
</script>

<style lang="scss">
	.copyright {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #595959;
		margin-top: 60rpx;

		.company {
			font-size: 28rpx;
		}

		.version {
			font-size: 24rpx;
		}
	}

	.tool {
		width: 90%;
		background-color: #fff;
		margin: 60rpx auto;
		border-radius: 15rpx;
		overflow: hidden;

		.title {
			width: 90%;
			margin: 0 auto;
			padding: 30rpx 0rpx;
			margin-bottom: 15rpx;
			border-bottom: 1rpx dashed #595959;
			padding-bottom: 30rpx;
		}
	}

	.background {
		width: 100%;
		min-height: 280rpx;
		background-color: #f35543;
		border-radius: 0rpx 0rpx 15rpx 15rpx;
		position: absolute;
		top: 0rpx;
		left: 0rpx;
		z-index: -1;
	}

	.head {
		width: 80%;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 15rpx;
		margin-top: 80rpx;
		overflow: hidden;
		padding: 30rpx;

		.avatar {
			margin-right: 15rpx;
		}

		.user {
			display: flex;
			flex-direction: row;
			align-items: center;

			.nickname {
				.text {
					font-size: 34rpx;
					font-weight: bolder;
					margin: 15rpx 0rpx;
					color: #595959;
				}

				.vip {
					display: flex;
					flex-direction: row;
					align-items: center;
					color: #FFAB3B;
					font-size: 24rpx;
				}
			}
		}

		.special {
			display: flex;
			flex-direction: row;
			margin-top: 40rpx;
			border-top: 1rpx dashed #595959;
			padding-top: 30rpx;

			.item {
				font-size: 28rpx;
				color: #595959;
			}
		}
	}

	// button::after {
	// 	border: none;
	// }

	// button {
	// 	position: relative;
	// 	display: block;
	// 	box-sizing: border-box;
	// 	// font-size: 18px;
	// 	text-align: center;
	// 	text-decoration: none;
	// 	// line-height: 1;
	// 	line-height: 1.35;
	// 	// border-radius: 5px;
	// 	-webkit-tap-highlight-color: transparent;
	// 	overflow: hidden;
	// 	color: #000000;
	// 	background-color: #fff;
	// 	display: flex;
	// 	flex-direction: column;
	// 	align-items: center;

	// }

	// .cell {
	// 	width: 96%;
	// 	margin: 0 auto;
	// 	background-color: #fff;
	// 	margin-top: 15rpx;
	// 	border-radius: 15rpx;
	// 	overflow: hidden;
	// 	.item{
	// 		padding: 15rpx 15rpx;
	// 		border-bottom: 1rpx solid #f4f4f4;
	// 		.btn{
	// 			display: flex;
	// 			flex-direction: row;
	// 			justify-content: space-between;
	// 		}
	// 	}
	// }

	// .head {
	// 	width: 100%;
	// 	min-height: 280rpx;
	// 	display: flex;
	// 	flex-direction: row;
	// 	align-items: center;
	// 	justify-content: center;
	// 	background-color: #fff;
	// 	padding-top: 140rpx;
	// }
</style>
