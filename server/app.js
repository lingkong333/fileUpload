const express = require('express')
const bodyParser = require('body-parser')
const upload = require('express-fileupload');
const { resolve } = require('path')
const { existsSync, appendFileSync, writeFileSync } = require('fs');
const app = express()
const port = 8000

// 中间件
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(upload())
app.use('/', express.static('upload_temp'))
// 允许跨域
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'POST,GET')
    next()
})

app.post('/upload_video', (req, res) => {
    // res.send({
    //     msg: 'ok',
    //     code: 0
    // })
    // console.log(req.body)
    // 获取基础信息
    const { name, type, size, fileName, uploadedSize } = req.body
    // 获取文件
    const { file } = req.files
    if (!file) {
        res.send({
            msg: '未获取到文件',
            code: 400
        })
        return
    }

    // const filename = fileName + 
    // 将前端传来的文件存放到upload_temp文件夹下
    const filePath = resolve(__dirname, './upload_temp/'+name)
    // 文件夹非第一个文件块进行上传
    if(uploadedSize !== '0') {
        // 如果没有该文件
        if(!existsSync(filePath)) {
            res.send({
                msg: '文件不存在',
                code: 500
            })
            return
        }

        appendFileSync(filePath, file.data)
        res.send({
            msg: '文件块上传成功',
            code: 200,
            video_url: 'http://localhost:8000/'+name
        })
        return
    }
    // 创建文件，写入信息
    writeFileSync(filePath, file.data)
    res.send({
        msg: '后端文件创建成功',
        code: 200
    })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))