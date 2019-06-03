import Api from '../../utils/request/api.js'
import myUtils from '../../utils/util.js'

Page({
  data: {
    isHidden: true,
    activeTab: 0,
    tabs: [
      { title: '男频', list: [] },
      { title: '女频', list: [] },
      { title: '出版', list: [] },
      { title: '漫画', list: [] }
    ]
  },
  onLoad() {
    this.getRankingData();
  },

  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  handleTabChange({ index }) {
    this.setData({
      activeTab: index,
    });
  },

  onItemClick(ev) {
    let _detail = ev.target.dataset.value;
    console.log(_detail);
  },

  /**
     * 获取排行分类数据
     */
  getRankingData: function() {
    let that = this;
    Api.getRankingCategory().then((res) => {
      if (res.status == 200 && res.data != null) {

        let _tabs = that.data.tabs;
        _tabs.forEach(function(value) {
          if (value.title == "男频") {
            res.data.male.forEach(function(value) {
              value.cover = myUtils.getImgPath(value.cover);
            })
            value.list = res.data.male;
          } else if (value.title == "女频") {
            res.data.female.forEach(function(value) {
              value.cover = myUtils.getImgPath(value.cover);
            })
            value.list = res.data.female;
          } else if (value.title == "出版") {
            res.data.epub.forEach(function(value) {
              value.cover = myUtils.getImgPath(value.cover);
            })
            value.list = res.data.epub;
          } else if (value.title == "漫画") {
            res.data.picture.forEach(function(value) {
              value.cover = myUtils.getImgPath(value.cover);
            })
            value.list = res.data.picture;
          }
        });
        // console.log(res.data)
        this.setData({
          tabs: _tabs,
          isHidden: false
        });
        console.log(that.data.tabs)
      }
      else {
        my.showToast({
          content: '加载失败'
        });
      }
    })
  },

  onPullDownRefresh() {
    this.getRankingData();
  }
});
