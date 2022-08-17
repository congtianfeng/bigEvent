$(function() {
    $('.login_box a').click(function() {
        $('.login_box').hide()
        $('.reg_box').show()
    })

    $('.reg_box a').click(function() {
        $('.login_box').show()
        $('.reg_box').hide()
    })
    let layer = layui.layer
    let form = layui.form
    form.verify({
        account: [/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/, '字母开头，允许5-16字节，允许字母数字下划线'],
        pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repass: function(value) {
            let password = $('.reg_box input[name="password"]').val()
            if (value !== password) return '两次密码不一致'
        }
    })

    $('.login_box').submit(function(e) {
        e.preventDefault()
        let data = $(this).serialize()
        $.ajax({
            type: "POST",
            url: "http://www.liulongbin.top:3007/api/login",
            data: data,
            success: function(res) {
                if (res.status !== 0) return layer.msg('登录失败！')
                localStorage.setItem('token', res.token)
                location.href = "./index.html"

            }
        });
    })
    $('.reg_box').submit(function(e) {
        e.preventDefault()
        let data = $(this).serialize()
        $.ajax({
            type: "POST",
            url: "http://www.liulongbin.top:3007/api/reguser",
            data: data,
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message)
                $('.login_box').show()
                $('.reg_box').hide()
                return layer.msg('注册成功！')
            }
        });
    })


})