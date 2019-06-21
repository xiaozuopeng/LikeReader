import Api from '../../utils/request/api.js'
import myUtils from '../../utils/util.js'

Page({
  data: {
    isHidden: true,
    tabs: [
      { title: '男生', anchor: 'male', list: [] },
      { title: '女生', anchor: 'female', list: [] },
      { title: '出版', anchor: 'press', list: [] }
    ],
  },

  onItemClick(ev) {
    let _item = ev.detail.index.item;
    // console.log(_item);
    my.navigateTo({
      url: 'classifylist?gender=' + _item.gender + '&major=' + _item.name
    })
  },


  onLoad() {
    this.getClassifies();
  },

  onPullDownRefresh() {
    this.getClassifies();
  },

  /**
   * 获取分类列表
   */
  getClassifies: function() {
    let that = this;
    Api.getClassifies().then((res) => {
      if (res.status == 200 && res.data != null) {
        let _tabs = that.data.tabs;
        _tabs.forEach(function(value) {
          if (value.anchor == 'male') {
            let _male = res.data.male;
            _male.forEach(function(value) {
              value.bookCover[0] = myUtils.getImgPath(value.bookCover[0]);
              value.bookCover[1] = myUtils.getImgPath(value.bookCover[1]);
              value.bookCover[2] = myUtils.getImgPath(value.bookCover[2]);

              value.icon = value.bookCover[0];
              value.text = value.name;
              value.desc = value.bookCount + '本';
              value.gender = 'male';
            });
            value.list = _male
          } else if (value.anchor == 'female') {
            let _female = res.data.female;
            _female.forEach(function(value) {
              value.bookCover[0] = myUtils.getImgPath(value.bookCover[0]);
              value.bookCover[1] = myUtils.getImgPath(value.bookCover[1]);
              value.bookCover[2] = myUtils.getImgPath(value.bookCover[2]);

              value.icon = value.bookCover[0];
              value.text = value.name;
              value.desc = value.bookCount + '本';
              value.gender = 'female';
            });
            value.list = _female;
          } else if (value.anchor == 'press') {
            let _press = res.data.press;
            _press.forEach(function(value) {
              value.bookCover[0] = myUtils.getImgPath(value.bookCover[0]);
              value.bookCover[1] = myUtils.getImgPath(value.bookCover[1]);
              value.bookCover[2] = myUtils.getImgPath(value.bookCover[2]);

              value.icon = value.bookCover[0];
              value.text = value.name;
              value.desc = value.bookCount + '本';
              value.gender = 'press';
            });
            value.list = _press;
          }
        });
        // console.log(_tabs);
        this.setData({
          isHidden: false,
          tabs: _tabs
        });
      } else {
        my.showToast({
          content: '加载失败'
        });
      }
    })
  },
});
