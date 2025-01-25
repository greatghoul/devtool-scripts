(function() {
  function getSortedAppMsgInfos () {
    const list = window.CGI_DATA['pages/album/edit']['edit_resp']['appmsg_infos'];
    return list.sort((a, b) => new Date(b.time) - new Date(a.time)).map(x => [x.appmsgid, x.title, x.time])
  }

  const appmsgList = getSortedAppMsgInfos();
  console.table(appmsgList);

  const urlParams = new URLSearchParams(window.location.search);
  const formData = new FormData();
  formData.append('subtype', 0);
  formData.append('id', urlParams.get('id'));
  formData.append('type', urlParams.get('type'));
  formData.append('title', document.querySelector('#album_title').value);
  formData.append('desc', document.querySelector('#album_desc').value);
  formData.append('is_updating', 0);
  formData.append('is_reverse', 1); // 排序 - 1 从新到旧, 0 从旧到新
  formData.append('is_numbered', 0); // 标题序号 - 1 显示, 0 不显示
  formData.append('appmsg_total', appmsgList.length);
  formData.append('sync_version', 1);
  formData.append('update_time', parseInt(new Date().getTime() / 1000));
  formData.append('continous_read_on', 1); // 连续阅读 - 1 开启, 0 关闭
  formData.append('update_frequence', '{}');
  formData.append('appmsg_info', JSON.stringify({appmsgkeys: getSortedAppMsgInfos().map(x => ({msgid: x[0], itemidx: "1"}))}));
  formData.append('crop_list', JSON.stringify({crop_list: []}));
  formData.append('token', urlParams.get('token'));
  formData.append('lang', urlParams.get('lang') || 'zh_CN');
  formData.append('f', 'json');
  formData.append('ajax', 1);

  fetch("https://mp.weixin.qq.com/cgi-bin/appmsgalbummgr?action=commit", {
    "body": new URLSearchParams(formData).toString(),
    "method": "POST",
    "mode": "cors",
    "credentials": "include",
    "headers": {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },    
  }).then(response => {
      if (!response.ok) {
          throw new Error('网络响应异常');
      }
      return response.json();
  })
  .then(data => {
      console.log('提交成功，响应数据:', data);
  })
  .catch(error => {
      console.error('提交失败:', error);
  });
})();
