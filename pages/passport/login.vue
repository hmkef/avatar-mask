<template>
	<view class="container">
		<view class="head">
			<view class="avatar">
				<u-avatar size="81" mp-avatar src="http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg">
				</u-avatar>
			</view>
		</view>
		<view class="content">
			<view class="title">
				<view>申请获取以下权限</view>
			</view>
			<view class="desc">
				获得你的公开信息（昵称、头像）
			</view>
		</view>
		<view class="btn-group">
			<view class="btn">
				<u-button shape="circle" type="primary" @getuserinfo="getuserinfo" openType="getUserInfo" text="授权登录">
				</u-button>
			</view>
			<view class="btn">
				<u-button shape="circle" @click="onClickClose" text="暂不登录"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		login
	}
	from "@/api/user.js"
	export default {
		data() {
			return {

			};
		},
		methods: {
			onClickClose() {
				uni.navigateBack({})
			},
			getuserinfo(e) {
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						login({
							referee_id: uni.getStorageSync("referee_id"),
							code: loginRes.code,
							user_info: e.detail.userInfo
						}).then(res => {
							uni.$u.toast("登录成功")
							uni.setStorageSync('token', res.token);
							uni.setStorageSync('user_id', res.user_id);
							setTimeout(() => {
								uni.navigateBack({})
							}, 3000)
						}).catch(err => {

						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.btn-group {
		width: 90%;
		margin: 0 auto;

		.btn {
			margin: 15rpx 0rpx;
		}
	}

	.content {
		width: 90%;
		margin: 60rpx auto;

		.title {
			font-size: 32rpx;
		}

		.desc {
			font-size: 24rpx;
			margin-top: 30rpx;
			color: #A2A3A4;
		}
	}

	.head {
		width: 100%;
		min-height: 280rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		box-shadow: 5rpx 5rpx 30rpx #C4C6C9;
	}
</style>
