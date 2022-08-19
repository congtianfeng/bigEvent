let layer = layui.layer
getUserInfo()
    // 获取用户个人信息函数

function getUserInfo() {
    // let str = ''
    $.ajax({
        method: 'GET',
        url: 'http://www.liulongbin.top:3007/my/userinfo',
        headers: { Authorization: localStorage.getItem('token') || '' },
        success: function(res) {
            if (res.status !== 0) return layer.msg('获取用户信息失败！')
            render(res.data)
        },
        complete: function(ress) {
            if (ress.responseJSON.status === 1 && ress.responseJSON.message === '身份认证失败！') {
                // 1. 强制清空 token
                localStorage.removeItem('token')
                    // 2. 强制跳转到登录页面
                location.href = '/login.html'
            }
        }
    })
}
// 渲染函数
function render(value) {
    let name = value.nickname || value.username
    $('.username').html(name)
    if (value.user_pic) {
        $('.layui-nav-img').attr('src', value.user_pic)
        $('.img-src').hide()
    } else {
        str = value.nickname[0] || value.username[0]

        $('.layui-nav-img').hide()
        $('.img-src').html(str.toUpperCase())
    }

}
$('#quit').click(function() {
    layer.confirm('确定退出?', { icon: 3, title: '提示' }, function(index) {
        //do something
        location.href = '/login.html'
        layer.close(index);
    });

})