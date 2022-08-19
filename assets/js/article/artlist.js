let layer = layui.layer
let form = layui.form
let laypage = layui.laypage
let q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
}
let i = 0
let obj = {}
let id = 0
let state = '已发布'
$(function() {
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

    getArtList()
    getArtTypeLister()
        // 筛选按钮
    $('#artSelect').submit(function(e) {
            e.preventDefault()
            q.cate_id = $('[name="cate_id"]').val()
            q.state = $('[name="state"]').val()
            getArtList()
        })
        // 文章编辑功能
    $('tbody').on('click', '.editorArt', function() {
        id = $(this).attr('name')
        $('.layui-card').hide()
        $('.layui-card2').show()
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                if (res.status !== 0) return
                form.val('formm', res.data)
            }
        })
    })
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
            console.log(2222);
            e.preventDefault()
            let fd = new FormData($('.formT')[0])
            fd.append('state', state)
            fd.append('Id', id)
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    fd.append('cover_img', blob)
                    editArt(fd)
                    getArtList()
                    $('.layui-card').show()
                    $('.layui-card2').hide()

                })

        })
        // 删除功能
    $('tbody').on('click', '.delArt', function() {
        let id = $(this).attr('name')
        let length = $('.delArt').length
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            console.log(length);
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg('删除文章失败！')
                    if (length === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    getArtList()
                }
            })
            layer.close(index);
        });
    })



});
// 获取文章列表

function getArtList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function(res) {
            if (res.status !== 0) return layer.msg('获取文章列表失败！')
            renderList(res.data)
            renderPage(res.total)
                //执行一个laypage实例



        }
    })
}

// 分页
function renderPage(x) {
    laypage.render({
        elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
        count: x, //数据总数，从服务端得到
        // limit: 1, //每页显示的条数
        limit: q.pagesize, // 每页显示几条数据
        limits: [2, 3, 5, 10],
        curr: q.pagenum, // 设置默认被选中的分页
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        jump: function(obj, first) {
            q.pagenum = obj.curr
            q.pagesize = obj.limit
            if (!first) {
                //do something
                getArtList()
            }

        }
    });
}


function renderList(value) {
    $('tbody').html('')
    $.each(value, function(index, item) {
        $('tbody').append(`<tr>
        <td>${item.title}</td>
        <td>${item.cate_name}</td>
        <td>${item.pub_date}</td>
        <td>${item.state}</td>
        <td><button class="layui-btn layui-btn-xs editorArt" lay-submit lay-filter="formDemo"  name=${item.Id}>编辑</button>
        <button class="layui-btn layui-btn-xs layui-btn-danger delArt"  name=${item.Id}>删除</button></td>
        </tr>
        `)

    })
}

function getArtTypeLister() {
    // 获取文章分类列表
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
            if (res.status !== 0) return layer.msg('获取文章类型失败！')
            $('.un').html('<option value="">请选择文章类别</option>')
            $.each(res.data, function(index, item) {

                $('.un').append(`<option value=${item.Id}>${item.name}</option>`)
            })
            form.render()
        }
    })

}

function editArt(fd) {
    $.ajax({
        method: 'POST',
        url: '/my/article/edit',
        data: fd,
        contentType: false,
        processData: false,
        success: function(res) {
            if (res.status !== 0) return layer.msg('更新文章失败！')
            return layer.msg('更新文章成功！')

        }
    })
}