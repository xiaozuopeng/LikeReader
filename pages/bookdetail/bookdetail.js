import Api from '../../utils/request/api.js'
import MyHttp from '../../utils/request/xrequest.js'
import myUtils from '../../utils/util.js'
import myStore from '../../utils/tools/store.js'

Page({
  data: {
    isHidden: true,
    isBookSaved: false,
    buttonText: '加追更',
    bookId: '',
    bookDetail: null,
    commentList: null,
    recommendList: null
  },
  onLoad(query) {
    // console.log(query);
    let bookId = query.bookId;
    let isSaved = false;
    let books = myStore.get('myBooks') || [];
    if (books && books.length > 0) {
      books.forEach(function(value) {
        if (value._id == bookId) {
          isSaved = true;
        }
      });
    }

    let btnText = isSaved ? '不追了' : '加追更'
    this.setData({
      bookId: bookId,
      isBookSaved: isSaved,
      buttonText: btnText
    });
    this.getBookDetail();
    this.getRecommendList();
  },

  /**
   * 点击热门推荐
   */
  clickRecomment: function(e) {
    console.log(e);
    let bookId = e.currentTarget.dataset.value._id;
    my.navigateTo({
      url: 'bookdetail?bookId=' + bookId
    })
  },

  /**
   * 加追更
   */
  saveBook: function() {
    let bookId = this.data.bookId;
    let bookDetail = this.data.bookDetail;
    let isSaved = this.data.isBookSaved;
    let _books = myStore.get('myBooks') || [];
    if (isSaved) {
      let _bookIndex = -1;
      for (var i = 0; _books.length; i++) {
        if (bookId == _books[i]._id) {
          _bookIndex = i;
          break;
        }
      }
      _books.splice(_bookIndex, 1);
      myStore.remove(bookId + 'index');
      isSaved = false;
    } else {
      _books.unshift(bookDetail);
      isSaved = true;
    }
    console.log(_books);
    myStore.set('myBooks', _books);
    let btnText = isSaved ? '不追了' : '加追更'
    this.setData({
      isBookSaved: isSaved,
      buttonText: btnText
    });
  },

  /**
   * 开始阅读
   */
  readBook: function() {
    let bookId = this.data.bookId
    my.navigateTo({
      url: '../readbook/readbook?bookId=' + bookId
    })
  },

  /**
   * 获取书籍详情
   */
  getBookDetail: function() {
    let _id = this.data.bookId;
    new MyHttp({}, 'GET', 'book/' + _id).then((res) => {
      if (res.status == 200 && res.data != null) {
        let _data = res.data;
        // console.log(_data)
        _data.cover = myUtils.getImgPath(_data.cover);
        _data.rating ? _data.rating.score = myUtils.formatNum(_data.rating.score, 1) : 0;
        _data.wordCount = myUtils.formatNum(_data.wordCount / 10000, 1);
        _data.updated = myUtils.getDateDifference(_data.updated);
        console.log(_data)
        this.getCommentList(_data._id);
        this.setData({
          bookDetail: _data,
          isHidden: false
        });
      }
      else {
        my.showToast({
          content: '加载失败'
        });
      }
    });
  },

  /**
   * 获取热门书评
   */
  getCommentList: function(bookId) {
    Api.getCommentList({ book: bookId }).then((res) => {
      if (res.status == 200 && res.data != null) {
        let _data = res.data;
        _data.reviews.forEach(function(value) {
          value.author.avatar = myUtils.getImgPath(value.author.avatar);
          value.updated = myUtils.getDateDifference(value.updated);
        });
        console.log(_data)
        this.setData({
          commentList: _data
        });
      }
      else {
        my.showToast({
          content: '加载失败'
        });
      }
    })
  },

  /**
   * 获取推荐列表
   */
  getRecommendList: function() {
    let _id = this.data.bookId;
    let arr = [];
    new MyHttp({}, 'GET', 'book/' + _id + '/recommend').then((res) => {
      if (res.status == 200 && res.data != null) {
        let _data = res.data;
        _data.books.forEach(function(value, index) {
          value.cover = myUtils.getImgPath(value.cover);
          value.icon = value.cover;
          value.text = value.title;
          value.desc = value.author;
          if (index < 6) {
            arr.push(value);
          }
        });
        console.log(arr);
        this.setData({
          recommendList: arr
        });
      }
      else {
        my.showToast({
          content: '加载失败'
        });
      }
    })
  }
});
