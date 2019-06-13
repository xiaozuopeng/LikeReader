import MyHttp from '../../../utils/request/xrequest.js'
import myUtils from '../../../utils/util.js'

Page({
  data: {
    isHidden: true,
    rankingId: '',
    rankingList: null
  },
  onLoad(query) {
    let _id = query.id;
    this.setData({
      rankingId: _id
    });
    this.getRankingData();
  },

  /**
   * 获取排行列表数据
   */
  getRankingData: function() {
    let _id = this.data.rankingId;
    new MyHttp({}, 'GET', 'ranking/' + _id).then((res) => {
      if (res.status == 200 && res.data != null) {
        my.setNavigationBar({
          title: res.data.ranking.title,
        });
        let _data = res.data.ranking.books;
        _data.forEach(function(value) {
          value.cover = myUtils.getImgPath(value.cover);
          value.latelyFollower = (value.latelyFollower / 10000).toFixed(1);
        });
        // console.log(_data)
        this.setData({
          rankingList: _data,
          isHidden: false
        });
      } else {
        my.showToast({
          content: '加载失败'
        });
      }
    })
  }
});
