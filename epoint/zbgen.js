// ==UserScript==
// @name         小组周报生成器
// @namespace    http://tampermonkey.net/
// @version      2024-08-05
// @description  try to take over the world!
// @author       icelo.org
// @match        https://oa.epoint.com.cn/epointoa9/frame/pages/basic/communication/waithandle/*
// @match        https://oa.epoint.com.cn/dailyreportmanage/pages/dailyrecord/dailyrecordaddv2/gzrz/gzrzcontent*
// @updateURL    https://raw.githubusercontent.com/iceloX/Tampermonkey-JS/master/epoint/zbgen.js
// @downloadURL  https://raw.githubusercontent.com/iceloX/Tampermonkey-JS/master/epoint/zbgen.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epoint.com.cn
// @grant        none
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
        NewNode.addEventListener("click", delay);

    }

    else  if(url.startsWith('https://oa.epoint.com.cn/dailyreportmanage/pages/dailyrecord/dailyrecordaddv2/gzrz/gzrzcontentold')){
        var taskGrid = mini.get('taskGrid');
        var columns = taskGrid.columns;

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

        rzzbButton.addEventListener("click", rzdelay);
    }


    function rzdelay(){
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
    function delay() {
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
