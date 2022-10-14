<template>
	<view class="bing-progress" :style="{width:bpWidth,height:bpHeight,borderRadius:borderRadius,
	backgroundColor:backgroundColor,flexDirection:direction!='vertical'?'row':'column'}">
		<!-- 进度 -->
		<!-- #ifdef APP-NVUE -->
		<div class="bp-bar_max"
		:style="{width:barMaxWidth,height:barMaxHeight,backgroundColor:noActiveColor,
		flexDirection:direction!='vertical'?'row':'column',left:barMaxLeft,borderRadius:barBorderRadius}">
			<div class="bp-bar_sub_active"
			:style="{width:barSubActiveWidth,height:barSubActiveHeight,backgroundColor:subActiveColor,
			top:subActiveTop,bottom:subActiveBottom,left:subActiveLeft,right:subActiveRight,borderRadius:isActiveCircular?barBorderRadius:0}"></div>
			<div class="bp-bar_active"
			:style="{width:barActiveWidth,height:barActiveHeight,backgroundColor:activeColor,
			top:activeTop,bottom:activeBottom,left:activeLeft,right:activeRight,borderRadius:isActiveCircular?barBorderRadius:0}"></div>
		</div>
		<!-- #endif -->
		<!-- #ifndef APP-NVUE -->
		<view class="bp-bar_max"
		:style="{width:barMaxWidth,height:barMaxHeight,backgroundColor:noActiveColor,borderRadius:barBorderRadius,
		flexDirection:direction!='vertical'?'row':'column',left:barMaxLeft}">
			<view class="bp-bar_sub_active"
			:style="{width:barSubActiveWidth,height:barSubActiveHeight,backgroundColor:subActiveColor,
			top:subActiveTop,bottom:subActiveBottom,left:subActiveLeft,right:subActiveRight,borderRadius:isActiveCircular?barBorderRadius:0}"></view>
			<view class="bp-bar_active"
			:style="{width:barActiveWidth,height:barActiveHeight,backgroundColor:activeColor,
			top:activeTop,bottom:activeBottom,left:activeLeft,right:activeRight,borderRadius:isActiveCircular?barBorderRadius:0}"></view>
		</view>
		<!-- #endif -->
		<movable-area id="bp-marea" class="bp-marea" @touchmove.stop.prevent="touchmove" @touchstart.stop.prevent="touchstart" @touchcancel="touchend" @touchend="touchend"
		:style="{width:mareaWidth,height:mareaHeight,left:mareaLeft}">
			<!-- 拖柄 -->
			<movable-view id="bp-mview" class="bp-mview" :direction="direction=='vertical'?'vertical':'horizontal'" :animation="false"
			 :disabled="true" :x="handleX" :y="handleY" friction="10" damping="100"
			:style="{width:mhandleWidth,height:mhandleHeight,backgroundColor:handleColor,
			borderRadius:handleBorderRadius,fontSize:infoFontSize,top:mhandleTop}">
				<view id="bp-handle" class="bp-handle" :style="{fontSize:infoFontSize,width:mhandleWidth,height:mhandleHeight,borderRadius:handleBorderRadius}">
					<image class="bp-handle-img" :src="handleImgUrl" v-if="handleImgUrl" 
					:style="{fontSize:infoFontSize,width:mhandleWidth,height:mhandleHeight,borderRadius:handleBorderRadius}"></image>
					<!-- 进度值 -->
					<text class="bp-handle-text" v-if="handleImgUrl=='' && infoAlign=='handle' && showInfo" 
					:style="{fontSize:infoFontSize,color:infoColor,width:mhandleWidth,height:textHeight,borderRadius:'20px'}">{{ infoContent=='subValue'?msubValue:showValue }}{{ infoEndText }}</text>
					<!-- 挂件 -->
					<!-- #ifndef APP-NVUE -->
					<!-- 图片挂件 -->
					<image v-if="widgetPos=='top' && widgetUrl" class="bp-handle-widget" :src="widgetUrl" :style="{flexDirection: 'column',borderRadius:mwidgetBorderRadius, bottom: moffset,width:mwidgetWidth,height:mwidgetHeight,opacity:widgetOpacity,transform: mwidgetAngle}"></image>
					<image v-if="widgetPos=='right' && widgetUrl" class="bp-handle-widget" :src="widgetUrl" :style="{flexDirection: 'row',borderRadius:mwidgetBorderRadius,left: moffset,width:mwidgetWidth,height:mwidgetHeight,opacity:widgetOpacity,transform: mwidgetAngle}"></image>
					<image v-if="widgetPos=='bottom' && widgetUrl" class="bp-handle-widget" :src="widgetUrl" :style="{flexDirection: 'column',borderRadius:mwidgetBorderRadius,top: moffset,width:mwidgetWidth,height:mwidgetHeight,opacity:widgetOpacity,transform: mwidgetAngle}"></image>
					<image v-if="widgetPos=='left' && widgetUrl" class="bp-handle-widget" :src="widgetUrl" :style="{flexDirection: 'row',borderRadius:mwidgetBorderRadius,right: moffset,width:mwidgetWidth,height:mwidgetHeight,opacity:widgetOpacity,transform: mwidgetAngle}"></image>
					<!-- 自定义元素挂件 -->
					<view v-if="widgetPos=='top' && widgetUrl==''" class="bp-handle-widget" :style="{flexDirection: 'column',borderRadius:mwidgetBorderRadius,bottom: moffset,width:mwidgetWidth,height:mwidgetHeight,opacity:widgetOpacity,transform: mwidgetAngle}">
						<slot/>
					</view>
					<view v-if="widgetPos=='right' &&  widgetUrl==''" class="bp-handle-widget" :style="{flexDirection: 'row',borderRadius:mwidgetBorderRadius,left: moffset,width:mwidgetWidth,height:mwidgetHeight,opacity:widgetOpacity,transform: mwidgetAngle}">
						<slot/>
					</view>
					<view v-if="widgetPos=='bottom' && widgetUrl==''" class="bp-handle-widget" :style="{flexDirection: 'column',borderRadius:mwidgetBorderRadius,top: moffset,width:mwidgetWidth,height:mwidgetHeight,opacity:widgetOpacity,transform: mwidgetAngle}">
						<slot/>
					</view>
					<view v-if="widgetPos=='left' && widgetUrl==''" class="bp-handle-widget" :style="{flexDirection: 'row',borderRadius:mwidgetBorderRadius,right: moffset,width:mwidgetWidth,height:mwidgetHeight,opacity:widgetOpacity,transform: mwidgetAngle}">
						<slot/>
					</view>
					<!-- #endif -->
				</view>
			</movable-view>
		</movable-area>
		<!-- 进度值 -->
		<text class="bp-value" v-if="showValueState() || (infoAlign=='center'&&direction!='vertical' && showInfo)" 
		:style="{color:infoColor,fontSize:infoFontSize,left:valueLeft,width:valueWidth()+'px'}">{{ infoContent=='subValue'?msubValue:showValue }}{{ infoEndText }}</text>
	</view>
