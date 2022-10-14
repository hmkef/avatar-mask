<template>
	<view class="container" :style="{height:windowHeight+'px'}">
		<image class="page-bg" :style="{height:windowHeight+'px'}" mode="aspectFill" src="/static/images/page-bg.png">
		</image>
		<view v-if="SHOW_TIP">
			<add-tips :statusBarHeight="statusBarHeight" />
		</view>
		<!-- <view style="height: 54px; width: 750rpx; background-color: #C12928; position: absolute;"></view> -->

		<view class="avatar-container grid justify-center" id="avatar-container" @touchstart="touchStart"
			@touchend="touchEnd" @touchmove="touchMove">
			<view class="avatar-bg-border">
				<image @touchstart="touchAvatarBg" class="bg avatar-bg" id="avatar-bg" :src="avatarPath"></image>
				<view v-if="!avatarPath">
					<image class="bg avatar-bg" src="/static/images/mask/avatar_mask.png">
					</image>
				</view>
			</view>

			<!-- <icon type="cancel" class="cancel" id="cancel" :style="{top:cancelCenterY-10 + 'px', left:cancelCenterX-10 + 'px'}"></icon> -->
			<!-- <icon type="waiting" class="handle" id="handle" color="green" :style="{top:handleCenterY-10 + 'px', left:handleCenterX-10 +'px'}"></icon> -->
			<!-- <text class="cuIcon-order cancel circle" @click="flipHorizontal" id="cancel" :style="{top:cancelCenterY-10 + 'px', left:cancelterX-10 +'px'}"></text> -->

			<image v-if="currentImage" class="mask flip-horizontal" :class="{maskWithBorder: showBorder}" id='mask'
				:src="maskPic" :style="{top:maskCenterY-maskSize/2-2+'px', left:maskCenterX-maskSize/2-2+'px',
				transform: 'rotate(' +rotate+ 'deg)' + 'scale(' +scale+')' + 'rotateY('+ rotateY +'deg)'}"></image>
			<text class="cuIcon-full handle circle" :class="{hideHandle: !showBorder}" id="handle"
				:style="{top:handleCenterY-10 + 'px', left:handleCenterX-10 +'px'}"></text>
			<text class="cuIcon-order cancel circle" :class="{hideHandle: !showBorder}" id="cancel"
				@click="flipHorizontal"
				:style="{top:cancelCenterY-10 + 'px', left:cancelCenterX-10 +'px', transform: 'rotate(' +90+ 'deg)'}"></text>
		</view>
		<view>
			<canvas v-show="tempShow" class="cans-id-mask" canvas-id="cans-id-mask"
				style="height:270px;width:270px;margin-left: auto;margin-right: auto;" />
		</view>
		<view class="flex-sub text-center">
			<!-- <view class="solid-bottom"> -->
			<text class="text-yellow text-bold">点击挂件可进行拖拽缩放操作</text>
			<!-- </view> -->
		</view>
		<view class="grid justify-around action-wrapper">
			<view class="grid col-1">

				<button v-if="userInfo" class="cu-btn round action-btn bg-yellow shadow"
					@click="getUserProfile('createImages')">获取头像</button>
				<button class="cu-btn round action-btn bg-yellow shadow" v-else open-type="getUserInfo"
					@click="getUserProfile('createImages')">获取头像</button>

			</view>
			<view class="grid col-2">
				<button id="btn-save" class="cu-btn round action-btn bg-yellow shadow" @click="draw">
					<!-- <text class="cuIcon-down"> -->
					</text>生成保存
				</button>
			</view>
			<view class="grid col-3">
				<!-- 	<button id="btn-choose-img" class="cu-btn round action-btn bg-yellow shadow"
					open-type="share">分享</button> -->
				<button id="btn-choose-img" class="cu-btn round action-btn bg-yellow shadow"
					@click="chooseImage">选择图片</button>
			</view>
		</view>
		<!-- <view class="grid justify-around share-wrapper">
			<view class="grid col-2 animation-shake animation-speed-2 animation-delay-3">
				<button class="cu-btn block line-orange lg share-btn" open-type="share">
					<text class="cuIcon-upload"></text> <text class="text-yellow">分享给好友</text> </button>
			</view>
		</view> -->

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
						:key="info.pendant_id" @click="imageClick(info)">
						<image :src="info.image.file_path" :data-mask-id="index" @tap="changeMask"></image>
					</view>
				</view>
				<view class="image-div empty-cover" v-else>
					<u-empty width="41" height="41" text="暂无可用挂件" mode="list"
						icon="http://cdn.uviewui.com/uview/empty/data.png">
					</u-empty>
				</view>
			</scroll-view>
		</view>
		
		<!-- 视频广告 -->
		<ad unit-id="adunit-f89892f17940fbee" ad-type="video" ad-theme="white"></ad>

		<!-- banner广告 -->
		<view class="ad" v-if="inspire.banner_ad">
			<ad :unit-id="inspire.banner_ad"></ad>
		</view>

		<view class="cu-modal" :class="modalName=='saveTip'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content"> 已保存至相册</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					预防千万条，口罩第一条。
					健康第一位，不要吃野味。
					不往人群挤，病毒不找你。
					洗手很重要，胜过吃补药。
					通风也要紧，疾病无踪影。
				</view>
				<view class="padding">
					特殊时期：戴口罩，勤洗手，早睡早起，健康美丽！
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">我知道了</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部菜单 -->
		<tabbar name="mask"></tabbar>
	</view>
