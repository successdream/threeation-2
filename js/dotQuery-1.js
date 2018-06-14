$(function () {
    // 获取省市区三级联动的数据
    //1 第一次默认查询省级数据==获取数据TODO
    //清空默认静态文本
    $("#content").html("");
    getThreeActionData("0");
    function getThreeActionData(msg) {

        POST({
            url: threeAction,
            data: {
                parentId: msg
            },
            success: function (data) {
                if ("0" == data.code) {
                    //获取数据成功TODO
                    renderProvinceList(data.data);
                } else {
                    console.log(data);
                }
            },
            error: function (data) {
                console.log(data);

            }
        })


    }
    //2 省级===渲染 TODO
    function renderProvinceList(msg) {
        $(".provinceList ul").html("");
        if ("[object Array]" != Object.prototype.toString.call(msg)) {
            console.log("数据不是数组")
            return
        }
        //数据为空，则为空数组
        msg = msg || [];
        // 如果为空数组的话，则返回,如果省份没有则不显示选择列表
        if (0 == msg.length) {
            return
        }
        var temp = "";
        msg.forEach(function (item, index) {
            temp += '<li class="option-list" data-parentid=' + item.code + '>' + item.name + '</li>';
        });
        //渲染
        $(".provinceList ul").html(temp);
    }
    //点击时候改变箭头 === 参数点击对象
    var controlArrow = true;

    function changeArrow(that) {
        if (controlArrow) {
            //内容隐藏
            $("#content").addClass("hideDiv");
            //列表显示
            $(".provinceList").removeClass("hideDiv");
            //改变箭头指向
            $(that).find(".arrow").removeClass("icon-Group-1").addClass("icon-Group-");
            //重复点击
            controlArrow = false;
        } else {
            // 内容显示
            $("#content").removeClass("hideDiv");
            //列表隐藏
            $(".provinceList").addClass("hideDiv");
            $(that).find(".arrow").removeClass("icon-Group-").addClass("icon-Group-1");
            controlArrow = true;
        }

    }

    //3 点击省 
    // 初始化市可点击
    var cityClick = false;
    // 初始化区可点击
    var districtClick = false;
    // 初始化市级数据存在
    // var isCityData=true;
    // 初始化区级数据存在
    // var isDistrictData=true;  
    // 初始化省级选中的值
    var selectProvinceData = true;
    var selectCityData = true;

    var provinceName = null;
    // 1 点击省之后  cityClick=true;

    // 2 市级数据条数不为空，isCityData=fasle;

    $("#threeAction").on("click", "#province", function (e) {

        //改变省级箭头指向
        if (!$(".city").find(".arrow").hasClass("icon-Group-1")) {
            //TODO
            // changeArrow("#city"); 
            $(".city").find(".arrow").addClass("icon-Group-1").removeClass("icon-Group-");


        }
        //改变区级箭头
        if (!$(".district").find(".arrow").hasClass("icon-Group-1")) {
            //TODO
            // changeArrow("#district"); 
            $(".district").find(".arrow").addClass("icon-Group-1").removeClass("icon-Group-");
        }

        cityClick = false;
        $(".province").find(".content-area").text("请选择所在省");
        e.stopPropagation();
        //  隐藏市和区列表

        $(".districtList").addClass("hideDiv");
        $(".cityList").addClass("hideDiv");
        // 清空市级选中项和市级列表
        $(".city").find(".content-area").text("请选择所在市");
        $(".cityList ul").html("");
        // 清空区级选中项和区级列表
        $(".districtList ul").html("");
        $(".district").find(".content-area").text("请选择所在区");
        //改变箭头指向
        changeArrow(this);
        // 储存点击的对象
        provinceName = $(this).data("name");
    })

    //省级列表 选中赋值
    $(".provinceList").on("click", ".option-list", function (e) {
        e.stopPropagation();

        //获取点击的值
        var getClickVal = $(this).text();
        // 赋值给点击省市区
        $(".province").find(".content-area").text(getClickVal);

        // 隐藏显示列表
        $(".provinceList").addClass("hideDiv");
        // 内容显示
        $("#content").removeClass("hideDiv");
        // 更换省箭头
        $(".province").find(".arrow").removeClass("icon-Group-").addClass("icon-Group-1");
        // 3-1发送请求，获取市级数据  TODO
        var code = $(this).data("parentid");
        // 用于判断是否点击了省按钮  点击省之后，可以获取市级数据
        //点击省之后，使得市可点击==必须在这里
        cityClick = true;
        districtClick = false;

        if (cityClick) {
            getCityData(code);
        }
        // 发送请求获取网点查询数据
        getDotQuerry(code, 0);
        // 选取成功后
        controlArrow = true;

    })

    // 获取市级数据
    function getCityData(data) {


        POST({
            url: threeAction,
            data: {
                parentId: data
            },
            success: function () {
                if ("0" == data.code) {
                    //渲染市级 
                    renderCityList(data.data);

                } else {

                    console.log(data);

                }
            },
            error: function (data) {
                if ("0" == data.code) {
                    //渲染市级 
                    renderCityList(data.data);

                } else {

                    console.log(data);

                }

            }
        })
    }


    // 渲染市级列表
    function renderCityList(msg) {
        $(".cityList ul").html("");

        if ("[object Array]" != Object.prototype.toString.call(msg)) {
            console.log("数据不是数组")
            return
        }

        // if(0==msg.length){
        //     //没有数据市级不可点击
        //     isCityData=false;
        //     return 
        // }else{
        //     isCityData=true;
        // }
        //数据为空，则为空数组
        msg = msg || [];
        // 如果为空数组的话，则返回,如果省份没有则不显示选择列表
        if (0 == msg.length) {
            return
        }
        var temp = "";
        msg.forEach(function (item, index) {
            temp += '<li class="option-list" data-parentid=' + item.code + '>' + item.name + '</li>';
        });
        //渲染
        $(".cityList ul").html(temp);
    }

    var cityName = null;

    //点击市 展开市级列表 
    $(".city").on("click", function (e) {
        e.stopPropagation();
        //  隐藏市和区列表
        $(".districtList").addClass("hideDiv");
        $(".provinceList").addClass("hideDiv");
        //改变省级箭头指向
        if (!$(".province").find(".arrow").hasClass("icon-Group-1")) {
            //TODO
            // changeArrow("#province"); 
            $(".province").find(".arrow").addClass("icon-Group-1").removeClass("icon-Group-");


        }
        //改变区级箭头
        if (!$(".district").find(".arrow").hasClass("icon-Group-1")) {
            //TODO
            // changeArrow("#district"); 
            $(".district").find(".arrow").addClass("icon-Group-1").removeClass("icon-Group-");

        }

        //判断选中的值是否为空
        if ($(".province").find(".content-area").text() == "请选择省份") {
            selectProvinceData = false;
        } else if ($(".province").find(".content-area").text() == "") {
            selectProvinceData = false;
        } else {
            selectProvinceData = true;
        }
        //点击省之后，市可以点击
        if (cityClick && selectProvinceData) {
            // 清空区级选中项和区级列表
            // $("#content").html("");
            $(".districtList ul").html("");
            $(".district").find(".content-area").text("请选择所在区");

            //显示市级列表
            $(".cityList").removeClass("hideDiv");

            // 市级列表选中 赋值
            cityName = $(this).data("name");
            // 更换箭头
            changCityArrow(this);

        }


    })
    //市级列表选中赋值
    $(".cityList").on("click", ".option-list", function (e) {
        e.stopPropagation();

        //获取点击的值
        var getClickVal = $(this).text();
        // 赋值给点击省市区
        $(".city").find(".content-area").text(getClickVal);
        // 隐藏显示列表
        $(".cityList").addClass("hideDiv");
        // 内容显示
        $("#content").removeClass("hideDiv");
        // 更换省箭头
        $(".city").find(".arrow").removeClass("icon-Group-").addClass("icon-Group-1");
        // 3-1发送请求，获取区级数据  TODO
        var code = $(this).data("parentid");

        getDistrictData(code);
        // 发送请求获取网点查询数据
        getDotQuerry(code, 1);
        // 选取成功后
        controlArrow = true;
        //点击过市后，初始化区可点击
        districtClick = true;

        // 让箭头默认向下
        cityArrowFlag = true;
    })

    //改变市级箭头  TODO
    var cityArrowFlag = true;
    function changCityArrow(that) {
        if (cityArrowFlag) {
            //改变箭头指向
            $(that).find(".arrow").removeClass("icon-Group-1").addClass("icon-Group-");
            //重复点击
            cityArrowFlag = false;
        } else {
            $(that).find(".arrow").removeClass("icon-Group-").addClass("icon-Group-1");
            controlArrow = true;
        }

    }


    // 获取区级数据
    function getDistrictData(data) {

        POST({
            url: threeAction,
            data: {
                parentId: data
            },
            success: function (data) {
                if ("0" == data.code) {
                    //渲染区级 
                    renderDistrictList(data.data);

                } else {

                    console.log(data);

                }

            },
            error: function (data) {

                console.log(data);

            }
        })

    }
    //渲染区级数据
    function renderDistrictList(msg) {
        $(".districtList ul").html("");
        if ("[object Array]" != Object.prototype.toString.call(msg)) {
            console.log("数据不是数组")
            return
        }
        //数据为空，则为空数组
        msg = msg || [];
        // 如果为空数组的话，则返回,如果省份没有则不显示选择列表
        if (0 == msg.length) {
            return
        }
        var temp = "";
        msg.forEach(function (item, index) {
            temp += '<li class="option-list" data-parentid=' + item.code + '>' + item.name + '</li>';
        });
        //渲染
        $(".districtList ul").html(temp);
    }
    // 点击区 显示列表
    var districtName = null;

    //点击区 展开区级列表
    $(".district").on("click", function (e) {
        e.stopPropagation();
        //改变省级箭头指向
        if (!$(".province").find(".arrow").hasClass("icon-Group-1")) {
            //TODO
            // changeArrow("#province"); 
            $(".province").find(".arrow").addClass("icon-Group-1").removeClass("icon-Group-");
        }
        //改变市级箭头
        if (!$(".city").find(".arrow").hasClass("icon-Group-1")) {
            //TODO
            $(".city").find(".arrow").addClass("icon-Group-1").removeClass("icon-Group-");
            // changeArrow("#city"); 
        }
        //判断选中的值是否为空
        if ($(".city").find(".content-area").text() == "请选择省份") {
            selectCityData = false;
        } else if ($(".city").find(".content-area").text() == "") {
            selectCityData = fasle;
        } else {
            selectCityData = true;
        }

        if (cityClick && districtClick && selectCityData) {
            //改变区级箭头
            changDistrictArrow(this);
            //显示区级列表
            $(".districtList").removeClass("hideDiv");

            // 市级列表选中 赋值
            districtName = $(this).data("name");
        }

    })


    //区级列表 选中赋值
    $(".districtList").on("click", ".option-list", function (e) {
        e.stopPropagation();
        //获取点击的值
        var getClickVal = $(this).text();
        // 赋值给点击省市区
        $(".district").find(".content-area").text(getClickVal);
        // 隐藏显示列表
        $(".districtList").addClass("hideDiv");
        // 内容显示
        $("#content").removeClass("hideDiv");
        // 更换省箭头
        $(".district").find(".arrow").removeClass("icon-Group-").addClass("icon-Group-1");
        // 3-1发送请求，获取市级数据  TODO
        var code = $(this).data("parentid");
        // 发送请求获取网点查询数据
        getDotQuerry(code, 2);
        // 选取成功后
        controlArrow = true;
        // TODO
        districtArrowFlag = true;
        cityArrowFlag = true;
    })

    //改变区级箭头  TODO
    var districtArrowFlag = true;
    function changDistrictArrow(that) {
        if (districtArrowFlag) {
            //改变箭头指向
            $(that).find(".arrow").removeClass("icon-Group-1").addClass("icon-Group-");
            //重复点击
            districtArrowFlag = false;
        } else {
            $(that).find(".arrow").removeClass("icon-Group-").addClass("icon-Group-1");
            districtArrowFlag = true;
        }

    }


    // //5获取网点信息查询
    function getDotQuerry(msg, num) {
        POST({
            url: dotget,
            data: {
                adressCode: msg,
                level: num

            },
            success: function (data) {
                if ("0" == data.code) {
                    //获取数据成功TODO
                    renderDotList(data.data)
                } else {
                    console.log(data);
                }

            },
            error: function (data) {
                console.log(data);
            }
        })


    }
    //渲染网点查询列表
    function renderDotList(msg) {
        $("#content").html("");
        if ("[object Array]" != Object.prototype.toString.call(msg)) {
            console.log("数据不是数组")
            return
        }
        //数据为空，则为空数组
        msg = msg || [];
        // 如果为空数组的话，则返回
        if (0 == msg.length) {
            return
        }
        var temp = "";
        msg.forEach(function (item, index) {
            temp += ' <div class="content-shop">'
                + '<div class="content-shop-container">'
                + '<p class="content-shop-title">'
                + '<span class="content-shop-line"></span>'
                + '<span class="content-shop-name">' + item.networkName + '</span>'
                + '</p>'

                + '<div class="content-shop-time content-shop-introduce">'
                + '<span>营业时间:</span>'
                + '<span class="key-val">' + item.workTime + '</span>'
                + '</div>'
                + '<div class="content-shop-range content-shop-introduce">'
                + '<span>服务范围:</span>'
                + '<span class="key-val">' + item.serviceScope + '</span>'
                + '</div>'
                + '<div class="content-shop-icon content-shop-introduce">'
                + '<span>周围地标:</span>'
                + '<span class="key-val">' + item.networkMark + '</span>'
                + '</div>'
                + '<div class="content-shop-address">'
                + '<div class="icon-box-common">'
                + '<span class="address-icon common-icon"></span>'
                + '<span class="address-insurance">' + item.networkAddress + '</span>'
                + '</div>'
                + '<span class="iconfont icon-you"></span>'
                + ' </div>'
                + '<div class="content-shop-phone">'
                + ' <div class="icon-box-common">'
                + ' <span class="phone-icon common-icon"></span>'
                + '<span>' + item.mobile + '</span>'
                + '</div>'
                + '<span class="iconfont icon-you"></span>'
                + '</div>'
                + '</div>'
                + '</div></li>'
        });

        $("#content").html(temp);
    }

    // //点击地址，调用微信地图api接口
    // $(".address-insurance").on("click",function(e){

    // })


    //1 点击省之后，直接点击市，出现bug.
    //2 第二次 选择省之后，再点击市，出现bug


    //说明  省列表（.provinceList）
    //      市列表(.cityList) 
    //      区列表(.districtList)
    //      省数据 ProvinceData
    //      市数据 cityData
    //      区数据 districtData



    function threeActionShow(params) {



        //  省可点击的标识
        var provinceIsClick = false;
        // 市可点击的标识
        var cityIsClick = false;
        // 区可点击的标识
        var districIsClick = false

        // 省的数据存在
        var provinceDataExist = false;
        // 市的数据存在
        var cityDataExist = false;
        // 区的数据存在
        var districtDataExist = false;

        //  省级列表被点击
        var provinceListIsClick = false;
        //  市级列表被点击
        var cityListIsClick = false;
        //  区级列表被点击
        var districtIsClick = false;


        // 获取省的数据
        var provinceData = params.ProvinceData;
      
        // 渲染省的数据
        renderProvinceList(provinceData);
        function renderProvinceList(provinceData) {
            $(".provinceList ul").html("");
            if ("[object Array]" != Object.prototype.toString.call(msg)) {
                console.log("数据不是数组")
                return
            }
            //数据为空，则为空数组
            msg = provinceData || [];
            // 如果为空数组的话，则返回,如果省份没有则不显示选择列表
            if (0 == msg.length) {
                return
            }
            var temp = "";
            msg.forEach(function (item, index) {
                temp += '<li class="option-list" data-parentid=' + item.code + '>' + item.name + '</li>';
            });
            //渲染
            $(".provinceList ul").html(temp);
        }
        //渲染市的数据
        function renderCityList() {
            $(".cityList ul").html("");

            if ("[object Array]" != Object.prototype.toString.call(msg)) {
                console.log("数据不是数组")
                return
            }
            //数据为空，则为空数组
            msg = msg || [];
            // 如果为空数组的话，则返回,如果省份没有则不显示选择列表
            if (0 == msg.length) {
                return
            }
            var temp = "";
            msg.forEach(function (item, index) {
                temp += '<li class="option-list" data-parentid=' + item.code + '>' + item.name + '</li>';
            });
            //渲染
            $(".cityList ul").html(temp);

        }
        // 渲染区的数据
        function renderDistrictList() {
            $(".districtList ul").html("");
            if ("[object Array]" != Object.prototype.toString.call(msg)) {
                console.log("数据不是数组")
                return
            }
            //数据为空，则为空数组
            msg = msg || [];
            // 如果为空数组的话，则返回,如果省份没有则不显示选择列表
            if (0 == msg.length) {
                return
            }
            var temp = "";
            msg.forEach(function (item, index) {
                temp += '<li class="option-list" data-parentid=' + item.code + '>' + item.name + '</li>';
            });
            //渲染
            $(".districtList ul").html(temp);
        }
        // 省数据存在
        if (provinceData != undefined) {
            provinceDataExist = true;

        } else {
            provinceDataExist = false;
        }

        // 省数据的长度不等于0
        if ("0" != provinceData.length) {
            provinceDataExist = true;
        } else {
            provinceDataExist = false;
        }

        // 点击省
        if (provinceDataExist) {
            $("params.province").on("click", function (e) {
                e.stopPropagation();

                // 如果省有hideDiv，则展开省列表，并关闭其他所有的列表
                if ($(".provinceList").hasClass("hideDiv")) {
                    $(".provinceList").removeClass("hideDiv");
                }
                if (!$(".cityList").hasClass("hideDiv")) {
                    $(".cityList").addClass("hideDiv");
                }
                if (!$(".district").hasClass("hideDiv")) {
                    $(".district").addClass("hideDiv");
                }

                // 改变省级箭头指向
                changProvinceArrow(this);
                // 改变市级箭头指向
                changeCityArrow(".city");
                // 改变区级箭头指向
                changDistrictArrow(".district");


                // 市的文本选中项变为"请选择市"
                $(".city").find(".content-area").text("请选择所在市");
                //区的文本选中项变为请选择区
                $(".district").find(".content-area").text("请选择所在区");


                //市不可被点击
                districIsClick = false;

                //区不可被点击
                districtClick = false;

                //市级数据不存在
                cityDataExist = fasle;

                // 区级数据不存在

                districtDataExist = false;


            })
        }

        //省级列表 选中赋值
        $(".provinceList").on("click", ".option-list", function (e) {
            e.stopPropagation();

            // 获取点击的值
            var getClickVal = $(this).text();
            // 赋值给点击省
            $(".province").find(".content-area").text(getClickVal);

            // 隐藏省级显示列表
            $(".provinceList").addClass("hideDiv");

            // 更换省箭头
            changProvinceArrow(".province");

            //省级列表已被点击
            provinceListIsClick = true;
            //市级列表不可被点击
            cityListIsClick = false;
            //区级列表不可被点击
            districtIsClick = false;


            //省级列表被点击，则可获取市级数据
            if (provinceListIsClick) {
                // 获取市级数据  在请求函数内设置 是否获取到市级数据 TODO
                getCityData(code);
            }

            //发送请求获取省级网点查询数据
            if (provinceListIsClick) {
                getDotQuerry(code, 0);
            }

        })

        // 点击市
        $("params.city").on("click", function (e) {
            e.stopPropagation();
            if (provinceListIsClick && cityDataExist && provinceDataExist) {
                e.stopPropagation();

                // 如果省有hideDiv，则展开省列表，并关闭其他所有的列表
                if (!$(".provinceList").hasClass("hideDiv")) {
                    $(".provinceList").addClass("hideDiv");
                }
                if ($(".cityList").hasClass("hideDiv")) {
                    $(".cityList").removeClass("hideDiv");
                }
                if (!$(".district").hasClass("hideDiv")) {
                    $(".district").addClass("hideDiv");
                }

                // 改变省级箭头指向
                changProvinceArrow(".province");
                // 改变市级箭头指向
                changeCityArrow(".city");
                // 改变区级箭头指向
                changDistrictArrow(".district");

                //区的文本选中项变为请选择区
                $(".district").find(".content-area").text("请选择所在区");

                //市可被点击
                districIsClick = true;

                //区不可被点击
                districtClick = false;

                // 区级数据不存在
                districtDataExist = false;
            }

        })


        //市级列表 选中赋值
        $(".cityList").on("click", ".option-list", function (e) {
            e.stopPropagation();

            // 获取点击的值
            var getClickVal = $(this).text();

            // 赋值给点击省
            $(".city").find(".content-area").text(getClickVal);

            //选择之后， 隐藏市级显示列表
            $(".cityList").addClass("hideDiv");

            // 更换市箭头
            changCityArrow(".province");

            //市级列表不可被点击
            cityListIsClick = true;
            //区级列表不可被点击
            districtIsClick = false;

            //市级列表被点击，则可获取市级数据

            if (cityListIsClick) {
                // 获取区级数据  在请求函数内设置 是否获取到区级数据 TODO
                getDistrictData(code);
            }

            //发送请求获取市级网点查询数据
            if (provinceListIsClick) {
                getDotQuerry(code, 0);
            }
        })

        // 点击区
        $("params.district").on("click", function (e) {
            e.stopPropagation();
            if (provinceListIsClick && cityDataExist && provinceDataExist && cityListIsClick && districtDataExist) {
                e.stopPropagation();
                // 如果省有hideDiv，则展开省列表，并关闭其他所有的列表
                if (!$(".provinceList").hasClass("hideDiv")) {
                    $(".provinceList").addClass("hideDiv");
                }
                if (!$(".cityList").hasClass("hideDiv")) {
                    $(".cityList").addClass("hideDiv");
                }
                if ($(".districtList").hasClass("hideDiv")) {
                    $(".districtList").removeClass("hideDiv");
                }

                // 改变省级箭头指向
                changProvinceArrow(".province");
                // 改变市级箭头指向
                changeCityArrow(".city");
                // 改变区级箭头指向
                changDistrictArrow(".district");

                //区可被点击
                districtClick = true;
            }
        })


        // 改变箭头指向  ===  省列表是否有类名hideDiv
        function changProvinceArrow(that) {
            // 判断是否有类名  ---朝下
            if ($(that).hasClass("hideDiv")) {
                // 有则箭头朝下
                $(".province").find(".arrow").removeClass("icon-Group-").addClass("icon-Group-1");
            } else {
                // 没有则箭头朝上
                $(".province").find(".arrow").removeClass("icon-Group-").addClass("icon-Group-1");

            }
        }


        // 改变箭头指向  ===  市列表是否有类名hideDiv
        function changeCityArrow(that) {
            // 判断是否有类名  ---朝下
            if ($(that).hasClass("hideDiv")) {
                // 有则箭头朝下
                $(".city").find(".arrow").removeClass("icon-Group-").addClass("icon-Group-1");
            } else {
                // 没有则箭头朝上
                $(".city").find(".arrow").removeClass("icon-Group-").addClass("icon-Group-1");

            }
        }
        // 改变箭头指向  ===  区列表是否有类名hideDiv
        function changDistrictArrow(that) {
            // 判断是否有类名  ---朝下
            if ($(that).hasClass("hideDiv")) {
                // 有则箭头朝下
                $(".district").find(".arrow").removeClass("icon-Group-").addClass("icon-Group-1");
            } else {
                // 没有则箭头朝上
                $(".district").find(".arrow").removeClass("icon-Group-").addClass("icon-Group-1");

            }
        }
        // 获取市级数据
        function getCityData(data) {
            POST({
                url: threeAction,
                data: {
                    parentId: data
                },
                success: function () {
                    if ("0" == data.code) {
                        //渲染市级
                        if("0"!=data.data.length){
                            renderCityList(data.data);
                            cityDataExist=true;
                        }
                    } else {

                        console.log(data);
                        cityDataExist=false;

                    }
                },
                error: function (data) {
                    cityDataExist=false;
                    console.log(data);
                }
            })
        }
        // 获取区级数据  
        function getDistrictData(data) {
            POST({
                url: threeAction,
                data: {
                    parentId: data
                },
                success: function (data) {
                    if ("0" == data.code) {
                        //渲染区级 
                        
                        if("0"!=data.data.length){
                            renderDistrictList(data.data);
                            districtDataExist=true;
                        }else{
                            districtDataExist=false; 
                        }
                        

                    } else {
                        districtDataExist=false;                        
                        console.log(data);

                    }

                },
                error: function (data) {

                    districtDataExist=false; 
                    console.log(data);

                }
            })

        }
        // //5获取网点信息查询
        function getDotQuerry(msg, num) {
            POST({
                url: dotget,
                data: {
                    adressCode: msg,
                    level: num

                },
                success: function (data) {
                    if ("0" == data.code) {
                        //获取数据成功TODO
                        renderDotList(data.data)
                    } else {
                        console.log(data);
                    }

                },
                error: function (data) {
                    console.log(data);
                }
            })
        }

        //渲染网点查询列表
        function renderDotList(msg) {
            $("#content").html("");
            if ("[object Array]" != Object.prototype.toString.call(msg)) {
                console.log("数据不是数组")
                return
            }
            //数据为空，则为空数组
            msg = msg || [];
            // 如果为空数组的话，则返回
            if (0 == msg.length) {
                return
            }
            var temp = "";
            msg.forEach(function (item, index) {
                temp += ' <div class="content-shop">'
                    + '<div class="content-shop-container">'
                    + '<p class="content-shop-title">'
                    + '<span class="content-shop-line"></span>'
                    + '<span class="content-shop-name">' + item.networkName + '</span>'
                    + '</p>'

                    + '<div class="content-shop-time content-shop-introduce">'
                    + '<span>营业时间:</span>'
                    + '<span class="key-val">' + item.workTime + '</span>'
                    + '</div>'
                    + '<div class="content-shop-range content-shop-introduce">'
                    + '<span>服务范围:</span>'
                    + '<span class="key-val">' + item.serviceScope + '</span>'
                    + '</div>'
                    + '<div class="content-shop-icon content-shop-introduce">'
                    + '<span>周围地标:</span>'
                    + '<span class="key-val">' + item.networkMark + '</span>'
                    + '</div>'
                    + '<div class="content-shop-address">'
                    + '<div class="icon-box-common">'
                    + '<span class="address-icon common-icon"></span>'
                    + '<span class="address-insurance">' + item.networkAddress + '</span>'
                    + '</div>'
                    + '<span class="iconfont icon-you"></span>'
                    + ' </div>'
                    + '<div class="content-shop-phone">'
                    + ' <div class="icon-box-common">'
                    + ' <span class="phone-icon common-icon"></span>'
                    + '<span>' + item.mobile + '</span>'
                    + '</div>'
                    + '<span class="iconfont icon-you"></span>'
                    + '</div>'
                    + '</div>'
                    + '</div></li>'
            });
            $("#content").html(temp);
        }
    }
})