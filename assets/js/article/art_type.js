$(function() {
    let layer = layui.layer
    let form = layui.form
    let i = 0
    let j = 0
    getArtTypeList()
        // 获取文章分类列表函数
    function getArtTypeList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取文章分类列表失败！')
                render(res.data)
            }
        })
    }
    // 渲染文章分类列表压面
    function render(value) {
        $.each(value, function(index, item) {
            $('tbody').append(`<tr>
            <td>${item.name}</td>
            <td>${item.alias}</td>
            <td><button class="layui-btn layui-btn-xs editor" lay-submit lay-filter="formDemo">编辑</button>
            <button type="reset" class="layui-btn layui-btn-xs layui-btn-danger del">删除</button></td>
            </tr>
            `)
            $('.editor').eq(index).attr('data-id', item.Id)
            $('.del').eq(index).attr('data-id', item.Id)
        })
    }
    // 编辑操作
    $('tbody').on('click', '.editor', function() {

        let id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取文章分类列表失败！')
                form.val('formEditor', res.data)
            }
        })

        j = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#editorModel').html(),
            area: ['500px', '270px']
        });

    })
    $('body').on('submit', '#editorForm', function(e) {
        console.log(1);
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) { layer.msg('修改文章分类失败') } else {
                    layer.msg('修改文章分类成功')
                    getArtTypeList()
                }
                layer.close(j)
            }
        })

    })


    // 删除类别
    $('tbody').on('click', '.del', function() {
        let id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg('删除文章分类失败')
                    layer.msg('修改文章分类成功')
                    getArtTypeList()


                }
            })
            layer.close(index);
        });
    })

    // 添加类别
    $('.addType').click(function() {

            i = layer.open({
                type: 1,
                title: '添加文章分类',
                content: $('#addModel').html(),
                area: ['500px', '270px']
            });

        })
        // 通过事件委托发起ajax请求
    $('body').on('submit', '#confirmAdd', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('新增文章分类失败')

                } else {
                    layer.msg('新增文章分类成功')
                    getArtTypeList()
                }
                layer.close(i)
            }
        })
    })

})