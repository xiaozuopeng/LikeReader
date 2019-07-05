import Api from '../../utils/request/api.js'
import myStore from '../../utils/tools/store.js'

Page({
  data: {
    winHeight: 0,
    isHidden: true,
    isAddHidden: false,
    bookList: []
  },
  onLoad() {
    my.getSystemInfo({
      success: (res) => { // 用这种方法调用，this指向Page
        this.setData({
          winHeight: res.windowHeight
        });
      }
    });
  },

  onShow() {
    this.getMyBookList();
  },

  onClickItem: function(e) {
    let title = e.currentTarget.dataset.title;
    let bookId = e.currentTarget.id;
    my.navigateTo({
      url: '../../pages/readbook/readbook?bookId=' + bookId + "&title=" + title
    })
  },

  onLongTap: function(e) {
    let that = this;
    let bookId = e.currentTarget.id;
    my.confirm({
      title: '温馨提示',
      content: '是否删除该小说？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          let _books = myStore.get('myBooks') || [];
          console.log(_books)
          if (_books && _books.length > 0) {
            _books.forEach(function(value, index, array) {
              if (value._id == bookId) {
                _books.splice(index, 1);
                myStore.remove(bookId + 'index');
              }
            });
          }
          myStore.set('myBooks', _books);
          that.setData({
            bookList: _books,
            isHidden: _books.length > 0 ? false : true,
            isAddHidden: _books.length > 0 ? true : false
          });

        } else {
          console.log('用户点击取消')
        }
      }
    })
  },

  clickAdd: function() {
    my.switchTab({
      url: '../../pages/ranking/ranking',
    })
  },

  getMyBookList: function() {
    let that = this;
    let books = myStore.get('myBooks') || [];
    books.forEach(function(value, index, array) {
      that.getBookUpdate(array, value);
    });
    if (books && books.length > 0) {
      this.setData({
        bookList: books,
        isHidden: false,
        isAddHidden: true
      });
    }
  },

  getBookUpdate: function(array, value) {
    console.log(array)
    let bookId = value._id;
    let parmas = {
      view: 'summary',
      book: bookId
    };
    Api.getBookUpdate(parmas).then((res) => {
      if (res.status == 200 && res.data != null) {
        let _data = res.data;
        // console.log(_data[0].lastChapter)
        array.forEach(function(value) {
          if (value._id == bookId) {
            value.lastChapter = _data[0].lastChapter
          }
        });
        this.setData({
          bookList: array
        });
        myStore.set('myBooks', array);
      } else {
        my.showToast({
          content: '加载失败'
        });
      }
    })
  },

  onPullDownRefresh() {
    this.getMyBookList();
  },
});
