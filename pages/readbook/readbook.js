import MyHttp from '../../utils/request/xrequest.js'
import config from '../../utils/request/config.js'
import myStore from '../../utils/tools/store.js'

Page({
  data: {
    pageInfos: [],
    winHeight: 0,
    contentFontSize: 36,
    contentBackground: '#c7edcc',
    showBottom: false,
    catalogueHidden: true,
    isPreDisable: true,
    isNextDisable: false,
    chapterIndex: 0,
    isHiddenContent: true,
    bookId: "",
    chaptersData: null,
    chapters: null,
    chapterContent: "",
    fontColor: '#333'
  },
  onLoad(query) {
    my.getSystemInfo({
      success: (res) => { // 用这种方法调用，this指向Page
        this.setData({
          winHeight: res.windowHeight - 66 - 52
        });
      }
    });
    let fontSize = myStore.get('font-size') || 36;
    let fontColor = myStore.get('font-color') || this.data.fontColor;
    let contentBackground = myStore.get('contentBackground') || this.data.contentBackground;
    let bookId = query.bookId;
    my.setNavigationBar({
      title: query.title
    });
    let _chapterIndex = myStore.get(bookId + 'index') || 0;
    this.setData({
      bookId: bookId,
      fontColor: fontColor,
      contentBackground: contentBackground,
      contentFontSize: fontSize,
      chapterIndex: _chapterIndex,
      isPreDisable: _chapterIndex > 0 ? false : true
    });
    this.getChaptersData();
  },

  /**
   * 获取章节列表数据
   */
  getChaptersData: function() {
    let _pageInfos = [];
    let chapterIndex = this.data.chapterIndex;
    let _id = this.data.bookId;
    new MyHttp({}, 'GET', 'mix-atoc/' + _id + '?view=chapters').then((res) => {
      if (res.status == 200 && res.data != null) {
        if (!res.data.ok) {
          my.showToast({
            title: '暂无内容', icon: 'none', duration: 1000
          })
          return;
        }
        let _data = res.data.mixToc;
        console.log(_data);

        this.setData({
          isNextDisable: chapterIndex < _data.chapters.length - 1 ? false : true,
          chaptersData: _data,
          chapters: _data.chapters
        });
        this.getChapterDetail();
      } else {
        my.showToast({
          content: '加载失败'
        });
      }
    })
  },

  //获取章节内容
  getChapterDetail: function() {
    let chapterIndex = this.data.chapterIndex;
    let chapters = this.data.chaptersData.chapters;
    let _link = encodeURIComponent(chapters[chapterIndex].link);
    new MyHttp({}, 'POST', 'chapter/' + _link, config.GLOBAL_CHAPTER_DOMAIN2).then((res) => {
      if (res.status == 200 && res.data != null) {
        let _data = res.data.chapter;
        _data.title = chapters[chapterIndex].title;
        _data.body = '&emsp;&emsp;' + _data.body.replace(/\s+/g, "\n&emsp;&emsp;")
        // console.log(_data)
        this.setData({
          isPreDisable: chapterIndex - 1 > 0 ? false : true,
          isNextDisable: chapterIndex < chapters.length - 1 ? false : true,
          chapterContent: _data,
          isHiddenContent: false
        });
        my.pageScrollTo({
          scrollTop: 0
        })
      } else {
        my.showToast({
          content: '加载失败'
        });
      }
    })
  },

  onBottomPopupShow() {
    this.setData({
      showBottom: true
    });
  },
  onBottomPopupClose() {
    this.setData({
      showBottom: false
    });
  },

  //字体加
  fontAddition: function() {
    let fontSize = this.data.contentFontSize + 2 < 50 ? this.data.contentFontSize + 2 : 50;
    myStore.set('font-size', fontSize)
    this.setData({
      contentFontSize: fontSize
    })
  },

  //字体减
  fontSubtraction: function() {
    let fontSize = this.data.contentFontSize - 2 > 24 ? this.data.contentFontSize - 2 : 24;
    myStore.set('font-size', fontSize)
    this.setData({
      contentFontSize: fontSize
    })
  },

  //标准色
  standardColors: function() {
    myStore.set('font-color', '#333')
    myStore.set('contentBackground', '#ffffff')
    this.setData({
      showBottom: false,
      contentBackground: '#ffffff',
      fontColor: '#333'
    })
  },

  //护眼色
  protectiveEyeColor: function() {
    myStore.set('font-color', '#333')
    myStore.set('contentBackground', '#c7edcc')
    this.setData({
      showBottom: false,
      contentBackground: '#c7edcc',
      fontColor: '#333'
    })
  },

  //夜间模式
  nightMode: function() {
    // myStore.set('font-color', '#ffffff')
    // myStore.set('contentBackground', '#333')
    my.setNavigationBar({
      backgroundColor: '#333'
    });
    this.setData({
      showBottom: false,
      contentBackground: '#333',
      fontColor: '#999'
    })
  },

  //上一章
  previousChapter: function() {
    let chapters = this.data.chaptersData.chapters;
    let _chapterIndex = this.data.chapterIndex;
    myStore.set(this.data.bookId + 'index', _chapterIndex - 1)
    this.setData({
      showBottom: false,
      chapterIndex: _chapterIndex - 1,
      isPreDisable: _chapterIndex - 1 > 0 ? false : true,
      isNextDisable: _chapterIndex - 1 < chapters.length - 1 ? false : true
    });

    this.getChapterDetail();
  },

  //打开目录
  onCatalogueOpen: function() {
    this.setData({
      showBottom: false,
      catalogueHidden: false
    });
  },

  //关闭目录
  onCatalogueClose: function() {
    this.setData({
      catalogueHidden: true
    });
  },

  //下一章
  nextChapter: function() {
    let chapters = this.data.chaptersData.chapters;
    let _chapterIndex = this.data.chapterIndex;
    myStore.set(this.data.bookId + 'index', _chapterIndex + 1)
    this.setData({
      showBottom: false,
      chapterIndex: _chapterIndex + 1,
      isPreDisable: _chapterIndex + 1 > 0 ? false : true,
      isNextDisable: _chapterIndex + 1 < chapters.length - 1 ? false : true
    });

    this.getChapterDetail();
  },

  //点击章节条目
  clickChapterItem: function(e) {
    let index = parseInt(e.currentTarget.id);
    myStore.set(this.data.bookId + 'index', index);
    this.setData({
      chapterIndex: index,
      showCatalogue: false
    });

    this.getChapterDetail();
  },
});
