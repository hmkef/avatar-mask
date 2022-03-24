<template>
	<view class="container">
		<u-sticky>
			<view class="navbar">
				<u-navbar bgColor="#FC4144" :autoBack="false" @leftClick="onClickAvatar">
					<view slot="left">
						<u--image :showLoading="true" src="/static/images/header-avatar-2.png" width="140px"
							height="30px" @click="click"></u--image>
					</view>
				</u-navbar>
			</view>
		</u-sticky>
		<!-- 顶部 -->
		<view class="ad">
			<view class="box" v-if="inspire.banner_ad">
				<ad :unit-id="inspire.banner_ad"></ad>
			</view>
		</view>

		<view class="block">
			<view class="tips">
				<view>
					<u-icon :name="(cover.second - order.use_second)==0?'lock-open':'lock'" color="#fff"></u-icon>
				</view>
				<view v-if="cover.type.value != 40">
					{{ (cover.second - order.use_second)==0?'已解锁':(cover.second - order.use_second)+' 次' }}
				</view>
				<view v-else> {{ (cover.second - order.use_second)==0?'已解锁':'￥'+cover.money+' 元' }}</view>
			</view>
			<view class="cover">
				<image class="image" :src="cover.is_sync == 0?cover.image.file_path:cover.cover_img"></image>
			</view>
			<view class="header">
				<view class="title">{{ cover.title }}</view>
			</view>
			<view class="remarks">
				<view class="rule">{{ cover.remarks }}</view>
				<view class="date" v-if="cover.is_sync == 1">开枪时间：{{ cover.start_time }}</view>
				<view class="date" v-else>创建时间：{{ cover.create_time }}</view>
				<view class="type">封面类型：{{ cover.type.name }}</view>
				<!-- 铁杆红包 -->
				<view class="package">

				</view>
			</view>
			<view class="btn-group">
				<!-- 如果当前用户没有登录，则直接显示为别人加速 -->
				<view class="btn" v-if="!userInfo.user_id">
					<u-button @click="ondoHelp" color="#E05F5D" text="点击为TA助力" type="error" shape="circle">
					</u-button>
				</view>
				<view class="btn" v-if="userInfo.user_id && creator.user_id == userInfo.user_id">
					<u-button v-if="creator.state == 0" openType="share" color="#E05F5D" text="邀请好友助力" type="error"
						shape="circle">
					</u-button>
					<u-button @click="onCopyLink" v-else color="#E05F5D" text="点击快速领取" type="error" shape="circle">
					</u-button>
				</view>
				<view class="btn" v-if="userInfo.user_id && creator.user_id != userInfo.user_id">
					<u-button @click="ondoHelp" color="#E05F5D" text="点击为TA助力" type="error" shape="circle">
					</u-button>
				</view>
			</view>
		</view>
		<view class="head">
			<view class="title" v-if="(creator.cover.second - creator.number) > 0">还差<text
					class="number">{{ creator.cover.second - creator.number  }}</text>位好友可以领取</view>
			<view class="title" v-else>当前助力已完成</view>
		</view>
		<!-- 人头 -->
		<view class="people">
			<u-grid :border="false" @click="click" col="5">
				<u-grid-item v-for="index of creator.cover.second">
					<view class="item">
						<view class="circle">
							<u-avatar size="60" :text="creator.creator[index].user_id" fontSize="12" randomBgColor
								v-if="(creator.number) >= index">
							</u-avatar>
						</view>
					</view>
				</u-grid-item>
			</u-grid>
		</view>
	</view>
</template>

