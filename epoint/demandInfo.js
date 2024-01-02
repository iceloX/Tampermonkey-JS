// ==UserScript==
// @name         需求信息获取
// @namespace    http://tampermonkey.net/
// @version      2023-12-29
// @description  try to take over the world!
// @author       You
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanagezw/demandbasicinfonew_detail?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epoint.com.cn
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
      // 拦截XMLHttpRequest
    var url = window.location.href;
    if(url.startsWith('https://oa.epoint.com.cn/productrelease/cpzt/demandmanagezw/demandbasicinfonew_detail?')){
        // 当前需求的rowGuid （用于下载）
        var rowGuid = "";
        // 需求名称
        var demandName = "";
        // 项目名称
        var projectName = "";
        // 项目guid
        var projectGuid = "";
        // 保存原始的 XMLHttpRequest 对象
        var originalXMLHttpRequest = window.XMLHttpRequest;

    // 重写 XMLHttpRequest
        window.XMLHttpRequest = function() {
        var xhr = new originalXMLHttpRequest();

        // 监听 load 事件
        xhr.addEventListener('load', function() {
             try {
                 var pageResponse = JSON.parse(xhr.response);
                 console.log(pageResponse.custom);
                 rowGuid = pageResponse.custom.rowguid;
                 console.log(rowGuid)
                 demandName = mini.get('demandname').getValue();
                 console.log(demandName);
                 projectName = mini.get('projectguid').getText();
                 console.log(projectName)
                 projectGuid = mini.get('projectguid').getValue();
                 console.log('https://oa.epoint.com.cn/epoint-projectmanage-web/frame/fui/pages/themes/grace/grace2?projectGuid='+ projectGuid);


                 var infoButton = document.createElement('a');
                 infoButton.innerHTML = '<a class="mini-button mini-state-default mini-corner-all mini-btn-success mr10" href="javascript:void(0)"  onclick="showConfig();"><span class="mini-button-text">项目信息汇总</span></a>';
                 // document.body.appendChild(infoButton);

                 var faqlookElement = document.querySelector('#faqlook');

                 // 如果找到了 jctitle 元素，则将按钮插入到其后面
                 if (faqlookElement) {
                     // 使用 insertBefore 插入到 jctitle 元素的后面
                     faqlookElement.parentNode.insertBefore(infoButton, faqlookElement.nextSibling);
                 } else {
                     console.error('jctitle element not found.');
                 }


            } catch (e) {
                console.log('Unable to parse response as JSON:', xhr.response);
            }
        });

        return xhr;
    };
    }

})();


(function () {
    'use strict';

    // 绿化设定按钮点击事件
    let jss = "";
    jss += "<script>function showConfig() {";
    jss += "alert('脚本信息');";
    jss += "}</script>";
    $("body").append(jss);
})();
