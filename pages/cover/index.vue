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
			<!-- 顶部 -->
			<u-transition mode="zoom-in" :show="scrollTop < 180">
				<view class="ad">
					<view class="box" v-if="inspire.banner_ad">
						<ad :unit-id="inspire.banner_ad"></ad>
					</view>
				</view>
			</u-transition>
			<view class="header">
				<view class="tabs">
					<view :class="active==0?'item active':'item'" @click="onTabs(0)">
						<view>全部</view>
					</view>
					<view :class="active==item.value?'item active':'item'" v-for="(item,index) in type"
						@click="onTabs(index)">
						<view>{{ item.name }}</view>
					</view>
				</view>
			</view>
			<view class="cate">
				<view class="tabs">
					<u-tabs lineColor="#CF1322" :list="tabs" @click="onClickTabs"></u-tabs>
				</view>
			</view>
		</u-sticky>
		<!-- 封面列表 -->
		<view class="cover" v-if="lists.length" style="margin-bottom: 120rpx;">
			<view class="item" v-for="(item,index) in lists" :key="index"
				@click="onClickCover(item.cover_id,item.type.value)">
				<view class="image">
					<u--image :showLoading="true" :src="item.is_sync == 0?item.image.file_path:item.cover_img"
						mode="scaleToFill" width="130px" height="200px" @click="click"></u--image>
				</view>
				<view class="content">
					<view class="title u-line-2">{{ item.title }}</view>
					<view class="desc u-line-2">{{ item.remarks }}</view>
					<view class="cover-type" v-if="item.is_sync == 1">时间：{{ item.start_time }}</view>
					<view class="cover-type" v-else>时间：{{ item.create_time }}</view>
					<view class="cover-type">类型：{{ item.type.name }}</view>
					<view class="btn">
						<view v-if="item.type.value !=40 ">
							<u-button v-if="item.type.value == 30" size="normal" color="#f35543" text="邀请助力"></u-button>
							<u-button v-else size="normal" color="#f35543" text="立即预约"></u-button>
						</view>
						<view v-else>
							<u-button size="normal" color="#f35543" text="立即购买"></u-button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="margin-top: 150rpx;" v-else>
			<u-empty text="暂无红包封面" mode="list" icon="http://cdn.uviewui.com/uview/empty/data.png">
			</u-empty>
		</view>
		<!-- 返回顶部 -->
		<u-back-top :scroll-top="scrollTop"></u-back-top>
		<!-- 底部菜单 -->
		<tabbar name="cover"></tabbar>
	</view>
</template>

<script>
	import {
		category,
		TypeEnum,
		Cover
	} from '@/api/cover.js';
	import AD from "@/utils/ad.js"
	import {
		store
	} from '@/api/app.js';
	import {
		detail as UserDetail
	} from '@/api/user.js';
	import {
		creator
	} from '@/api/invite.js';
	import tabbar from '@/components/tabbar/index.vue';
	export default {
		components: {
			tabbar
		},
		data() {
			return {
				total: 0,
				lists: [],
				tabs: [],
				active: 0,
				store: [],
				inspire: [],
				scrollTop: 0,
				userInfo: [],
				invite_id: "",
				type: [],
				page: 1,
				is_reach: false
			};
		},
		onLoad() {
			this.getCover()
			this.getCategory()
			this.getStore()
			this.getUser()
			this.getTypeEnum()
		},
		onReachBottom() {
			this.is_reach = true
			this.page += 1
			this.getCover()
		},
		methods: {
			async getTypeEnum() {
				let _this = this
				await TypeEnum({}).then(res => {
					_this.type = res.type
				}).catch(err => {

				})
			},
			async doCreator(cover_id) {
				let _this = this
				await creator({
					cover_id: cover_id
				}).then(res => {
					_this.invite_id = res.invite_id
					uni.navigateTo({
						url: "../help/index?cover_id=" + cover_id + "&invite_id=" + res.invite_id
					})
				}).catch(err => {

				})
			},
			onClickAvatar() {
				uni.reLaunch({
					url: "../avatar/index"
				})
			},
			onClickTabs(e) {
				this.category_id = e.category_id
				this.getCover()
			},
			onTabs(active) {
				this.active = active
				this.getCover()
			},
			onClickCover(cover_id, type) {
				let _this = this
				if (type == 30) {
					// 创建组团
					_this.doCreator(cover_id)
					return false
				} else {
					uni.navigateTo({
						url: "../detail/index?cover_id=" + cover_id
					})
				}
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
			async getCategory() {
				let _this = this
				await category({}).then(res => {
					let category = res.category
					let data = []
					data[0] = {
						name: '全部',
						category_id: 0
					}
					for (let i in category) {
						let obj = {}
						obj.name = category[i].title
						obj.category_id = category[i].category_id
						data[parseInt(i) + 1] = obj
					}
					_this.tabs = data
				}).catch(err => {
					console.log(err)
				})
			},
			async getCover() {
				let _this = this
				await Cover({
					type_id: _this.active,
					category_id: _this.category_id,
					page: _this.page
				}).then(res => {
					_this.total = res.cover.total
					if (_this.is_reach) {
						_this.lists = [..._this.lists, ...res.cover.data]
					} else {
						_this.lists = res.cover.data
					}
				}).catch(err => {

				})
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
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
			return {
				title: _this.store.share.title,
				desc: _this.store.share.desc,
				path: '/pages/cover/index?referee_id=' + (_this.userInfo ? _this.userInfo
					.user_id : '')
			}
		}
	}
</script>

<style lang="scss">
	.cover {
		.item {
			width: 90%;
			margin: 0 auto;
			background-color: #fff;
			min-height: 320rpx;
			border-radius: 15rpx;
			display: flex;
			flex-direction: row;
			padding: 15rpx;
			color: #A2A3A4;
			font-size: 24rpx;
			box-shadow: 5rpx 5rpx 100rpx #e8e8e8;
			margin-bottom: 30rpx;

			.image {
				width: 40%;
				margin-right: 15rpx;
			}

			.content {
				width: 60%;
				position: relative;

				.title {
					font-weight: bolder;
					font-size: 32rpx;
					color: #363636;
					margin-bottom: 15rpx;
				}

				.desc {
					margin-bottom: 15rpx;
				}

				.number {
					margin-bottom: 15rpx;
				}

				.cover-type {
					margin-bottom: 15rpx;
				}

				.probability {
					display: flex;
					flex-direction: row;
					align-items: center;
					margin-bottom: 15rpx;

					.text {
						width: 30%;
					}

					.line {
						width: 70%;
					}
				}

				.btn {
					width: 50%;
					position: absolute;
					bottom: 0rpx;
					right: 0rpx;
				}
			}
		}
	}

	.cate {
		position: relative;
		background-color: #fff;
		border-radius: 10rpx 10rpx 0rpx 0rpx;
		top: -10rpx;
		box-shadow: 5rpx 5rpx 10rpx #f4f4f4;

		.tabs {
			width: 96%;
			margin: 0 auto;
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

		background-color: #FC4144;
		padding: 15rpx 0rpx;
	}

	.header {
		background-color: #FC4144;

		.tabs {
			width: 90%;
			margin: 0 auto;
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			background-color: #CF1322;
			border-radius: 15rpx;
			overflow: hidden;
			color: #fff;

			.item {
				width: 100%;
				padding: 15rpx 30rpx;
				font-size: 24rpx;
			}

			.active {
				background-color: #A8071A;
				font-weight: bolder;
				font-size: 26rpx;
			}
		}

		padding: 15rpx 0rpx;
		padding-bottom: 36rpx;
	}
</style>
