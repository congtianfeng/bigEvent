$(function() {
    let form = layui.form
    let layer = layui.layer
    let state = '已发布'
    $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取文章类型失败！')
                $.each(res.data, function(index, item) {

                    $('.un').append(`<option value=${item.Id}>${item.name}</option>`)
                })
                form.render()
            }
        })
        // 初始化富文本编辑器
    initEditor()
        // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    $('.selectF').click(function() {
        $('#selectBtn').click()
    })
    $('#selectBtn').on('change', function(e) {
        var file = e.target.files[0]
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    $('#caogao').click(function() {
        state = '草稿'
    })
    $('.formT').submit(function(e) {
        e.preventDefault()
        let fd = new FormData($(this)[0])
        fd.append('state', state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                console.log(fd);
                pubArt(fd)
            })
        console.log(fd);
    })
})

function pubArt(fd) {
    $.ajax({
        method: 'POST',
        url: '/my/article/add',
        data: fd,
        contentType: false,
        processData: false,
        success: function(res) {
            if (res.status != 0) return layer.msg('发布文章失败！')
            layer.msg('发布文章成功！')
            location.href = '/article/artlist.html'
        }
    })

}