import Api from '../../utils/request/api.js'
import myUtils from '../../utils/util.js'

Page({
  data: {
    isHidden: true,
    keyWord: '',
    searchList: []
  },
  onLoad(query) {
    let keyWord = query.keyWord;
    this.setData({
      keyWord: keyWord
    });
    this.getSearchList();
  },

  getSearchList: function() {
    let keyWord = this.data.keyWord;
    Api.getSearchList({ 'query': keyWord }).then((res) => {
      if (res.status == 200 && res.data != null) {
        let _data = res.data.books;
        _data.forEach(function(value, index, array) {
          value.cover = myUtils.getImgPath(value.cover);
        });
        console.log(_data);
        this.setData({
          searchList: _data,
          isHidden: false
        });
      } else {
        my.showToast({
          content: '加载失败'
        });
      }
    })
  },

  onPullDownRefresh() {
    this.getSearchList();
  }
});
