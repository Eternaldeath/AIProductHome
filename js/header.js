function search(searchIconUrl) {
    $(".search-icon").css("opacity", "1");
    var listIndex = -1;
    var hotList = 0;
    var searchData = userDefinedSearchData.custom ? userDefinedSearchData : {
        "thisSearch": "https://www.baidu.com/s?wd=",
        "thisSearchIcon": "url(" + searchIconUrl + ")",
        "hotStatus": true,
        "custom": false,
        "data": [{
            name: "百度",
            img: "url(" + searchIconUrl + ") -80px 0px",
            position: "0px 0px",
            url: "https://www.baidu.com/s?wd="
        }, {
            name: "谷歌",
            img: "url(" + searchIconUrl + ")  -105px 0px",
            position: "-40px 0px",
            url: "https://www.google.com/search?q="
        }, {
            name: "必应",
            img: "url(" + searchIconUrl + ")  -80px -25px",
            position: "0px -40px",
            url: "https://cn.bing.com/search?q="
        }, {
            name: "好搜",
            img: "url(" + searchIconUrl + ") -105px -25px",
            position: "-40px -40px",
            url: "https://www.so.com/s?q="
        }, {
            name: "搜狗",
            img: "url(" + searchIconUrl + ") -80px -50px",
            position: "0px -80px",
            url: "https://www.sogou.com/web?query="
        }, {
            name: "淘宝",
            img: "url(" + searchIconUrl + ") -105px -50px",
            position: "-40px -80px",
            url: "https://s.taobao.com/search?q="
        }, {
            name: "京东",
            img: "url(" + searchIconUrl + ") -80px -75px",
            position: "0px -120px",
            url: "http://search.jd.com/Search?keyword="
        }, {
            name: "天猫",
            img: "url(" + searchIconUrl + ") -105px -75px",
            position: "-40px -120px",
            url: "https://list.tmall.com/search_product.htm?q="
        }, {
            name: "1688",
            img: "url(" + searchIconUrl + ") -80px -100px",
            position: "0px -160px",
            url: "https://s.1688.com/selloffer/offer_search.htm?keywords="
        }, {
            name: "知乎",
            img: "url(" + searchIconUrl + ") -105px -100px",
            position: "-40px -160px",
            url: "https://www.zhihu.com/search?type=content&q="
        }, {
            name: "微博",
            img: "url(" + searchIconUrl + ") -80px -125px",
            position: "0px -200px",
            url: "https://s.weibo.com/weibo/"
        }, {
            name: "B站",
            img: "url(" + searchIconUrl + ") -105px -125px",
            position: "-40px -200px",
            url: "http://search.bilibili.com/all?keyword="
        }, {
            name: "豆瓣",
            img: "url(" + searchIconUrl + ") -80px -150px",
            position: "0px -240px",
            url: "https://www.douban.com/search?source=suggest&q="
        }, {
            name: "优酷",
            img: "url(" + searchIconUrl + ") -105px -150px",
            position: "-40px -240px",
            url: "https://so.youku.com/search_video/q_"
        }, {
            name: "GitHub",
            img: "url(" + searchIconUrl + ") -80px -175px",
            position: "0px -280px",
            url: "https://github.com/search?utf8=✓&q="
        }]
    };
    var localSearchData = localStorage.getItem("searchData");
    if (localSearchData && (searchData.custom === localSearchData.custom)) {
        searchData = JSON.parse(localSearchData)
    }
    function filterChildren(element) {
        var thisText = $(element).contents().filter(function (index, content) {
            return content.nodeType === 3
        }).text().trim();
        return thisText
    }
    function getHotkeyword(value) {
        $.ajax({
            type: "GET",
            url: "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su",
            async: true,
            data: {
                wd: value
            },
            dataType: "jsonp",
            jsonp: "cb",
            success: function (res) {
                $("#box ul").text("");
                hotList = res.s.length;
                if (hotList) {
                    $("#box").css("display", "block");
                    for (var i = 0; i < hotList; i++) {
                        $("#box ul").append("<li><span>" + (i + 1) + "</span> " + res.s[i] + "</li>");
                        $("#box ul li").eq(i).click(function () {
                            var thisText = filterChildren(this);
                            $("#txt").val(thisText);
                            window.open(searchData.thisSearch + thisText);
                            $("#box").css("display", "none")
                        });
                        if (i === 0) {
                            $("#box ul li").eq(i).css({
                                "border-top": "none"
                            });
                            $("#box ul span").eq(i).css({
                                "color": "#fff",
                                "background": "#f54545"
                            })
                        } else {
                            if (i === 1) {
                                $("#box ul span").eq(i).css({
                                    "color": "#fff",
                                    "background": "#ff8547"
                                })
                            } else {
                                if (i === 2) {
                                    $("#box ul span").eq(i).css({
                                        "color": "#fff",
                                        "background": "#ffac38"
                                    })
                                }
                            }
                        }
                    }
                } else {
                    $("#box").css("display", "none")
                }
            },
            error: function (res) {
                console.log(res)
            }
        })
    }
    $("#txt").keyup(function (e) {
        if ($(this).val()) {
            if (e.keyCode == 38 || e.keyCode == 40 || !searchData.hotStatus) {
                return
            }
            getHotkeyword($(this).val())
        } else {
            $(".search-clear").css("display", "none");
            $("#box").css("display", "none")
        }
    });
    $("#txt").keydown(function (e) {
        if (e.keyCode === 40) {
            listIndex === (hotList - 1) ? listIndex = 0 : listIndex++;
            $("#box ul li").eq(listIndex).addClass("current").siblings().removeClass("current");
            var hotValue = filterChildren($("#box ul li").eq(listIndex));
            $("#txt").val(hotValue)
        }
        if (e.keyCode === 38) {
            if (e.preventDefault) {
                e.preventDefault()
            }
            if (e.returnValue) {
                e.returnValue = false
            }
            listIndex === 0 || listIndex === -1 ? listIndex = (hotList - 1) : listIndex--;
            $("#box ul li").eq(listIndex).addClass("current").siblings().removeClass("current");
            var hotValue = filterChildren($("#box ul li").eq(listIndex));
            $("#txt").val(hotValue)
        }
        if (e.keyCode === 13) {
            window.open(searchData.thisSearch + $("#txt").val());
            $("#box").css("display", "none");
            $("#txt").blur();
            $("#box ul li").removeClass("current");
            listIndex = -1
        }
    });
    $("#txt").focus(function () {
        $(".search-box").css("box-show", "inset 0 1px 2px rgba(27,31,35,.075), 0 0 0 0.2em rgba(3,102,214,.3)");
        if ($(this).val() && searchData.hotStatus) {
            getHotkeyword($(this).val())
        }
    });
    $("#txt").blur(function () {
        setTimeout(function () {
            $("#box").css("display", "none")
        }, 250)
    });
    for (var i = 0; i < searchData.data.length; i++) {
        $(".search-engine-list").append('<li><span style="background:' + searchData.data[i].img + (searchData.custom ? ' 0% 0% / cover no-repeat' : '') + '"/></span>' +
            searchData.data[i].name + "</li>")
    }
    $(".search-icon, .search-engine").hover(function () {
        $(".search-engine").css("display", "block")
    }, function () {
        $(".search-engine").css("display", "none")
    });
    $("#hot-btn").click(function () {
        $(this).toggleClass("off");
        searchData.hotStatus = !searchData.hotStatus;
        localStorage.searchData = JSON.stringify(searchData)
    });
    searchData.hotStatus ? $("#hot-btn").removeClass("off") : $("#hot-btn").addClass("off");
    $(".search-engine-list li").click(function () {
        var index = $(this).index();
        searchData.thisSearchIcon = searchData.custom ? searchData.data[index].img : searchData.data[index].position;
        if (searchData.custom) {
            $(".search-icon").css("background", searchData.thisSearchIcon + ' no-repeat').css("background-size", 'cover');
        } else {
            $(".search-icon").css("background-position", searchData.thisSearchIcon);
        }
        searchData.thisSearch = searchData.data[index].url;
        $(".search-engine").css("display", "none");
        localStorage.searchData = JSON.stringify(searchData)
    });
    if (searchData.custom) {
        $(".search-icon").css("background", searchData.thisSearchIcon + ' no-repeat').css("background-size", 'cover');
    } else {
        $(".search-icon").css("background-position", searchData.thisSearchIcon);
    }
    $("#search-btn").click(function () {
        var textValue = $("#txt").val();
        if (textValue) {
            window.open(searchData.thisSearch + textValue);
            $("#box ul").html("")
        } else {
            layer.msg("请输入关键词！", {
                time: 500
            }, function () {
                $("#txt").focus()
            })
        }
    })
}

//夜间模式切换
function switchNightMode() {
    var night = document.cookie.replace(/(?:(?:^|.*;\s*)night\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '0';
    if (night == '0') {
        document.body.classList.add('night');
        document.cookie = "night=1;path=/"
    } else {
        document.body.classList.remove('night');
        document.cookie = "night=0;path=/"
    }
}
