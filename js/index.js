
$(function getCity(){
    var latlon = null;
   $.ajax({
       url: "https://api.map.baidu.com/location/ip?ak=CoiggrPeSyLfenXVKOueP1VwmEuUV39y&coor=bd09ll",
       type: "POST",
       dataType: "jsonp",
       success: function (data) {
           latlon = data.content.point.y + "," + data.content.point.x;
           let province =  data.content.address_detail.province
           let city = data.content.address_detail.city
           $('#modeCity').val(city)
           $('#modeCity').text(city)
       }
   });
})
var phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;//手机号正则
var count = 60; //间隔函数，1秒执行
var InterValObj1; //timer变量，控制时间
var curCount1;//当前剩余秒数
/*第一*/
function sendMessage(){
    curCount1 = count;
    var mobile = $.trim($('#mobile').val());
    if (!phoneReg.test(mobile)) {
        layer.open({content: '请输入有效的手机号码',skin: 'msg',time: 2});
            return false;
    }
    //设置button效果，开始计时

    $.post('https://zheyinapi.slivertree.com/api/send_sms',{phone:mobile},function (data) {

        if(data.code==200){
            $("#btnSendCode1").attr("disabled", "true");
            $("#btnSendCode1").val( + curCount1 + "秒再获取");
            InterValObj1 = window.setInterval(SetRemainTime1, 1000); //启动计时器，1秒执行一次
        }else if(data.code==500){
            layer.open({content: '验证码错误',skin: 'msg',time: 2});
            return false;
        }else {
            layer.open({content: '发送验证码次数达到上限',skin: 'msg',time: 2});
        return false;
        }
    });
}
function SetRemainTime1() {
    if (curCount1 == 0) {
        window.clearInterval(InterValObj1);//停止计时器
        $("#btnSendCode1").removeAttr("disabled");//启用按钮
        $("#btnSendCode1").val("重新发送");
    }
    else {
        curCount1--;
        $("#btnSendCode1").val( + curCount1 + "秒再获取");
    }
}
function check(){
    var mobile =$('#mobile').val()
    var mobile = $.trim($('#mobile').val());
    if (!phoneReg.test(mobile)) {
        layer.open({content: '请输入有效的手机号码',skin: 'msg',time: 2});
            return false;
    }
}
function sub(){
    var page_id =58
    var url = window.location.href;
    var name = $('#name').val()
    var mobile =$('#mobile').val()
    var code=$('#code').val();
    var money =$('#money').val()
    var city =$('#city').val()
    var baodan_is = $('#baodan_is').val()
    var gongjijin = $('#gongjijin').val()
    if(!/^[\u4e00-\u9fa5]+$/.test(name)){
        layer.open({content: '请输入正确的中文名字',skin: 'msg',time: 2});
        return false;
    }else if(!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(mobile)){
        layer.open({content: '请输入正确的手机号码',skin: 'msg',time: 2});
        return false;
    return false;
    }
    else if(code==''){
        layer.open({content: '请输入正确的验证码',skin: 'msg',time: 2});
        return false;
    }else if(money==''){
        layer.open({content: '请选择贷款金额',skin: 'msg',time: 2});
        return false;

}else if(city==''){
        layer.open({content: '请选择城市',skin: 'msg',time: 2});
        return false;
   
    }else if(baodan_is=='' && gongjijin==''){
        layer.open({content: '商业保险信息和公积金至少选择一项',skin: 'msg',time: 2});
       return false;
    }
  
    else if(!$(":checkbox").get(0).checked){
        layer.open({content: '请勾选同意用户协议！',skin: 'msg',time: 2});
        return false;
    }else{
        $.ajax({
            type:"POST",                      //请求类型
            url:"https://zheyinapi.slivertree.com/api/add_user", //URL
            data:{name:name,mobile:mobile,page_id:page_id,url:url,money:money,code:code,city:city,remark:`${baodan_is}${gongjijin}`}, //传递的参数
            dataType:"json",                 //返回的数据类型
            success:function(data){
                if(data.code == 300||data.code == 600){
                    $('#submit').attr('onClick','submitForm()');
                    alert(data.message);
                    return false;
                }else if(data.code == 200){
                    layer.open({content: '申请成功，我司将提供免费贷款方案，通过电话联系您，请注意接听！银树科技，助贷大平台，让你贷款无忧！！',btn: '确定',yes:function(){location.reload();}});
                    return false;
                }
            },
            error:function(data){
                $('#submit').attr('onClick','submitForm()');
                layer.open({content: '提交失败',skin: 'msg',time: 2});
                return false;
            }
        });
    }
}