</template>

<script>
	/**
	 * 进度条，副进度条
	 */
	export default {
		created() {
			/**
			 * 获取系统屏幕信息，用于后续单位换算
			 */
			const systemInfo = uni.getSystemInfoSync()
			this.px2rpx = 750 / systemInfo.screenWidth
			this.screenWidth = systemInfo.screenWidth
			this.screenHeight = systemInfo.screenHeight
		},
		mounted() {
			// #ifndef APP-NVUE
			/**
			 * 非NVUE movable-area 滑动事件获取到的位置是相对于文档的，获取组件位置，用于计算滑块位置
			 */
			this.updateRect()
			// #endif
			this.mmax = this.valueFormat(this.max,false)
			this.percent = Math.abs((this.valueFormat(this.value) - this.min) / (this.mmax - this.min))
			this.subPercent = Math.abs((this.valueFormat(this.subValue,true) - this.min) / (this.mmax - this.min))
			if(this.reverse) {
				if(this.direction!='vertical') {
					this.handleX = (1 - this.percent) * this.barMaxLength
				}
				else {
					this.handleY = this.percent * this.barMaxLength
				}
			}
			else {
				if(this.direction!='vertical') {
					this.handleX = this.percent * this.barMaxLength
				}
				else {
					this.handleY = (1 - this.percent) * this.barMaxLength
				}
			}
			if(this.bpname=='test') {
				console.log(this.mainInfo)
			}
		},
		/**
		 * sub表示副进度条属性
		 */
		props: {
			// 组件名字
			bpname: {
				type: String,
				default: ''
			},
			width: {
				type: String,
				default: '300px'
			},
			strokeWidth: {
				type: String,
				default: '30px'
			},
			backgroundColor: {
				type: String,
				default: 'rgba(0,0,0,0)'
			},
			noActiveColor: {
				type: String,
				default: "#00ffff"
			},
			activeColor: {
				type: String,
				default: "#0000ff"
			},
			subActiveColor: {
				type: String,
				default: "#ffaaaa"
			},
			handleColor: {
				type: String,
				default: "#ffff00"
			},
			infoColor: {
				type: String,
				default: "#000000"
			},
			// 整个进度条的外边界圆角半径
			borderRadius: {
				type: String,
				default: '5px'
			},
			// 进度条内部滑轨圆角半径
			barBorderRadius: {
				type: String,
				default: '5px'
			},
			// active and subActive 是否显示圆角 NVUE默认true，其他默认false
			// #ifdef APP-NVUE
			isActiveCircular: {
				type: Boolean,
				default: true
			},
			// #endif
			// #ifndef APP-NVUE
			isActiveCircular: {
				type: Boolean,
				default: false
			},
			// #endif
			handleWidth: {
				type: String,
				default: '50px'
			},
			handleHeight: {
				type: String,
				default: '40px'
			},
			handleBorderRadius: {
				type: String,
				default: '5px'
			},
			handleImgUrl: {
				type: String,
				default: ''
			},
			disabled: {
				type: Boolean,
				default: false
			},
			direction: {
				type: String,
				default: 'horizontal'
			},
			infoEndText: {
				type: String,
				default: ""
			},
			infoFontSize: {
				type: String,
				default: '18px'
			},
			showInfo: {
				type: Boolean,
				default: true
			},
			// 进度值显示value还是subValue
			infoContent: {
				type: String,
				default: 'value'
			},
			// 进度值显示位置 left, right, center, handle
			infoAlign: {
				type: String,
				default: 'right'
			},
			max: {
				type: Number,
				default: 100
			},
			min: {
				type: Number,
				default: 0
			},
			value: {
				type: Number,
				default: 0
			},
			subValue: {
				type: Number,
				default: 0
			},
			step: {
				type: Number,
				default: 1
			},
			// 副进度条步长
			subStep: {
				type: Number,
				default: 1
			},
			// true连续滑动，false步进，即以step的间隔变化
			continuous: {
				type: Boolean,
				default: true
			},
			// 副进度条continuous
			subContinuous: {
				type: Boolean,
				default: true
			},
			reverse: {
				type: Boolean,
				default: false
			},
			// 挂件位置 top, right, bottom, left
			widgetPos: {
				type: String,
				default: "top"
			},
			widgetHeight: {
				type: [String,Number],
				default: '40px'
			},
			widgetWidth: {
				type: [String,Number],
				default: '50px'
			},
			widgetBorderRadius: {
				type: [String,Number],
				default: '5px'
			},
			// 挂件不透明度 0完全透明 1不透明
			widgetOpacity: {
				type: [String,Number],
				default: 1
			},
			// 挂件距离组件的偏移量，正数原理组件，负数靠近组件
			widgetOffset: {
				type: [String,Number],
				default: '0px'
			},
			// 挂件图片
			widgetUrl: {
				type: String,
				default: ''
			},
			// 挂件旋转角度
			widgetAngle: {
				type: [String,Number],
				default: 0
			}
		},
		data() {
			return {
				handleX: 50,
				handleY: 0,
				px2rpx: 1,
				percent: 0, // 0-1
				subPercent: 0, // 0-1
				mainInfo: {
					left: 0,
					top: 0,
					bottom: 0,
					right: 0
				},
				touchState: false,
				screenHeight: 0,
				screenWidth: 0,
				msubValue: 0,
				moveable: true,
				lastTouchTime: 0,
				mmax: 100
			}
		},
		watch: {
			/**
			 * @param {Object} newValue
			 * @param {Object} oldValue
			 */
			value(newValue, oldValue) {
				if(!this.touchState) {
					newValue = this.valueSetBoundary(newValue)
					this.percent = Math.abs((newValue - this.min) / (this.mmax - this.min))
				}
			},
			showValue(newValue, oldValue) {
				// 步进
				if(!this.continuous) {
					let percent
					if(this.reverse) {
						if(this.direction!='vertical') {
							percent = Math.abs(1 - (newValue - this.min) / (this.mmax - this.min))
							this.handleX = percent * this.barMaxLength
						}
						else {
							percent = Math.abs((newValue - this.min) / (this.mmax - this.min))
							this.handleY = percent * this.barMaxLength
						}
					}
					else {
						if(this.direction!='vertical') {
							percent = Math.abs((newValue - this.min) / (this.mmax - this.min))
							this.handleX = percent * this.barMaxLength
						}
						else {
							percent = (1 - Math.abs((newValue - this.min) / (this.mmax - this.min)))
							this.handleY = percent * this.barMaxLength
						}
					}
					
				}
				this.$emit("change", {bpname: this.bpname,type: 'change',value:this.showValue,subValue:this.msubValue})
				this.$emit("valuechange", {bpname: this.bpname,type: 'valuechange',value:this.showValue,subValue:this.msubValue})
			},
			percent(newValue, oldValue) {
				// 连续
				if(this.continuous) {
					if(this.reverse) {
						if(this.direction!='vertical') {
							this.handleX = (1 - newValue) * this.barMaxLength
						}
						else {
							this.handleY = newValue * this.barMaxLength
						}
					}
					else {
						if(this.direction!='vertical') {
							this.handleX = newValue * this.barMaxLength
						}
						else {
							this.handleY = (1 - newValue) * this.barMaxLength
						}
					}
				}
			},
			subValue(newValue, oldValue) {
				newValue = this.valueSetBoundary(newValue)
				
				if(this.subContinuous) {
					this.msubValue = newValue
				}
				else {
					this.msubValue = this.valueFormat(newValue, true)
				}
				this.subPercent = Math.abs((newValue - this.min) / (this.mmax - this.min))
				this.$emit("change", {bpname: this.bpname,type: 'change',value:this.showValue,subValue:this.msubValue})
				this.$emit("subvaluechange", {bpname: this.bpname,type: 'subvaluechange',value:this.showValue,subValue:this.msubValue})
				
			},
			max(newValue,oldValue) {
				this.mmax = this.valueFormat(newValue,false)
			}
		},
		computed: {
			bpWidth() {
				if(this.direction=="vertical") {
					return this.maxHeight()[2]
				}
				return this.sizeDeal(this.width)[2]
			},
			bpHeight() {
				if(this.direction=="vertical") {
					return this.sizeDeal(this.width)[2]
				}
				return this.maxHeight()[2]
			},
			mareaWidth() {
				if(this.direction=="vertical") {
					return this.maxHeight()[2]
				}
				let width = this.sizeDeal(this.width)[0]
				return (width - this.textWidth()) + 'px'
			},
			mareaHeight() {
				if(this.direction=="vertical") {
					let width = this.sizeDeal(this.width)[0]
					return (width - this.textWidth()) + 'px'
				}
				return this.maxHeight()[2]
			},
			mareaLeft() {
				if(this.showValueState()) {
					if(this.infoAlign == 'left') {
						return this.textWidth() + 'px'
					}
				}
				return 0
			},
			barMaxHeight() {
				if(this.direction=="vertical") {
					let width = this.sizeDeal(this.width)[0]
					let handleWidth = this.sizeDeal(this.handleWidth)
					return (width - this.textWidth() - handleWidth[0]) + 'px'
				}
				return this.sizeDeal(this.strokeWidth)[2]
			},
			barMaxWidth() {
				if(this.direction=="vertical") {
					return this.sizeDeal(this.strokeWidth)[2]
				}
				let width = this.sizeDeal(this.width)[0]
				let handleWidth = this.sizeDeal(this.handleWidth)
				return (width - this.textWidth() - handleWidth[0]) + 'px'
			},
			barMaxLeft() {
				if(this.showValueState()) {
					if(this.infoAlign == 'left') {
						return this.textWidth() + this.sizeDeal(this.handleWidth)[0] / 2 + 'px'
					}
				}
				if(this.direction != 'vertical') {
					return this.sizeDeal(this.handleWidth)[0] / 2 + 'px'
				}
				// vertical
				return (this.maxHeight()[0] - this.sizeDeal(this.strokeWidth)[0]) / 2 + 'px'
				
			},
			activeRight() {
				if(this.reverse) {
					return 0
				}
				return 'unset'
			},
			activeLeft() {
				if(this.reverse) {
					return 'unset'
				}
				return 0
			},
			activeTop() {
				if(this.reverse) {
					return 0
				}
				return 'unset'
			},
			activeBottom() {
				if(this.reverse) {
					return 'unset'
				}
				return 0
			},
			barActiveWidth() {
				if(this.direction=="vertical") {
					return this.sizeDeal(this.strokeWidth)[2]
				}
				let percent
				if(this.continuous) {
					percent = this.percent
				}
				else {
					percent = Math.abs((this.showValue - this.min) / (this.mmax - this.min))
				}
				return this.barMaxLength * percent + 'px'
			},
			barActiveHeight() {
				if(this.direction=="vertical") {
					let percent
					if(this.continuous) {
						percent = this.percent
					}
					else {
						percent = Math.abs((this.showValue - this.min) / (this.mmax - this.min))
					}
					return this.barMaxLength * percent + 'px'
				}
				return this.sizeDeal(this.strokeWidth)[2]
			},
			subActiveTop() {
				if(this.reverse) {
					return 0
				}
				return 'unset'
			},
			subActiveBottom() {
				if(this.reverse) {
					return 'unset'
				}
				return 0
			},
			subActiveRight() {
				if(this.reverse) {
					return 0
				}
				return 'unset'
			},
			subActiveLeft() {
				if(this.reverse) {
					return 'unset'
				}
				return 0
			},
			barSubActiveWidth() {
				if(this.direction == "vertical") {
					return this.sizeDeal(this.strokeWidth)[2]
				}
				if(this.subContinuous) {
					return this.barMaxLength * this.subPercent + 'px'
				}
				else {
					return this.barMaxLength * Math.abs((this.msubValue - this.min) / (this.mmax - this.min)) + 'px'
				}
				
			},
			barSubActiveHeight() {
				if(this.direction == "vertical") {
					if(this.subContinuous) {
						return this.barMaxLength * this.subPercent + 'px'
					}
					else {
						this.barMaxLength * Math.abs((this.msubValue - this.min) / (this.mmax - this.min)) + 'px'
					}
					
				}
				return this.sizeDeal(this.strokeWidth)[2]
			},
			mhandleWidth() {
				if(this.direction == "vertical") {
					return this.sizeDeal(this.handleHeight)[2]
				}
				return this.sizeDeal(this.handleWidth)[2]
			},
			mhandleHeight() {
				if(this.direction == "vertical") {
					return this.sizeDeal(this.handleWidth)[2]
				}
				return this.sizeDeal(this.handleHeight)[2]
			},
			mhandleTop() {
				if(this.direction == 'vertical') {
					return 0
				}
				else {
					// 拖柄垂直居中
					let handle = this.sizeDeal(this.handleHeight)[0]
					let top = this.maxHeight()[0] / 2 - handle / 2 + 'px'
					return top
				}
			},
			showValue() {
				return this.valueFormat(this.percent * (this.mmax - this.min) + this.min)
			},
			textHeight() {
				let infoSize = this.sizeDeal(this.infoFontSize)
				return infoSize[0]*1.2 + infoSize[1]
			},
			valueLeft() {
				if(this.infoAlign=='left') {
					return 0
				}
				else if(this.infoAlign == 'center') {
					let width = this.sizeDeal(this.width)
					return width[0]/2 - this.valueWidth()/2 + 'px'
				}
				else if(this.infoAlign=='right'){
					let width = this.sizeDeal(this.width)
					return width[0] - this.textWidth() + 'px'
				}
				return 0
			},
			barMaxLength() {
				let width = this.sizeDeal(this.width)[0]
				let handleWidth = this.sizeDeal(this.handleWidth)
				return width - this.textWidth() - handleWidth[0]
			},
			mwidgetWidth() {
				return this.sizeDeal(this.widgetWidth)[2];
			},
			mwidgetHeight() {
				return this.sizeDeal(this.widgetHeight)[2];
			},
			moffset() {
				let off = this.sizeDeal(this.widgetOffset);
				// console.log(off)
				switch(this.widgetPos) {
					case 'top':
						return this.sizeDeal(this.mhandleHeight)[0] + off[0] + 'px'
					case 'right':
						return this.sizeDeal(this.mhandleWidth)[0] + off[0] + 'px'
					case 'bottom':
						return this.sizeDeal(this.mhandleHeight)[0] + off[0] + 'px'
					case 'left':
						return this.sizeDeal(this.mhandleWidth)[0] + off[0] + 'px'
				}
				return 0
			},
			mwidgetBorderRadius() {
				return this.sizeDeal(this.widgetBorderRadius)[2];
			},
			mwidgetAngle() {
				return "rotate("+Number(this.widgetAngle)+"deg)"
			}
		},
		methods: {
			prevent(e) {
				console.log(1)
			},
			updateRect() {
				// #ifndef APP-NVUE
				/**
				 * 非NVUE movable-area 滑动事件获取到的位置是相对于文档的，获取组件位置，用于计算滑块位置
				 */
				let query = uni.createSelectorQuery().in(this)
				query.select('.bing-progress').boundingClientRect(data => {
					this.mainInfo.top = data.top
					this.mainInfo.left = data.left
					this.mainInfo.bottom = data.bottom
					this.mainInfo.right = data.right
				}).exec()
				// #endif
			},
			touchstart(e) {
				if(!this.disabled) {
					// #ifdef APP-NVUE
					e.stopPropagation()
					e.target.attr.preventGesture = true
					if(this.direction == 'vertical' && e.target.attr.id != 'bp-mview' && (e.timestamp - this.lastTouchTime > 100)) {
						this.moveable = false
					}
					this.lastTouchTime = e.timestamp
					// #endif
					// #ifndef APP-NVUE
					/**
					 * 防止组件在文档流中的位置被修改，导致组件进度值异常
					 */
					this.updateRect()
					// #endif
					// 阻止组件信息异常情况下的进度值修改
					if(this.mainInfo.top > this.screenHeight) {
						this.$emit("dragstart", {bpname: this.bpname,type: 'dragstart',value:this.showValue,subValue:this.msubValue})
						return
					}
					this.touchState = true
					let detail = e.changedTouches[0]
					this.handleMove(detail)
					this.$emit("dragstart", {bpname: this.bpname,type: 'dragstart',value:this.showValue,subValue:this.msubValue})
				}
			},
			touchmove(e) {
				if(!this.disabled) {
					let detail = e.changedTouches[0]
					this.handleMove(detail)
					this.$emit("dragging", {bpname: this.bpname,type: 'dragging',value:this.showValue,subValue:this.msubValue})
				}
			},
			touchend(e) {
				if(!this.disabled) {
					// #ifdef APP-NVUE
					if(!this.moveable) {
						this.moveable = true
						return
					}
					// #endif
					let detail = e.changedTouches[0]
					this.handleMove(detail)
					this.touchState = false
					this.$emit("dragend", {bpname: this.bpname,type: 'dragend',value:this.showValue,subValue:this.msubValue})
				}
			},
			handleMove(detail) {
				let width = this.sizeDeal(this.width)[0]
				let handleWidth = this.sizeDeal(this.handleWidth)
				let percent
				if(this.direction!='vertical') {
					if(this.infoAlign=='left') {
						// #ifndef APP-NVUE
						percent = (detail.pageX - this.mainInfo.left - this.textWidth() - handleWidth[0]/2)/ this.barMaxLength
						// #endif
						// #ifdef APP-NVUE
						percent = (detail.pageX  - handleWidth[0]/2)/ this.barMaxLength
						// #endif
					}
					else {
						// #ifndef APP-NVUE
						percent = (detail.pageX - this.mainInfo.left - handleWidth[0]/2)/ this.barMaxLength
						// #endif
						// #ifdef APP-NVUE
						percent = (detail.pageX - handleWidth[0]/2)/ this.barMaxLength
						// #endif
					}
				}
				else {
					// #ifdef APP-NVUE
					percent = 1 - (detail.pageY - handleWidth[0]/2- 1) / this.barMaxLength
					// #endif
					// #ifndef APP-NVUE
					percent = 1 - (detail.clientY - this.mainInfo.top - handleWidth[0]/2)/ this.barMaxLength
					// #endif
				}
				percent = percent > 0 ? percent : 0
				percent = percent < 1 ? percent : 1
				if(this.reverse) {
					this.percent = 1 - percent
				}
				else {
					this.percent = percent
				}
			},
			showValueState() {
				if(this.direction != 'vertical' && this.showInfo && (this.infoAlign=='left' || this.infoAlign=='right')) {
					return true
				}
				return false
			},
			valueSetBoundary(value) {
				// 控制value在合法范围内
				if(this.mmax > this.min) {
					value = value < this.mmax ? value : this.mmax
					value = value > this.min ? value : this.min
				}
				else {
					value = value > this.mmax ? value : this.mmax
					value = value < this.min ? value : this.min
				}
				return value
			},
			/**
			 * @param {Object} v
			 * @param {Object} isSub 是否是副副进度条
			 */
			valueFormat (v,isSub){
				// set step
				v = this.valueSetBoundary(v)
				let stepInfo = this.stepInfo(isSub)
				v = Number(v - this.min).toFixed(stepInfo[1])
				let step = stepInfo[0] * 10 ** stepInfo[1]
				let valueE = v * 10 ** stepInfo[1]
				let remainder = valueE % step
				let remainderInt = Math.floor(remainder)
				// 对余数四舍五入0-1
				let sub = Math.round(remainder / step)
				let value = (Math.floor(valueE) - remainderInt + sub*step) / (10 ** stepInfo[1])
				value = Number((value + this.min).toFixed(stepInfo[1]))
				return value
			},
			/**
			 * @param {Object} v
			 * @param {Object} isSub 是否是副副进度条
			 */
			stepInfo(isSub) {
				// return step, decimal位数
				let step 
				if(isSub) {
					step = Number(this.subStep)
				}
				else {
					step = Number(this.step)
				}
				
				if (step <= 0 || !step){
					return [1, 0]
				}
				else{
					let steps = step.toString().split('.')
					if (steps.length == 1){
						return [step,0]
					}
					else {
						return [step,steps[1].length]
					}
				}
			},
			textWidth() {
				if(this.showValueState()) {
					let numWidth = this.mmax.toString().length> this.min.toString().length? this.mmax.toString().length: this.min.toString().length
					let textWidth = ((numWidth + this.stepInfo()[1]) * 0.7 + this.infoEndText.length) * this.sizeDeal(this.infoFontSize)[0]
					return Number(textWidth.toFixed(2))
				}
				return 0
			},
			valueWidth() {
				let numWidth = this.mmax.toString().length> this.min.toString().length? this.mmax.toString().length: this.min.toString().length
				let textWidth = ((numWidth + this.stepInfo()[1]) * 0.7 + this.infoEndText.length) * this.sizeDeal(this.infoFontSize)[0]
				return Number(textWidth.toFixed(2))
			},
			maxHeight() {
				let h = []
				if (this.direction!='vertical'){ // direction 为 vertical 时不显示info
					let subt = this.infoEndText.match(/[^\x00-\xff]/g)
					if (subt){
						h.push(this.sizeDeal(this.infoFontSize)[0] * 1.1)
					}
					else{
						h.push(this.sizeDeal(this.infoFontSize)[0])
					}
				}
				h.push(this.sizeDeal(this.strokeWidth)[0])
				h.push(this.sizeDeal(this.handleHeight)[0])
				h.sort(function(a, b) {
					return b - a
				}) // 降序
				return [h[0], 'px', h[0] + 'px']
			},
			sizeDeal(size) {
				// 分离字体大小和单位,rpx 转 px
				let s = Number.isNaN(parseFloat(size)) ? 0 : parseFloat(size)
				let u = size.toString().replace(/[0-9\.]/g, '')
				if (u == 'rpx') {
					s /= this.px2rpx
					u = 'px'
				}else if (u == 'vw') {
					u = 'px'
					s = s / 100 * this.screenWidth
				} else if(u == 'vh') {
					u = 'px'
					s = s / 100 * this.screenHeight
				} else{
					u = 'px'
				}
 				
				return [s, u, s + u]
			},
		}
	}
</script>

<style scoped>
	@import "bing_progress.css"
</style>
