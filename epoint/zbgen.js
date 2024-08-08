// ==UserScript==
// @name         小组周报生成器
// @namespace    http://tampermonkey.net/
// @version      2024-08-05
// @description  小猪肘饱
// @author       icelo.org
// @match        https://oa.epoint.com.cn/epointoa9/frame/pages/basic/communication/waithandle/*
// @match        https://oa.epoint.com.cn/dailyreportmanage/pages/dailyrecord/dailyrecordaddv2/gzrz/gzrzcontent*
// @match        https://oa.epoint.com.cn/dailyreportmanage/pages/dailyrecord/dailyrecordaddv2/gzrz/fydetail_edit?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epoint.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502698/%E5%B0%8F%E7%BB%84%E5%91%A8%E6%8A%A5%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/502698/%E5%B0%8F%E7%BB%84%E5%91%A8%E6%8A%A5%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
     // 等待页面加载完成
    var url = window.location.href;
    console.log(url);
    if(url.startsWith('https://oa.epoint.com.cn/epointoa9/frame/pages/basic/communication/waithandle/')) {
        var NewNode = document.createElement('input');
        NewNode.setAttribute("type",'button');
        NewNode.setAttribute('value','生成周报');
        document.getElementsByClassName('fui-toolbar')[0].appendChild(NewNode);
        NewNode.addEventListener("click", gen);

    }

    else if(url.startsWith('https://oa.epoint.com.cn/dailyreportmanage/pages/dailyrecord/dailyrecordaddv2/gzrz/fydetail_edit')) {
        var cbButtonNode = document.createElement('input');
        cbButtonNode.setAttribute("type",'button');
        cbButtonNode.setAttribute('value','转换餐补');
        document.getElementsByClassName('fui-toolbar')[0].appendChild(cbButtonNode);
        cbButtonNode.addEventListener("click", cb);
    }

    else if(url.startsWith('https://oa.epoint.com.cn/dailyreportmanage/pages/dailyrecord/dailyrecordaddv2/gzrz/gzrzcontentold')){
        var taskGrid = mini.get('taskGrid');
        var columns = taskGrid.columns;

        //展示任务评审工时
        columns.insert(12,{
						width : 50,
						headerAlign : "center",
						align : "center",
						header : '标准任务工时（self）',
                        field : 'expectcosted',
            renderer:function(e){
                //职级为10的话要除1.5才是实际计划工时
                return e.value/1.27;
            }
		});


        columns.insert(13,{
						width : 50,
						headerAlign : "center",
						align : "center",
						header : '填写情况',
                        field : 'expectcosted',
            renderer:function(e){
                var costWork = e.record.realworkdays;
                var costWorkValue = costWork==""?0:costWork;
                var realWorkValue = e.value/1.27;
                if(realWorkValue > costWorkValue){
                    // 还能用
                    return "🙂";
                }
                else if(realWorkValue == costWorkValue){
                    // 刚刚好
                    return "😑"
                }
                else {
                    // 超了
                    return "😭";
                }
            }
		});


        //新增勾选框
        columns.push({
            width : 15,
            type : 'checkcolumn',
        });

        taskGrid.set({columns : columns});
        taskGrid.reload();

        var rzzbButton = document.createElement('input');
        rzzbButton.setAttribute("type",'button');
        rzzbButton.setAttribute('value','生成周报');
        var targetElement =  document.getElementById('btnopenceshimissonapplynew');
        if (targetElement.nextSibling) {
            targetElement.parentNode.insertBefore(rzzbButton, targetElement.nextSibling);
        } else {
            targetElement.parentNode.appendChild(rzzbButton);
        }

        rzzbButton.addEventListener("click", rzgen);
    }


    function rzgen(){
       var datagrid = mini.get('taskGrid');
       var ids = datagrid.getSelectedIds();

        if (ids.length > 0) {
            var titleArray = [];
            var selectArrayData = mini.get(datagrid).getSelecteds();
            selectArrayData.forEach(item=>{
                const str = item.missionname;
                titleArray.add(str);
            });
            var output ="";
            titleArray.forEach((str, index) => {
                output += str + (index < titleArray.length - 1 ? "\n" : "");
            });
            copyContent(output)
        } else {
            epoint.alert("请选择要生成的记录!", null, null, 'warning');
        }
    }

    // 定义delay函数
    function gen() {
       var datagrid = mini.get('datagrid');
       var ids = datagrid.getSelectedIds();

        if (ids.length > 0) {
            var titleArray = [];
            var selectArrayData = mini.get(datagrid).getSelecteds();
            selectArrayData.forEach(item=>{
                const str = item.topic;
                const regex = /title="\s*(.*?)\s*"/;
                const match = str.match(regex);
                if (match) {
                    titleArray.add(match[1])
                } else {
                    console.log('未找到 title 属性');
                }
            });
            var output ="";
            titleArray.forEach((str, index) => {
                output += str + (index < titleArray.length - 1 ? "\n" : "");
            });
            copyContent(output)
        } else {
            epoint.alert("请选择要生成的记录!", null, null, 'warning');
        }
    }

    // 餐补
    function cb() {
        var btlx = document.getElementById('bxTypeName$text');
        btlx.removeAttribute('readonly')
        mini.get("bxType").setValue('010206');
        mini.get("bxTypeName").setValue('加班餐补贴');
        mini.get("beizhu").setValue('加班晚餐(25元)');
        save()
    }

    // 复制到粘贴板
    async function copyContent(content) {
        try {
            console.log(content)
            await navigator.clipboard.writeText(content);
            epoint.confirm("生成成功，去粘贴?","确认",function(){
                window.open("https://shimo.im/docs/5rk9KrPW61FNlZ3x");
            });
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

})();
