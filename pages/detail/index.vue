<template>
	<view class="container">
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
				<view class="date" v-if="cover.is_sync == 1">开抢时间：{{ cover.start_time }}</view>
				<view class="date" v-else>创建时间：{{ cover.create_time }}</view>
				<view class="type">封面类型：{{ cover.type.name }}</view>
				<!-- 铁杆红包 -->
				<view class="package">

				</view>
			</view>
			<view class="btn-group">
				<view class="btn" v-if="cover.type.value == 10">
					<view v-if="(cover.second - order.use_second)==0 || cover.is_free == 1">
						<u-button @click="onClickUnlock" color="#E05F5D"
							:text="order && order.pay_status == 20?'点击快速复制':'点击快速复制'" type="error" shape="circle">
						</u-button>
					</view>
					<view v-else>
						<u-button @click="onClickUnlock" color="#E05F5D"
							:text="order && order.pay_status == 20?'点击快速复制':'点击解锁封面'" type="error" shape="circle">
						</u-button>
					</view>
				</view>
				<view class="btn" v-if="cover.type.value == 40">
					<u-button @click="onBuy" color="#E05F5D" :text="order && order.pay_status == 20?'点击快速复制':'立即购买封面'"
						type="error" shape="circle">
					</u-button>
				</view>
			</view>
			<view class="tool">
				<u-grid :border="false" col="4">
					<u-grid-item @click="onDownload">
						<u-icon color="#D6D6D6" name="photo" :size="22"></u-icon>
						<text class="grid-text">下载原图</text>
					</u-grid-item>
					<u-grid-item>
						<button hover-class='none' open-type="share">
							<u-icon color="#D6D6D6" name="share" :size="22"></u-icon>
							<u--text size="10" color="#D6D6D6" class="grid-text" text="分享朋友"></u--text>
						</button>
					</u-grid-item>
					<u-grid-item @click="onClickUnlock">
						<u-icon color="#D6D6D6" name="attach" :size="22"></u-icon>
						<text class="grid-text">复制链接</text>
					</u-grid-item>
					<u-grid-item>
						<button hover-class='none' open-type="contact">
							<u-icon color="#D6D6D6" name="kefu-ermai" :size="22"></u-icon>
							<text class="grid-text">客服</text>
						</button>
					</u-grid-item>
				</u-grid>
			</view>
		</view>
		<!-- 广告 -->
		<view class="ad" v-if="inspire.banner_ad">
			<ad :unit-id="inspire.banner_ad"></ad>
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
	import AD from "@/utils/ad.js"
	export default {
		data() {
			return {
				cover_id: '',
				cover: [],
				order: [],
				inspire: [],
				userInfo: []
			};
		},
		onLoad(options) {
			let _this = this
			_this.getStore()
			if (options.cover_id) {
				_this.cover_id = options.cover_id
				_this.getDetail()
			}
		},
		onShow() {
			let _this = this
			_this.getUser()
		},
		methods: {
			onDownload() {
				let _this = this
				uni.downloadFile({
					url: _this.cover.is_sync == 0 ? _this.cover.image.file_path : _this.cover.cover_img,
					success: (res) => {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function() {
								uni.$u.toast("图片已下载")
							}
						});
					}
				});
			},
			async onBuy() {
				let _this = this
				if (_this.userInfo === false) {
					uni.navigateTo({
						url: "../passport/login"
					})
					return false;
				}
				if (_this.order && _this.order.pay_status == 20) {
					_this.onCopyLink()
					return false;
				}
				await buy({
					cover_id: _this.cover.cover_id
				}).then(res => {
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: res.payment.timeStamp,
						nonceStr: res.payment.nonceStr,
						package: 'prepay_id=' + res.payment.prepay_id,
						signType: 'MD5',
						paySign: res.payment.paySign,
						success: function(res) {
							_this.getOrder()
						},
						fail: function(err) {
							console.log('fail:' + JSON.stringify(err));
						}
					});
				}).catch(err => {
					console.log(err)
				})
			},
			onCopyLink() {
				let _this = this
				if (_this.userInfo === false) {
					uni.navigateTo({
						url: "../passport/login"
					})
					return false;
				}
				if (_this.order && _this.order.pay_status == 20) {
					uni.setClipboardData({
						data: _this.order.code
					})
				}
			},
			async getUser() {
				let _this = this
				await UserDetail({}).then(res => {
					if (res.userInfo) {
						_this.userInfo = res.userInfo
						if (res.userInfo !== false) {
							_this.getOrder()
						}
					}
				}).catch(err => {
					console.log(err)
				})
			},
			doUnlock() {
				let _this = this
				if (_this.userInfo === false) {
					uni.navigateTo({
						url: "../passport/login"
					})
					return false;
				}
				unlock({
					order_no: _this.order.order_no
				}).then(res => {
					console.log(res)
					_this.getOrder()
				}).catch(err => {
					console.log(err)
				})
			},
			onClickUnlock() {
				let _this = this
				if (_this.userInfo.length <= 0) {
					uni.navigateTo({
						url: "../passport/login"
					})
					return false;
				}
				if (_this.order && _this.order.pay_status == 20) {
					_this.onCopyLink()
					return false;
				}
				if (_this.userInfo !== false) {
					if (_this.cover.is_free == 1) {
						unlock({
							order_no: _this.order.order_no
						}).then(res => {
							_this.getOrder()
							setTimeout(() => {
								_this.onCopyLink()
							}, 1000)
						}).catch(err => {
							console.log(err)
						})
						return true;
					}
					if (_this.inspire.rew_ad) {
						if (_this.cover.is_free == 0) {
							AD.rewarded.show();
							return true;
						}
					}
					_this.doUnlock()
					return true;
				}
				uni.navigateTo({
					url: "../passport/login"
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
					AD.rewarded.load(_this.inspire.rew_ad, () => {
						//这里写你的任意奖励事件
						unlock({
							order_no: _this.order.order_no
						}).then(res => {
							console.log(res)
							_this.getOrder()
						}).catch(err => {
							console.log(err)
						})
					});
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
					path: '/pages/cover/index?referee_id=' + (_this.userInfo ? _this.userInfo
						.user_id : '')
				}
			},
			onShareAppMessage() {
				let _this = this
				let imageUrl = _this.cover.is_sync == 1 ? _this.cover.cover_img : _this.cover.image.file_path
				return {
					title: _this.store.share.title,
					desc: _this.store.share.desc,
					path: '/pages/detail/index?cover_id=' + _this.cover.cover_id + "&referee_id=" + _this.userInfo
						.user_id,
					imageUrl: imageUrl
				}
			}
		}
	}
</script>

<style lang="scss">
	.ad {
		width: 90%;
		margin: 0 auto;
		margin-bottom: 120rpx;
		border-radius: 15rpx;
		overflow: hidden;
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
