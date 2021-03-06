import Api from '../../utils/request/api.js'
import myUtils from '../../utils/util.js'

Page({
  data: {
    winHeight: 0,
    isHidden: true,
    startIndex: 0,
    gender: '',
    major: '',
    classifyList: [],
    isEmpty: true,
    show: false, // 是否显示加载动画
  },
  onLoad(query) {
    my.getSystemInfo({
      success: (res) => { // 用这种方法调用，this指向Page
        this.setData({
          winHeight: res.windowHeight
        });
      }
    });
    let gender = query.gender;
    let major = query.major;

    my.setNavigationBar({
      title: major
    });
    this.setData({
      gender: gender,
      major: major
    });
    this.getClassifyList();
  },

  bookDetail: function(e) {
    console.log(e);
  },

  //获取分类列表
  getClassifyList: function() {
    let _startIndex = this.data.startIndex;
    let _gender = this.data.gender;
    let _major = this.data.major;
    let _classifyList = this.data.classifyList;
    let _isEmpty = this.data.isEmpty;
    this.setData({
      show: true
    });

    let parmas = {
      gender: _gender,
      type: 'hot',
      major: _major,
      minor: '',
      start: _startIndex,
      limit: 20
    };
    Api.getClassifyList(parmas).then((res) => {
      if (res.status == 200 && res.data != null) {
        let _data = res.data.books;
        _data.forEach(function(value) {
          value.cover = myUtils.getImgPath(value.cover);
        });
        _classifyList = _isEmpty ? _data : _classifyList.concat(_data);
        this.setData({
          classifyList: _classifyList,
          isHidden: false,
          startIndex: _startIndex + _data.length,
          isEmpty: false
        });
      }
      else {
        my.showToast({
          content: '加载失败'
        });
      }
    })
  },

  scrollToBottom: function() {
    this.setData({
      startIndex: 0
    });
    this.getClassifyList();
  },
});
