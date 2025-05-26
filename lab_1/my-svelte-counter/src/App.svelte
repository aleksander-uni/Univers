<script>
  import { onMount } from 'svelte';

  let imageUrl = '';
  let canvas;
  let ctx;
  let brightness = 100;
  let contrast = 100;
  let saturation = 100;
  let blur = 0;

  onMount(() => {
    ctx = canvas.getContext('2d');
  });

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imageUrl = e.target.result;
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          applyFilters(img);
        };
        img.src = imageUrl;
      };
      reader.readAsDataURL(file);
    }
  }

  function applyFilters(img) {
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }

  function updateImage() {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => applyFilters(img);
      img.src = imageUrl;
    }
  }

  $: {
    brightness;
    contrast;
    saturation;
    blur;
    updateImage();
  }

  function downloadImage() {
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  }
</script>

<main>
  <div class="header">
    <h1>PhotoEditor</h1>
    <p>Загрузите изображение и редактируйте его</p>
  </div>

  <div class="editor">
    <div class="tools">
      <label class="file-input">
        <input type="file" accept="image/*" on:change={handleFileSelect}>
        <span>Выбрать файл</span>
      </label>

      <div class="sliders">
        <div class="slider-group">
          <label>Яркость</label>
          <input type="range" min="0" max="200" bind:value={brightness}>
          <span>{brightness}%</span>
        </div>

        <div class="slider-group">
          <label>Контраст</label>
          <input type="range" min="0" max="200" bind:value={contrast}>
          <span>{contrast}%</span>
        </div>

        <div class="slider-group">
          <label>Насыщенность</label>
          <input type="range" min="0" max="200" bind:value={saturation}>
          <span>{saturation}%</span>
        </div>

        <div class="slider-group">
          <label>Размытие</label>
          <input type="range" min="0" max="10" step="0.1" bind:value={blur}>
          <span>{blur}px</span>
        </div>
      </div>

      <button class="download-btn" on:click={downloadImage} disabled={!imageUrl}>
        Скачать изображение
      </button>
    </div>

    <div class="canvas-container">
      {#if !imageUrl}
        <div class="placeholder">
          <span>Загрузите изображение для редактирования</span>
        </div>
      {/if}
      <canvas bind:this={canvas}></canvas>
    </div>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    min-height: 100vh;
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
  }

  h1 {
    color: white;
    font-size: 2.5rem;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .header p {
    color: rgba(255, 255, 255, 0.9);
    margin: 0.5rem 0;
  }

  .editor {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    backdrop-filter: blur(10px);
  }

  .tools {
    padding: 2rem;
    background: rgba(245, 246, 250, 0.9);
    border-right: 1px solid rgba(223, 230, 233, 0.5);
    backdrop-filter: blur(5px);
  }

  .file-input {
    display: block;
    margin-bottom: 2rem;
  }

  .file-input input {
    display: none;
  }

  .file-input span {
    display: block;
    padding: 1rem;
    background: rgba(108, 92, 231, 0.9);
    color: white;
    text-align: center;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);
  }

  .file-input span:hover {
    background: rgba(108, 92, 231, 1);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(108, 92, 231, 0.4);
  }

  .slider-group {
    margin-bottom: 1.5rem;
    background: rgba(255, 255, 255, 0.7);
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .slider-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2d3436;
    font-weight: 500;
  }

  .slider-group input[type="range"] {
    width: 100%;
    margin-bottom: 0.5rem;
    height: 6px;
    background: rgba(108, 92, 231, 0.2);
    border-radius: 3px;
    cursor: pointer;
  }

  .slider-group input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: #6c5ce7;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .slider-group input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  .slider-group span {
    color: #2d3436;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .download-btn {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(45deg, #00b894, #00cec9);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
  }

  .download-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 184, 148, 0.4);
  }

  .download-btn:disabled {
    background: linear-gradient(45deg, #b2bec3, #dfe6e9);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .canvas-container {
    position: relative;
    padding: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(223, 230, 233, 0.3);
    min-height: 400px;
    backdrop-filter: blur(5px);
  }

  canvas {
    max-width: 100%;
    height: auto;
    background: white;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  .placeholder {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: rgba(99, 110, 114, 0.9);
    font-size: 1.1rem;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
  }
</style>