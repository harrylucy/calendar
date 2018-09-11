# calendar
移动端日历插件
---

## 使用说明


**使用说明：**


1. 引入 Calendar 样式（`css` 目录下）：

  ```html
  <link rel="stylesheet" href="./css/calendar.css"/>
  ```

2. 引入 jQuery 相关文件及 Calendar JS 文件（下载包 `js` 目录下）：

  ```html
  <script src="./js/jquery-2.1.0.min.js"></script>
  <script src="./js/calendar.js"></script>
  ```

3. 初始化 Calendar:

  ```html
    <input readonly class="ipt-date">
  ```
  ```javascript
  var calendar = $('.ipt-date').calendar({
           defaultDate:"2018-09-05",
           startDate:"2018-09-05",
           endDate:"2018-09-20",
           weekDisabled:false,
           enableDay:['2018-09-04'],
           disableDay:['2018-09-06'],
           onSelected:function(val){
     	      console.log(val)
            },
           onChange:function(val){
  		      console.log(val)
  	      }
     });
  ```

## 调用方法

**设置最小时间：`setStartDate` 选项**

```html
<input readonly class="ipt-date">
```
```javascript
var calendar = $('.ipt-date').calendar({
         defaultDate:"2018-09-05",
         startDate:"2018-09-05",
         endDate:"2018-09-20",
         weekDisabled:false,
         enableDay:['2018-09-04'],
         disableDay:['2018-09-06'],
         onSelected:function(val){
   	      console.log(val)
          },
         onChange:function(val){
		      console.log(val)
	      }
   });

   calendar.setStartDate(null);
```


## 插件配置


### format

日期格式：接受`String`,默认为`yyyy-MM-dd`

日期格式组合: p, P, h, hh, i, ii, s, ss, d, dd, m, mm, M, MM, yy, yyyy.

ss(秒), ii(分), hh(小时), HH(小时), dd(天), mm(月),代表不足两位数，以0作为占位符（01-02）

* p : 小写时间分界点('am' or 'pm')
* P : 大写时间分界点('AM' or 'PM')
* s : 秒
* ss : 秒
* i : 分
* ii : 分
* h : 小时, 24小时格式
* hh : 小时, 24小时格式
* H : 小时, 12小时格式
* HH : 小时, 12小时格式
* d : 天
* dd : 天
* m : 月
* mm : 月
* M : 月份短文本表述
* MM : 月份短文本表述
* yy : 年, 2位数字表示
* yyyy : 年, 4位数字表示


### startDate

设置时间开始参数：接受 `Date` 类型值，开始时间前面的日期将被设置为 `disabled`。

### endDate

设置结束时间参数：接受 `Date` 类型值，结束时间后面的日期将被设置为 `disabled`。

### weekDisabled

禁用周末：接受 `Boolean`

- 默认值为 `false`

### enableDay

设置时间可选的时间点： 接受Array类型值
- 默认值为：`[]`
- 示例`["2018-10-06","2018-10-10"]`

### disableDay

设置时间不可选的时间点： 接受Array类型值
- 默认值为：`[]`
- 示例`["2018-09-06"]`

## 回调

### `onSelected`
点击确定按钮后触发的事件： 返回值为选择的日期

```javascript
$('.ipt-date').calendar({
         onSelected:function(val){
   	      console.log(val)
          }})
```

### `onCancel`
点击取消按钮后触发的事件

```javascript
$('.ipt-date').calendar({
         onCancel:function(){

          }})
```

### `onChange`
改变选择的日历后： 返回值为选择的日期

```javascript
$('.ipt-date').calendar({
         onChange:function(val){
   	      console.log(val)
          }})
```

## 方法

### `show`

时间选择器显示时触发。

```javascript
$('.ipt-date').calendar().onShow();
```

### `hide`

时间选择器隐藏时触发。

```javascript
$('.ipt-date').calendar().onHide();
```

### `onDestoryed`

销毁日历。

```javascript
$('.ipt-date').calendar().onDestoryed();
```

### `setStartDate`

设置最小时间。

```javascript
$('.ipt-date').calendar().setStartDate('2018-09-02');
```

### `setEndDate`

设置最大时间。

```javascript
$('.ipt-date').calendar().setEndDate('2018-10-02');
```


### `setDate`

设置日历选择时间。

```javascript
$('.ipt-date').calendar().setDate('2018-09-02');
```


### `setWeekDisabled`

设置禁用周末。

```javascript
$('.ipt-date').calendar().setWeekDisabled(true);
```

