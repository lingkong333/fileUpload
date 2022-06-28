console.log("client");
;((document) => {
  const oUploadProgress = document.getElementById("uploadProgress");
  let oUploader = document.getElementById("videoUploader");
  const oInfo = document.getElementById("uploadInfo");
  const oUploadBtn = document.getElementById("uploadBtn");

  // 执行程序
  const init = () => {
    bindEvent();
  };

  // 绑定事件
  function bindEvent() {
    oUploadBtn.addEventListener("click", uploadVideo, false);
  }

  async function uploadVideo() {
    // 获取选中的文件
    // const file = oUploader.file[0]
    const {
      files: [file],
    } = oUploader;
    // 开始上传标志
    let uploadedSize = 0;
    // 文件块大小 10M
    const CHUNK_SIZE = 10 * 1024 * 1024;
    // 从后端接收到的结果
    let uploadedResult = null
    // console.log(file)
    const { name, size, type } = file;
    if (!file) {
      oInfo.innerHTML = "请选择文件";
      return;
    } else {
      oInfo.innerHTML = `文件名称：${name}; 文件大小：${size}`;
    }
    // 上传进度条最大值
    oUploadProgress.max = size;

    const fileName = new Date().getTime() + "_" + name;

    // 切割上传
    while (uploadedSize < size) {
      let fileChunk = file.slice(uploadedSize, uploadedSize + CHUNK_SIZE);
      // 添加一些文件属性供后端使用
      const formData = createFormData({
        name,
        type,
        size,
        fileName,
        uploadedSize,
        file: fileChunk,
      });

      try {
        uploadedResult = await axios.post("http://localhost:8000/upload_video", formData);
      } catch (error) {
        oInfo.innerHTML = "上传失败";
      }

      uploadedSize += fileChunk.size
      oUploadProgress.value = uploadedSize
    }
    oInfo.innerText = '上传成功'
    // 将选中的文件夹清空
    oUploader.value = null
    createVideo(uploadedResult.data.video_url)
  }

  function createFormData({ name, type, size, fileName, uploadedSize, file }) {
    const fd = new FormData();
    fd.append("name", name);
    fd.append("type", type);
    fd.append("size", size);
    fd.append("fileName", fileName);
    fd.append("uploadedSize", uploadedSize);
    fd.append("file", file);
    return fd;
  }
// 上传成功后播放视频
  function createVideo (src) {
    const oVideo =document.createElement('video')
    oVideo.contains = true
    oVideo.width = '600'
    oVideo.src = src
    oVideo.autoplay = true
    document.body.appendChild(oVideo)
  }
  init();
})(document);
