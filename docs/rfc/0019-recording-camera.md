# RFC 0019: 录制和摄像头视图

## 元数据

- **RFC ID**: 0019
- **标题**: 录制和摄像头视图
- **状态**: 草案
- **创建日期**: 2025-01-XX
- **作者**: AI Assistant
- **相关 RFC**: RFC 0002 (Slide Runner), RFC 0013 (Markdown 支持)

## 摘要

本 RFC 提议为 SlideJS 添加录制功能，支持录制幻灯片演示，包括摄像头画面叠加、音频录制，并导出为视频文件。

## 动机

### 背景问题

1. **在线教学**: 需要录制演示视频
2. **远程演示**: 需要摄像头画面叠加
3. **存档需求**: 需要保存演示视频

### 设计目标

1. **录制功能**: 支持录制幻灯片演示
2. **摄像头叠加**: 支持摄像头画面叠加
3. **音频录制**: 支持音频录制
4. **视频导出**: 支持导出为 WebM 或 MP4

## 详细设计

### 技术实现

1. **功能描述**:
   - 录制幻灯片演示
   - 支持摄像头画面叠加
   - 支持音频录制
   - 支持屏幕共享
   - 导出为视频文件

2. **实现方案**:
   - 使用 `MediaRecorder` API 录制
   - 使用 `Canvas` API 合成画面
   - 支持摄像头和屏幕共享
   - 导出为 WebM 或 MP4

3. **新包**: `@slidejs/recording`
   - `RecordingController` - 录制控制器
   - `CameraOverlay` - 摄像头叠加
   - `VideoExporter` - 视频导出

### 实施步骤

1. **创建 `@slidejs/recording` 包**:
   - 实现 `RecordingController` 组件
   - 实现摄像头获取和叠加
   - 实现音频录制
   - 实现视频导出

2. **Runner 集成**:
   - 在 Runner 中集成录制功能
   - 支持开始/停止录制
   - 支持所有 Runner（Reveal.js, Swiper, Splide）

3. **测试**:
   - 单元测试覆盖录制功能
   - 测试摄像头叠加
   - 测试音频录制
   - 测试视频导出

## 技术细节

### MediaRecorder API

```typescript
async function startRecording(): Promise<void> {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });
  
  const recorder = new MediaRecorder(stream, {
    mimeType: 'video/webm',
  });
  
  recorder.ondataavailable = (event) => {
    chunks.push(event.data);
  };
  
  recorder.start();
}
```

### 摄像头叠加

```typescript
async function addCameraOverlay(canvas: HTMLCanvasElement): Promise<void> {
  const video = document.createElement('video');
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  video.play();
  
  // 在 Canvas 上绘制摄像头画面
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, 200, 150);
}
```

## 兼容性考虑

1. **浏览器兼容性**: MediaRecorder API 需要现代浏览器支持
2. **权限**: 需要摄像头和麦克风权限
3. **性能**: 录制可能影响性能

## 风险评估

1. **浏览器兼容性**: MediaRecorder API 支持有限
2. **性能**: 录制可能影响性能
3. **文件大小**: 视频文件可能很大

## 参考

- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

## 决策记录

- **2025-01-XX**: 创建 RFC，开始讨论
- **待定**: 开始实施
