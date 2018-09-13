;(function($,window,document){
	var PLIGINNAME = "calendar";
	'use strict';
	$.fn.calendar = function(options){
		return  new Calendar(this,options);
	}

	var noop = function(){};

	Date.prototype.format = function (format) {
		var date = this;
		var zeroize = function (value, length) {
			if (!length) {
				length = 2;
			}
			value = new String(value);
			for (var i = 0, zeros = ''; i < (length - value.length); i++) {
				zeros += '0';
			}
			return zeros + value;
		};
		return format.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, function($0) {
			switch ($0) {
				case 'd': return date.getDate();
				case 'dd': return zeroize(date.getDate());
				case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][date.getDay()];
				case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
				case 'M': return date.getMonth() + 1;
				case 'MM': return zeroize(date.getMonth() + 1);
				case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
				case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()];
				case 'yy': return new String(date.getFullYear()).substr(2);
				case 'yyyy': return date.getFullYear();
				case 'h': return date.getHours() % 12 || 12;
				case 'hh': return zeroize(date.getHours() % 12 || 12);
				case 'H': return date.getHours();
				case 'HH': return zeroize(date.getHours());
				case 'm': return date.getMinutes();
				case 'mm': return zeroize(date.getMinutes());
				case 's': return date.getSeconds();
				case 'ss': return zeroize(date.getSeconds());
				case 'l': return date.getMilliseconds();
				case 'll': return zeroize(date.getMilliseconds());
				case 'tt': return date.getHours() < 12 ? 'am' : 'pm';
				case 'TT': return date.getHours() < 12 ? 'AM' : 'PM';
			}
		});
	}
	var Calendar = function(ele,opt){
		this.defaults = {
			format:'yyyy-MM-dd',
			defaultDate:undefined,
			startDate:'1000-01-01',
			endDate:'9999-01-01',
			weekDisabled:false,
			enableDay:[],
			disableDay:[],
			onSelected:noop,
			onChange:noop,
			onCancel:noop,
		};
		this.ele = '';
		this.calId = new Date().getTime();
		this.options = {};
		this.disablDateList = [];
		this.enablDateList = [];
		this.selectDate = {};
		this.toDay = {};
		this.currDate ={};
		this.init(ele,opt);
	}

	function isDate(date){
		return isNaN(date)&&!isNaN(Date.parse(date));
	}
	function getMonthLastDay(year,month){
		return year+'-'+month+'-'+new Date(year,month,0).getDate();
	}
	function getMonthFirstDay(year,month){
		return new Date(year+'-'+month+'-'+'1');
	}
	function getPreMonth(year,month){
		return new Date(year,month,0).getMonth()+1;
	}
	function getNextMonth(year,month){
		return new Date(year,month,32).getMonth()+1;
	}

	function comptime(startTime,endTime){
		var start = new Date(startTime);
		var end = new Date(endTime);
		if(start > end) return 1;
		if(start < end) return -1;
		return 0;
	}
	Calendar.prototype = {
		 init:function(ele,opt){
		 	this.ele = ele;
			this.options = $.extend({},this.defaults,opt);
			for(var n =0;n<this.options.enableDay.length;n++){
				this.enablDateList[new Date(this.options.enableDay[n]).format('yyyy-M-d')] = true;
			}
			for(var n =0;n<this.options.disableDay.length;n++){
				this.disablDateList[new Date(this.options.disableDay[n]).format('yyyy-M-d')] = true;
			}
			if(typeof(this.options.defaultDate) === 'string'){
				var date = new Date();
				if(isDate(this.options.defaultDate)){
					date = new Date(this.options.defaultDate);
				};
				this.selectDate = {
					year:date.getFullYear(),
					month:date.getMonth()+1,
					day:date.getDate()
				};
				this.currDate = {
					year:date.getFullYear(),
					month:date.getMonth()+1
				};
			}else{
				var date = new Date();
				this.selectDate = {
					year:new Date().getFullYear(),
					month:new Date().getMonth()+1,
					day:new Date().getDate()
				};
				this.currDate = {
					year:new Date().getFullYear(),
					month:new Date().getMonth()+1
				};
			}
			 this.toDay = {
				 year:new Date().getFullYear(),
				 month:new Date().getMonth()+1,
				 day:new Date().getDate()
			 };
			 if(!isDate(this.options.startDate)){
				this.options.startDate = this.defaults.startDate;
			 }

			 if(!isDate(this.options.endDate)){
				 this.options.endDate = this.defaults.endDate;
			 }
			 this.render();
			 this.calenderDom = $('.calendar-box[data-id="'+this.calId+'"]');
			 var _self = this;
			 this.calenderDom.on('click','.year-pre',function(){
				 _self.currDate.year -=1;
				 _self.updatevView();
			 });
			 this.calenderDom.on('click','.year-next',function(){
				 _self.currDate.year +=1;
				 _self.updatevView();

			 });
			 this.calenderDom.on('click','.month-pre',function(){
				 _self.currDate.month = getPreMonth(_self.currDate.year,_self.currDate.month-1);
				 if(_self.currDate.month == 12){
					 _self.currDate.year -=1;
				 }
				 _self.updatevView();
			 });
			 this.calenderDom.on('click','.month-next',function(){
				 _self.currDate.month = getNextMonth(_self.currDate.year,_self.currDate.month-1);
				 if(_self.currDate.month == 1){
					 _self.currDate.year +=1;
				 }
				 _self.updatevView();
			 });
			 this.calenderDom.on('click','.day-list>li:not(.disabled)',function(){
			 	var date = {
			 		year:$(this).data('year'),
					month:$(this).data('month'),
					day:$(this).data('day'),
				};
				if(date.year == _self.selectDate.year&&date.month == _self.selectDate.month&&date.day == _self.selectDate.day){

				}else{
					_self.selectDate = date;
					_self.calenderDom.find('.day-list>li.select').removeClass('select');
					$(this).addClass('select');

					var val = new Date(_self.selectDate.year+'-'+_self.selectDate.month+'-'+_self.selectDate.day).format(_self.options.format);
					_self.options.onChange(val);
				}
			 });
			 this.calenderDom.on('click','.btn-cal-cancel',function(){
				 _self.onHide();
				 _self.options.onCancel();
			 });
			 this.calenderDom.on('click','.btn-cal-finish',function(){
				 _self.onHide();
				 var val = new Date(_self.selectDate.year+'-'+_self.selectDate.month+'-'+_self.selectDate.day).format(_self.options.format);
				 _self.options.onSelected(val);
				 _self.ele.val(val);
			 });
			 this.calenderDom.on('click','.calendar-mask',function(){
				 _self.onHide();
			 });
			 this.ele.attr('onlyread');
			 this.ele.val(new Date(_self.selectDate.year+'-'+_self.selectDate.month+'-'+_self.selectDate.day).format(_self.options.format));
			 this.ele.click(function(){
			 	_self.onShow();
			 })
		},
		render:function(){
			var dayHtml = this.setDayHtml();
			var calendarHtml =   '<div class="calendar-box" data-id="'+this.calId+'">'+
			  '<div class="calendar-mask"></div>'+
			  '<div class="calendar-content">'+
			'<div class="cal-header">'+
			'<div class="cal-header-left">'+
			'<button class="btn-cal-cancel">取消</button>'+
			'</div>'+
			'<div class="cal-header-title">请选择日期</div>'+
			'<div class="cal-header-right">'+
			'<button class="btn-cal-finish">确定</button>'+
			'</div>'+
			'</div>'+
			'<div class="cal-inner-content">'+
			'<div class="cal-date">'+
			'<div class="cal-year">'+
			'<i class="icon icon-arrow-right year-pre"></i>'+
			'<i class="icon icon-arrow-left year-next"></i>'+
			'<span class="year-txt">'+this.selectDate.year+'</span>'+
			'</div>'+
			'<div class="cal-month">'+
			'<i class="icon icon-arrow-right month-pre"></i>'+
			'<i class="icon icon-arrow-left month-next"></i>'+
			'<span class="month-txt">'+this.selectDate.month+'</span>'+
			'</div>'+
			'</div>'+
			'<div class="cal-day">'+
			'<div class="cal-day-inner">'+
			'<div class="cal-show-week">'+
			'<ul class="week-list">'+
			'<li class="week-item">日</li>'+
			'<li class="week-item">一</li>'+
			'<li class="week-item">二</li>'+
			'<li class="week-item">三</li>'+
			'<li class="week-item">四</li>'+
			'<li class="week-item">五</li>'+
			'<li class="week-item">六</li>'+
			'</ul>'+
			'</div>'+
			'<div class="cal-show-day">'+
			'<ul class="day-list">'+
			  dayHtml+
			'</ul>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'</div>';
			$('body').append(calendarHtml);
		},
		updatevView:function(){
			var dayHtml = this.setDayHtml();
			this.calenderDom.find('.day-list').html(dayHtml);
			this.calenderDom.find('.month-txt').html( this.currDate.month);
			this.calenderDom.find('.year-txt').html( this.currDate.year);
		},
		setDayHtml:function(){
			var allDay = this.getMonthAllDay();
			var dayHtml = '';
			for(var i=0; i<allDay.length;i++){
				var isDisable = this.isValid(allDay[i]);
				var className = isDisable==false?'disabled':'';
				if(allDay[i].type =='currMonth' && comptime(this.toDay.year+'-'+this.toDay.month+'-'+this.toDay.day,allDay[i].date)== 0){
					className+=' today';
				}
				if(allDay[i].type =='currMonth' && comptime(this.selectDate.year+'-'+this.selectDate.month+'-'+this.selectDate.day,allDay[i].date)== 0){
					className+=' select';
				}
				dayHtml += '<li class="cal-day-item '+className+'"data-year="'+allDay[i].year+'" data-month="'+allDay[i].month+'" data-day="'+allDay[i].day+'"><span>'+allDay[i].day+'</span></li>';
			}
			return dayHtml;
		},
		getMonthAllDay:function(){
			var dayList = [];
			var firstDay = getMonthFirstDay(this.currDate.year,this.currDate.month);
			var lastDay =  getMonthLastDay(this.currDate.year,this.currDate.month);
			var day = firstDay.getDay();
			var lastMonth={};
			var nextMonth={};
			if(this.currDate.month==1){
				lastMonth.year = this.currDate.year-1;
				lastMonth.month = 12;
			}else{
				lastMonth.year = this.currDate.year;
				lastMonth.month = this.currDate.month - 1;
			}
			if(this.currDate.month == 12){
				nextMonth.year = this.currDate.year +1 ;
				nextMonth.month = 1;
			}else{
				nextMonth.year = this.currDate.year;
				nextMonth.month = this.currDate.month + 1;
			}

			var lastMouthDay = getMonthLastDay(lastMonth.year,lastMonth.month);
			//前一个月
			for(var i = day-1; i >= 0; i--){
				dayList.push({date:lastMonth.year+'-'+lastMonth.month+'-'+(new Date(lastMouthDay).getDate()-i),type:'lastMonth',year:lastMonth.year,month:lastMonth.month,day:(new Date(lastMouthDay).getDate()-i)});
			}
			//当个月
			for(var i = 1; i <= new Date(lastDay).getDate(); i++){
				dayList.push({date:this.currDate.year+'-'+this.currDate.month+'-'+i,type:'currMonth',year:this.currDate.year,month:this.currDate.month,day:i});

			}
			//下个月
			for(var i = dayList.length,n = 1; i < 42; i++){
				dayList.push({date:nextMonth.year+'-'+nextMonth.month+'-'+n,type:'nextMonth',year:nextMonth.year,month:nextMonth.month,day:n});
				n++;
			}

			for(var i = 0; i<42; i++){
				if(i%7==0||i%7==6){
					dayList[i].isWeek = true;
				}else{
					dayList[i].isWeek = false;
				}
			}
			return dayList;
		},
		isValid:function(dateMsg){

			if(dateMsg.type !='currMonth'){
				return false;
			}

			if(this.enablDateList[dateMsg.date]==true){
				return true;
			}
			if(this.disablDateList[dateMsg.date]==true){
				return false;
			}

			if (this.options.weekDisabled && dateMsg.isWeek) {
				return false;
			}
			if((isDate(this.options.startDate) && (comptime(dateMsg.date,this.options.startDate) == 1 ||comptime(dateMsg.date,this.options.startDate)== 0)&&(isDate(this.options.endDate) && (comptime(dateMsg.date,this.options.endDate) == -1 ||comptime(dateMsg.date,this.options.endDate)== 0)))){
				return true;
			}

			return false;
		},
		onShow:function(){
			this.calenderDom.find('.calendar-mask').show().animate({'opacity':'1'},200);
			this.calenderDom.find('.calendar-content').show().animate({'bottom':'0'},400);
		},
		onHide:function(){
			this.calenderDom.find('.calendar-mask').animate({'opacity':'0'},300,function(){
				$(this).hide();
			});
			this.calenderDom.find('.calendar-content').animate({'bottom':'-100%'},300,function(){
				$(this).hide();
			});
		},
		onDestoryed:function(){
			this.calenderDom.remove();
		},
		setStartDate:function(date){
			if(isDate(date)){
				this.options.startDate = date ;
			}else{
				if(date == null){
					this.options.startDate = this.defaults.startDate;;
				}
			}
			this.updatevView();
			return this;
		},
		setEndDate:function(date){
			if(isDate(date)){
				this.options.endDate = date ;
			}else{
				if(date == null){
					this.options.endDate = this.defaults.endDate;;
				}
			}
			this.updatevView();
			return this;
		},
		setDate:function(strDate){
			if(typeof(strDate) === 'string'){
				var date = new Date();
				if(isDate(strDate)){
					date = new Date(strDate);
				}
				this.selectDate = {
					year:date.getFullYear(),
					month:date.getMonth()+1,
					day:date.getDate()
				}
				this.currDate = {
					year:date.getFullYear(),
					month:date.getMonth()+1
				}
			}else{
				var date = new Date();
				this.selectDate = {
					year:new Date().getFullYear(),
					month:new Date().getMonth()+1,
					day:new Date().getDate()
				}
				this.currDate = {
					year:new Date().getFullYear(),
					month:new Date().getMonth()+1
				}
			}
			this.ele.val(new Date(this.selectDate.year+'-'+this.selectDate.month+'-'+this.selectDate.day).format(this.options.format));
			this.updatevView();
			return this;
		},
		setWeekDisabled:function(set){
		 	if(set === true){
		 		this.options.weekDisabled = true;
			}else{
				this.options.weekDisabled = false;
			}
			this.updatevView();
		 	return this;
		}


	}

})($,window,document);