</template>
<script>
	import {
		mapGetters,
		mapState,
		mapMutations
	} from "vuex";

	import tabbar from '@/components/tabbar/index.vue';
	import addTips from "@/components/add-tips";

	import {
		category,
		frame
	} from '@/api/pendant.js';

	import AD from "@/utils/ad.js"

	import {
		store
	} from '@/api/app.js';

	// 在页面中定义激励视频广告
	// let videoAd = null;
	// 在页面中定义插屏广告
	// let interstitialAd = null

	const range = (start, end, step) => {
		return Array.from(Array.from(Array(Math.ceil((end - start) / step)).keys()), x => start + x * step);
	}
	const STORAGE_KEY = 'PLUG-ADD-MYAPP-KEY';

	export default {
		components: {
			tabbar,
			addTips
		},
		data() {
			return {
				SHOW_TIP: false,
				duration: 15,
				statusBarHeight: 0,
				windowHeight: 0,
				isAndroid: getApp().globalData.IS_ANDROID,
				modalName: null,
				savedCounts: 0,
				freeCount: 1,
				cansWidth: 270, // 宽度 px
				cansHeight: 270, // 高度 px
				avatarPath: getApp().globalData.userAvatarFilePath, //本地缓存头像

				showBorder: false,
				maskCenterX: wx.getSystemInfoSync().windowWidth / 2,
				maskCenterY: 250,
				cancelCenterX: wx.getSystemInfoSync().windowWidth / 2 - 50 - 2,
				cancelCenterY: 200,
				handleCenterX: wx.getSystemInfoSync().windowWidth / 2 + 50 - 2,
				handleCenterY: 300,
				userInfo: '',

				currentImage: {},
				currentIndex: 0,
				imageList: [],
				categoriesList: [],
				category: [],
				tempChoseImage: '',
				inspire: [],
				store: [],

				maskSize: 100,
				scale: 1,
				rotate: 0,
				rotateY: 0, // 值180时，则水平翻转
				mask_center_x: wx.getSystemInfoSync().windowWidth / 2,
				mask_center_y: 250,
				cancel_center_x: wx.getSystemInfoSync().windowWidth / 2 - 50 - 2,
				cancel_center_y: 200,
				handle_center_x: wx.getSystemInfoSync().windowWidth / 2 + 50 - 2,
				handle_center_y: 300,
				scaleCurrent: 1,
				rotateCurrent: 0,
				touch_target: "",
				start_x: 0,
				start_y: 0,
				tempShow:false,
			}
		},
		computed: {
			// ...mapState({
			// 	userInfo: 'userInfo'
			// }),
			maskPic: function() {
				console.log("maskPic", this.tempChoseImage)
				return this.tempChoseImage;
			},

		},
		onLoad(option) {
			this.windowHeight = getApp().globalData.windowHeight;
			// if (!!getApp().globalData.userAvatarFilePath) {
			// 	this.avatarPath = getApp().globalData.userAvatarFilePath;
			// }

			this.getStore()
			this.getCategoriesList();
		},
		onReady() {
			// 判断是否已经显示过
			let cache = uni.getStorageSync(STORAGE_KEY);
			console.log('cache', cache);
			if (!cache) {
				this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
				console.log('this.statusBarHeight', this.statusBarHeight);

				// 没显示过，则进行展示
				this.SHOW_TIP = true;
				console.log('SHOW_TIP', this.SHOW_TIP);
				// 关闭时间
				let _this = this;
				setTimeout(() => {
					_this.SHOW_TIP = false;
				}, _this.duration * 1000);
			}
		},
		onShow() {
			console.log("onShow");

			if (getApp().globalData.rapaintAfterCrop) {
				getApp().globalData.rapaintAfterCrop = false;
				this.avatarPath = getApp().globalData.cropImageFilePath;
				this.paint();
			}

		},
		onShareAppMessage() {
			return {
				title: '我换上了新的挂件，多款样式任你选！还可以联系客服进行定制^_^',
				desc: '个性专属头像挂件,你也来试试吧',
				imageUrl: this.avatarPath,
				path: '/pages/mask/index',
				success: function(res) {
					console.log(res);
				}
			}
		},
		methods: {
			...mapMutations(["saveLoginUserInfo"]),
			paint() {},
			showTips() {
				console.log('tips');
				this.modalName = 'tips';
			},
			touchAvatarBg() {
				this.showBorder = false;
			},
			touchStart(e) {
				console.log('e.target.id', e.target.id);
				if (e.target.id == "mask") {
					this.touch_target = "mask";
					this.showBorder = true;
				} else if (e.target.id == "handle") {
					this.touch_target = "handle"
				} else {
					this.touch_target = ""
				};

				if (this.touch_target != "") {
					this.start_x = e.touches[0].clientX;
					this.start_y = e.touches[0].clientY;
				}
			},
			touchEnd(e) {
				this.mask_center_x = this.maskCenterX;
				this.mask_center_y = this.maskCenterY;
				this.cancel_center_x = this.cancelCenterX;
				this.cancel_center_y = this.cancelCenterY;
				this.handle_center_x = this.handleCenterX;
				this.handle_center_y = this.handleCenterY;
				this.touch_target = "";
				this.scaleCurrent = this.scale;
				this.rotateCurrent = this.rotate;
			},
			touchMove(e) {
				var current_x = e.touches[0].clientX;
				var current_y = e.touches[0].clientY;
				var moved_x = current_x - this.start_x;
				var moved_y = current_y - this.start_y;
				if (this.touch_target == "mask") {
					this.maskCenterX = this.maskCenterX + moved_x;
					this.maskCenterY = this.maskCenterY + moved_y;
					this.cancelCenterX = this.cancelCenterX + moved_x;
					this.cancelCenterY = this.cancelCenterY + moved_y;
					this.handleCenterX = this.handleCenterX + moved_x;
					this.handleCenterY = this.handleCenterY + moved_y;
				};
				if (this.touch_target == "handle") {
					this.handleCenterX = this.handleCenterX + moved_x;
					this.handleCenterY = this.handleCenterY + moved_y;
					this.cancelCenterX = 2 * this.maskCenterX - this.handleCenterX;
					this.cancelCenterY = 2 * this.maskCenterY - this.handleCenterY;
					let diff_x_before = this.handle_center_x - this.mask_center_x;
					let diff_y_before = this.handle_center_y - this.mask_center_y;
					let diff_x_after = this.handleCenterX - this.mask_center_x;
					let diff_y_after = this.handleCenterY - this.mask_center_y;
					let distance_before = Math.sqrt(diff_x_before * diff_x_before + diff_y_before * diff_y_before);
					let distance_after = Math.sqrt(diff_x_after * diff_x_after + diff_y_after * diff_y_after);
					let angle_before = Math.atan2(diff_y_before, diff_x_before) / Math.PI * 180;
					let angle_after = Math.atan2(diff_y_after, diff_x_after) / Math.PI * 180;

					this.scale = distance_after / distance_before * this.scaleCurrent;
					this.rotate = angle_after - angle_before + this.rotateCurrent;
				}
				this.start_x = current_x;
				this.start_y = current_y;
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
							getApp().globalData.userAvatarUrl = _this.avatarImage;

							uni.downloadFile({
								url: _this.avatarImage,
								success: function(res) {
									uni.hideLoading();
									_this.avatarPath = res.tempFilePath;
									getApp().globalData.userAvatarFilePath = res.tempFilePath;
								},
								fail: function(e) {
									console.log(e);
									uni.hideLoading();
									uni.showModal({
										title: '图片加载超时',
										content: '检查网络，点击确定重新加载',
										success(res) {
											if (res.confirm) {
												_this.getUserProfile(type);
											} else if (res.cancel) {
												console.log('用户点击取消');
											}
										}
									})

								}
							})
						}
					},
					fail(fall) {}
				});
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

					setTimeout(() => {
						AD.rewarded.load(_this.inspire.rew_ad, () => {
							//这里写你的任意奖励事件
							_this.saveCans();
						});
					}, 3000)

				}).catch(err => {
					console.log(err)
				})
			},

			/**
			 * 获取分类
			 */
			getCategoriesList() {
				let _this = this
				// uni.showLoading({
				// 	title: '加载中',
				// 	mask: true
				// });
				category({}).then(res => {
					// uni.hideLoading();
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
			 * 获取挂件
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
					_this.imageList = res.pendant.data;
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
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let _this = this;
				uni.downloadFile({
					url: item.image.file_path,
					success: function(res) {
						uni.hideLoading();
						_this.tempChoseImage = res.tempFilePath;
					},
					fail: function(e) {
						console.log(e);
						uni.hideLoading();
						uni.showModal({
							title: '图片加载超时',
							content: '请检查网络，点击确定重新加载',
							success(res) {
								if (res.confirm) {
									_this.imageClick(item);
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						})

					}
				})
			},

			/**
			 *  选择图片
			 */
			chooseImage() {
				let self = this;
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'],
					success: function(res) {
						let tempImagePath = res.tempFilePaths[0];
						self.imageCheck(tempImagePath, self.loadRecImageOrStartToCrop);
					}
				});
			},
			loadRecImageOrStartToCrop(tempImagePath) {
				this.ownImageUsed = true;
				let self = this;
				uni.getImageInfo({
					src: tempImagePath,
					success: function(image) {
						let width = image.width;
						let height = image.height;
						let delta = (width - height) / width.toFixed(3);
						console.log('delta', delta);
						// 如果是正方形或者接近正放心则直接加载不进行剪裁
						if ((-0.02 <= delta && delta <= 0) || (0 < delta && delta <= 0.02)) {
							let tempFilePathCompressed = tempImagePath;
							self.avatarPath = tempImagePath;
							self.paint();
						} else {
							uni.navigateTo({
								url: '/pages/crop/crop?tempFilePath=' + tempImagePath
							})
						}
					}
				});
			},
			changeMask(e) {
				// this.currentMaskId = e.target.dataset.maskId;
				this.showBorder = true;
			},
			draw() {
				if (!this.avatarPath) {
					uni.showToast({
						title: '请先获取头像',
						icon: 'none'
					});
					return;
				}
				this.tempShow = true;

				let scale = this.scale;
				let rotate = this.rotate;
				let mask_center_x = this.mask_center_x;
				let mask_center_y = this.mask_center_y;
				let _this = this;
				// 创建节点选择器
				// 口罩中心位置的计算是从屏幕左上角开始，所以我们需要获取头像图片的位置，来得到口罩相对头像的位置
				var query = wx.createSelectorQuery();
				query.select('#avatar-bg').boundingClientRect()
				query.exec(function(res) {
					//res就是 所有标签为#的元素的信息的数组
					mask_center_x = mask_center_x - res[0].left;
					mask_center_y = mask_center_y - res[0].top;
					const pc = wx.createCanvasContext('cans-id-mask');
					const windowWidth = wx.getSystemInfoSync().windowWidth;
					const mask_size = 100 * scale;

					pc.clearRect(0, 0, _this.cansWidth, _this.cansHeight);
					pc.drawImage(_this.avatarPath, 0, 0, _this.cansWidth, _this.cansHeight);
					pc.translate(mask_center_x, mask_center_y);
					pc.rotate(rotate * Math.PI / 180);
					if (_this.isAndroid) {
						_this.rotateY == 180 && pc.scale(-1, 1);
					}
					pc.drawImage(_this.maskPic, -mask_size / 2, -mask_size / 2, mask_size, mask_size);
					pc.draw();

					// 有成功加载的激励视频，才展现提示框
					if (_this.inspire.rew_ad && _this.savedCounts >= _this.freeCount) {
						uni.showModal({
							title: '获取无限制使用',
							content: '观看完视频可以自动保存哦',
							success: function(res) {
								if (res.confirm) {
									console.log('用户点击确定');
									// 用户触发广告后，显示激励视频广告
									AD.rewarded.show();
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});
					} else {
						_this.saveCans();
					}
				})
			},
			flipHorizontal() {
				this.rotateY = this.rotateY == 0 ? 180 : 0;
			},
			/**
			 * 保存
			 */
			saveCans() {
				let _this = this;
				uni.showLoading({
					title: '保存...',
					mask: true
				})
				uni.canvasToTempFilePath({
					x: 0,
					y: 0,
					height: this.cansWidth,
					width: this.cansHeight,
					destWidth: this.cansWidth * 3,
					destHeight: this.cansHeight * 3,
					canvasId: 'cans-id-mask',
					success: function(res) {
						uni.hideLoading();

						getApp().globalData.maskAvatarSavedTempPath = res.tempFilePath;
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function(res) {
								if (_this.savedCounts == 0) {
									_this.modalName = 'saveTip';
								} else {
									uni.showToast({
										title: '请至相册查看'
									})
								}
								_this.savedCounts++;
								uni.vibrateShort({
									success: function() {
										console.log('vibrateShort');
									}
								});
							},
							fail(res) {
								console.log(res)
								if (res.errMsg.indexOf("fail")) {
									uni.showModal({
										title: '您需要授权相册权限',
										success(res) {
											if (res.confirm) {
												uni.openSetting({
													success(res) {
														console.log("相册授权成功");
													},
													fail(res) {
														console.log(res)
													}
												})
											}
										}
									})
								}
							}
						});
					},
					fail(res) {
						uni.hideLoading()
					}
				}, this)
				this.tempShow = false;
			},
			showModal: function(e) {
				this.modalName = e.currentTarget.dataset.target;
			},
			hideModal: function(e) {
				this.modalName = null;
			},
			imageCheck: function(tempImagePath, callback) {
				if (!getApp().globalData.enableSecurityCheck) {
					callback(tempImagePath);
					return;
				}
				let _this = this;
				uni.compressImage({
					src: tempImagePath,
					quality: 1,
					success: res => {
						let tempFilePathCompressed = res.tempFilePath;
						wx.getFileSystemManager().readFile({
							filePath: tempFilePathCompressed, // 压缩图片，然后安全检测
							success: buffer => {
								uni.showLoading({
									title: '加载中...'
								});
								//这里是 云函数调用方法
								wx.cloud.callFunction({
									name: 'contentCheck',
									data: {
										// value: buffer.data,
										imgData: wx.cloud.CDN({
													type: 'filePath',
													filePath: tempFilePathCompressed, // img 是你的临时文件的路径 eg: http://tmp/PIyID5dIdjc1024e6ee2d57f86591545056c0a6f4b986f.png
												})
									},
									success(json) {
										console.log("checkContent result", json)
										if (json.result.errCode == 87014) {
											uni.showModal({
												title: '请勿使用违法违规内容',
												content: '图片含有违法违规内容',
												showCancel: false,
												confirmText: '知道了',
											});
											console.log("bad")
										} else {
											console.log("good")
											//图片合规则进行进一步处理
											callback(tempImagePath);
										}
									},
									fail(e) {
										console.log(e);
										uni.showModal({
											title: '请重试',
											content: '对不起，服务器开了小差',
											showCancel: false,
											confirmText: '好的',
										});
									},
									complete() {
										uni.hideLoading();
									}
								})
							}
						})

					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.avatar-container {
		height: 290px;
		width: 100%;
		margin-top: 180rpx;
		margin-left: auto;
		margin-right: auto;
		// background-size: 100%;
	}

	.avatar-bg-border {
		border: 6px solid white;
		border-radius: 10px;
		width: 282px;
		height: 282px;
	}

	.avatar-bg {
		position: absolute;
		z-index: 0;
		height: 270px;
		width: 270px;
	}

	.action-wrapper {
		padding-top: 10rpx;
		padding-left: 100rpx;
		padding-right: 100rpx;
		font-weight: 800;
	}

	.share-wrapper {
		padding-top: 10rpx;
		padding-left: 100rpx;
		padding-right: 100rpx;
		font-weight: 800;
	}

	.mask {
		height: 100px;
		width: 100px;
		position: absolute;
		top: 100px;
		border: 3px solid rgba(255, 255, 255, 0.0);
	}

	.maskWithBorder {
		border: dashed 3px white;
	}

	.hideHandle {
		display: none;
	}

	.circle {
		border-radius: 50%;
		font-size: 15px;
		color: #000;
		line-height: 25px;
		text-align: center;
		background: #fff;
	}

	.handle,
	.cancel {
		position: absolute;
		z-index: 1;
		width: 25px;
		height: 25px;
		background-color: white;
		color: black;
	}

	.scrollView {
		width: 100%;
		position: absolute;
		bottom: 90px;
		white-space: nowrap;
	}

	.infoView {
		width: 95%;
		position: absolute;
		bottom: 85px;
		white-space: nowrap;
		background-color: white;
		margin: 10px;
		padding: 1px 5px;
		border-radius: 5px;
		white-space: pre-wrap;
	}

	.imgList {
		height: 65px;
		width: 65px;
		border: 2px solid white;
		border-radius: 5px;
		margin: 10px 10px 10px 10px;
	}

	.cans-id-mask {
		position: absolute;
		margin-top: 800rpx;
	}

	.flip-horizontal {
		-moz-transform: scaleX(-1);
		-webkit-transform: scaleX(-1);
		-o-transform: scaleX(-1);
		transform: scaleX(-1);
	}

	.container {
		position: absolute;
		background-color: #C12928;
		width: 750rpx;
		/* height: 2000rpx; */
	}

	.page-bg {
		position: absolute;
		width: 750rpx;
		height: 1600rpx;
	}

	.empty-cover {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.ad {
		margin: 100rpx 0rpx;
	}

	.top-content {
		background-color: #f8f8f8;
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
			background-color: #f8f8f8;

			image {
				width: 120rpx;
				height: 120rpx;
				border: 1rpx solid #ffffff;
				box-shadow: 0px -5px 15px 0px rgba(224, 224, 224, 0.6);
				flex-shrink: 0;
				border-radius: 5px;
			}

			.image-margin {
				margin: 0 20rpx;
			}
		}
	}
</style>
