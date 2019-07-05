import Api from '../../utils/request/api.js'
import myStore from '../../utils/tools/store.js'

Page({
  data: {
    winHeight:'',
    inputValue: "",
    hotKeys: [],
    hotKeyWords: [],
    historyWords: [],
    backgrounds: ['#92C3EB', '#C367D2', '#FBB262', '#69CAB7', '#ED8890', '#99CAD7']
  },
  onLoad() {
    my.getSystemInfo({
      success: (res) => { // 用这种方法调用，this指向Page
        this.setData({
          winHeight: res.windowHeight - 44
        });
      }
    });
    let historyWords = myStore.get('search') || [];
    this.setData({
      historyWords: historyWords
    });
    console.log(this.data.historyWords);
    this.getHotKeys();
  },

  searchSubmit: function(value) {
    let keyWord = value;
    let historyWords = myStore.get('search') || [];
    if (historyWords && historyWords.length > 0) {
      let index = historyWords.indexOf(keyWord);
      if (index > -1) {
        historyWords.splice(index, 1);
        historyWords.unshift(keyWord);
      } else {
        historyWords.unshift(keyWord);
      }
    } else {
      historyWords.unshift(keyWord);
    }
    myStore.set('search', historyWords);
    this.setData({
      historyWords: historyWords
    });

    my.navigateTo({
      url: '../search/searchlist?keyWord=' + keyWord,
    })
  },

  //刷新
  refreshKeys: function() {
    let _hotKeyWords = this.data.hotKeyWords;
    let result = this.randomArray(_hotKeyWords);
    this.setData({
      hotKeys: result
    });
  },

  //清空
  deleteHistory: function() {
    myStore.remove('search')
    this.setData({
      historyWords: []
    });
  },

  getHotKeys: function() {
    Api.getHotKeys().then((res) => {
      if (res.status == 200 && res.data != null) {
        let _data = res.data.newHotWords;
        let result = this.randomArray(_data);
        this.setData({
          hotKeyWords: _data,
          hotKeys: result
        });
      } else {
        my.showToast({
          content: '加载失败'
        });
      }
    })
  },

  randomArray: function(array) {
    let result = new Array();

    // 定义存放生成随机数的数组
    var numArr = new Array();
    for (var i = 0; ; i++) {
      if (numArr.length < 10) {
        var random = Math.floor(Math.random() * (array.length - 1));
        if (numArr.length == 0) {
          numArr.push(random);
        } else {
          var isContain = this.isContain(numArr, random);
          if (!isContain) {
            numArr.push(random);
          }
        }
      } else {
        break;
      }
    }

    for (var i = 0; i < numArr.length; i++) {
      var item = array[numArr[i]];
      item.background = this.data.backgrounds[i % 6];

      result[i] = item;
    }
    return result;
  },

  isContain: function(numArr, random) {
    var isContain = false;
    for (var i = 0; i < numArr.length; i++) {
      if (numArr[i] == random) {
        isContain = true;
      }
    }
    return isContain;
  },

  hideInput: function() {
    this.setData({
      inputValue: "",
    });
  },

  clearInput: function() {
    this.setData({
      inputValue: ""
    });
  },
});
