$(function() {
    let form = layui.form
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取用户信息失败！')
                form.val('formUserInfo', res.data)
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
    $('[type="reset"]').click(function(e) {
        e.preventDefault()
        initUserInfo()

    })
    $('#editor').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg('更新用户信息失败！')
                layer.msg('更新用户信息成功！')
                initUserInfo()
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
    })
})