<script>
	import {
		store
	} from '@/api/app.js';
	import {
		detail,
		order,
		buy,
		unlock
	} from '@/api/cover.js';
	import {
		detail as UserDetail
	} from '@/api/user.js';
	import {
		creator,
		invite,
		help
	} from '@/api/invite.js';
	import AD from "@/utils/ad.js"
	export default {
		data() {
			return {
				cover_id: '',
				cover: [],
				order: [],
				inspire: [],
				userInfo: [],
				invite_id: '',
				creator: [],
				referee_id: uni.getStorageSync("referee_id")
			};
		},
		onLoad(options) {
			let _this = this
			_this.getStore()
			if (options.cover_id) {
				_this.cover_id = options.cover_id
				_this.getDetail()
			}
			if (options.invite_id) {
				_this.invite_id = options.invite_id
			}
		},
		onShow() {
			let _this = this
			_this.getUser()
			_this.getInvite()
		},
		methods: {
			onCopyLink() {
				let _this = this
				AD.interstitial.show();
				if (_this.userInfo.user_id && _this.creator.user_id == _this.userInfo.user_id && _this.creator.state ==
					1) {
					uni.setClipboardData({
						data: _this.creator.code
					})
				}
			},
			async ondoHelp() {
				let _this = this
				AD.interstitial.show();
				await help({
					invite_id: _this.invite_id
				}).then(res => {
					_this.getInvite()
				}).catch(err => {})
			},
			async getInvite() {
				let _this = this
				await invite({
					invite_id: _this.invite_id
				}).then(res => {
					_this.creator = res.creator
				}).catch(err => {

				})
			},
			onClickAvatar() {
				uni.reLaunch({
					url: "../avatar/index"
				})
			},
			onDownload() {
				let _this = this
				uni.downloadFile({
					url: _this.cover.image.file_path,
					success: (res) => {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function() {
								console.log('save success');
							}
						});
					}
				});
			},
			async getUser() {
				let _this = this
				await UserDetail({}).then(res => {
					if (res.userInfo) {
						_this.userInfo = res.userInfo
						_this.getOrder()
					}
				}).catch(err => {
					console.log(err)
				})
			},
			async getDetail() {
				let _this = this
				await detail({
					cover_id: _this.cover_id
				}).then(res => {
					_this.cover = res.cover
				}).catch(err => {
					console.log(err)
				})
			},
			async getStore() {
				let _this = this
				await store({}).then(res => {
					_this.store = res.store
					_this.inspire = res.inspire
					AD.interstitial.load(res.inspire.ins_ad)
				}).catch(err => {
					console.log(err)
				})
			},
			async getOrder() {
				let _this = this
				await order({
					cover_id: _this.cover_id
				}).then(res => {
					_this.order = res.order
				}).catch(err => {
					console.log(err)
				})
			},
			onShareTimeline() {
				let _this = this
				return {
					title: _this.store.share.title,
					desc: _this.store.share.desc,
					path: '/pages/help/index?cover_id' + _this.cover.cover_id + "&invite_id=" + _this.creator
						.invite_id + "&referee_id=" + (_this.userInfo ? _this.userInfo
							.user_id : ''),
				}
			},
			onShareAppMessage() {
				let _this = this
				let imageUrl = _this.cover.is_sync == 1 ? _this.cover.cover_img : _this.cover.image.file_path
				let obj = {
					title: _this.store.share.title,
					desc: _this.store.share.desc,
					path: '/pages/help/index?cover_id=' + _this.cover.cover_id + "&invite_id=" + _this.creator
						.invite_id + "&referee_id=" + (_this.userInfo ? _this.userInfo
							.user_id : ''),
					imageUrl: imageUrl
				}
				console.log(obj)
				return obj
			}
		}
	}
</script>

<style lang="scss">
	page {
		padding-bottom: 60rpx;
	}

	.head {
		width: 86%;
		margin: 0 auto;
		background-color: #fff;
		padding: 30rpx;
		text-align: center;

		.title {
			border-bottom: 1rpx solid #FC4144;
			padding-bottom: 30rpx;

			.number {
				font-weight: bolder;
				color: #FC4144;
				font-size: 34rpx;
			}
		}
	}

	.people {
		width: 90%;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 0rpx 0rpx 15rpx;
		padding: 15rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		margin-bottom: 160rpx;

		.item {
			.circle {
				width: 120rpx;
				height: 120rpx;
				background-color: #fff;
				border-radius: 50%;
				border: 2rpx dashed #FC4144;
			}

			margin: 15rpx 0rpx;
		}
	}

	.ad {
		.box {
			width: 90%;
			margin: 0 auto;
			border-radius: 15rpx;
			overflow: hidden;
			background-color: #fff;
		}

		background-color: #ffffff;
		padding: 15rpx 0rpx;
	}

	button::after {
		border: none;
	}

	button {
		position: relative;
		display: block;
		box-sizing: border-box;
		// font-size: 18px;
		text-align: center;
		text-decoration: none;
		// line-height: 1;
		line-height: 1.35;
		// border-radius: 5px;
		-webkit-tap-highlight-color: transparent;
		overflow: hidden;
		color: #000000;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;

	}

	.block {
		width: 90%;
		margin: 30rpx auto;
		background-color: #fff;
		border-radius: 15rpx;
		padding: 30rpx 0rpx;

		.tips {
			position: absolute;
			right: 30rpx;
			top: 20rpx;
			background-color: #E05F5D;
			color: #fff;
			padding: 10rpx 20rpx;
			font-size: 20rpx;
			display: flex;
			flex-direction: row;
		}

		.tool {
			width: 90%;
			margin: 0 auto;

			.grid-text {
				color: #D6D6D6;
				font-size: 20rpx;
			}

			.grid-icon {
				color: #D6D6D6;
			}
		}

		.cover {
			width: 320rpx;
			margin: 0rpx auto;

			.image {
				width: 320rpx;
				height: 480rpx;
			}
		}

		.btn-group {
			width: 90%;
			margin: 30rpx auto;
			text-align: center;
		}

		.remarks {
			text-align: center;
			font-size: 24rpx;
			color: #C2C2C2;
			padding: 0rpx 30rpx;

			.type {
				margin-top: 15rpx;
			}

			.rule {
				margin-bottom: 15rpx;
			}
		}

		.header {
			.title {
				text-align: center;
				font-weight: bolder;
			}

			margin: 30rpx 0rpx;
		}
	}
</style>
