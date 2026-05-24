/**
 * Noctal — Dark, Atmospheric Nightlife Platform Experience
 * Core Interactive Systems (Custom Cursor, WebGL Dither Shader, GSAP Cinematic Animations, Web Audio Synth, Navigation)
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. DOM Elements & State
  // ==========================================================================
  const arrivalGate = document.getElementById('arrival-gate');
  const enterBtn = document.getElementById('enter-btn');
  const activeNodesMetric = document.getElementById('active-users-metric');
  
  const scrollContainer = document.getElementById('scroll-container');
  const navbar = document.querySelector('.navbar');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundText = document.getElementById('sound-text');
  const soundWaves = document.getElementById('sound-waves');
  
  const customCursor = document.getElementById('custom-cursor');
  const customCursorGlow = document.getElementById('custom-cursor-glow');

  // Application state
  let audioContext = null;
  let soundSystem = null;
  let isSoundPlaying = false;
  let isAppEntered = false;
  
  // Custom cursor mouse coordinates and lerping
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let cursorDot = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let cursorGlow = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  
  // Track window dimensions
  let winWidth = window.innerWidth;
  let winHeight = window.innerHeight;
  
  // ==========================================================================
  // 2. Custom Tactile Cursor (Lerp / Smooth Follow)
  // ==========================================================================
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  
  function updateCursor() {
    const dotLerp = 0.25;
    const glowLerp = 0.08;
    
    cursorDot.x += (mouse.x - cursorDot.x) * dotLerp;
    cursorDot.y += (mouse.y - cursorDot.y) * dotLerp;
    
    cursorGlow.x += (mouse.x - cursorGlow.x) * glowLerp;
    cursorGlow.y += (mouse.y - cursorGlow.y) * glowLerp;
    
    if (customCursor) {
      customCursor.style.left = `${cursorDot.x}px`;
      customCursor.style.top = `${cursorDot.y}px`;
    }
    
    if (customCursorGlow) {
      customCursorGlow.style.left = `${cursorGlow.x}px`;
      customCursorGlow.style.top = `${cursorGlow.y}px`;
    }
    
    requestAnimationFrame(updateCursor);
  }
  updateCursor();
  
  // Add hover effect to interactive items
  function attachHoverHandlers() {
    const interactives = document.querySelectorAll('a, button, .crt-screen, .footer-social-link');
    interactives.forEach(el => {
      el.removeEventListener('mouseenter', onHoverEnter);
      el.removeEventListener('mouseleave', onHoverLeave);
      
      el.addEventListener('mouseenter', onHoverEnter);
      el.addEventListener('mouseleave', onHoverLeave);
    });
  }
  
  function onHoverEnter() { document.body.classList.add('hovering'); }
  function onHoverLeave() { document.body.classList.remove('hovering'); }
  
  attachHoverHandlers();

  // ==========================================================================
  // 3. Auto-Hiding Navigation Bar (Prevents Text Overlaps)
  // ==========================================================================
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    if (!isAppEntered) return;
    
    const currentScrollY = window.scrollY;
    
    // Auto hide when scrolling down, reveal instantly when scrolling up
    if (currentScrollY > lastScrollY && currentScrollY > 60) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
  });

  // ==========================================================================
  // 4. GSAP Advanced Cinematic Entrance reveals
  // ==========================================================================
  function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // Reset styles on preloader items to let GSAP handle them cleanly
    gsap.set(".gate-logo, .gate-sub, .enter-btn, .gate-meta", { animation: "none", opacity: 0 });
    
    // Preloader load-in animations
    gsap.to(".gate-logo", { y: 0, opacity: 1, duration: 1.6, ease: "power4.out", delay: 0.3 });
    gsap.to(".gate-sub", { y: 0, opacity: 1, duration: 1.6, ease: "power4.out", delay: 0.6 });
    gsap.to(".enter-btn", { y: 0, opacity: 1, duration: 1.6, ease: "power4.out", delay: 0.9 });
    gsap.to(".gate-meta", { opacity: 0.6, duration: 2.2, ease: "power2.out", delay: 1.3 });
  }
  
  // Launch GSAP configurations
  initGSAPAnimations();

  // ==========================================================================
  // 5. Cinematic Entrance Trigger (Transition gate to Hero reveals)
  // ==========================================================================
  enterBtn.addEventListener('click', () => {
    enterApp();
  });

  function enterApp() {
    isAppEntered = true;
    
    if (typeof gsap !== 'undefined') {
      // Elegant timeline slide-up gate and stagger reveal hero
      const tl = gsap.timeline();
      
      tl.to("#arrival-gate", { 
        yPercent: -100, 
        duration: 1.5, 
        ease: "power4.inOut",
        onComplete: () => {
          arrivalGate.style.display = 'none';
        }
      });
      
      // Unlock body overflow
      document.body.style.overflow = 'auto';
      
      // Prepare scroll container
      tl.to("#scroll-container", { opacity: 1, y: 0, duration: 0.1 }, "-=1.1");
      
      // Staggered reveal of hero text/elements (using clearProps to prevent mobile GPU vanishing bugs)
      tl.from(".navbar", { y: -30, opacity: 0, duration: 1.3, ease: "power3.out" }, "-=0.8");
      tl.from(".editorial-sub", { x: -20, opacity: 0, duration: 1.1, ease: "power3.out", clearProps: "all" }, "-=0.8");
      tl.from(".hero-title", { y: 45, opacity: 0, duration: 1.6, ease: "power4.out", clearProps: "all" }, "-=0.7");
      tl.from(".vague-terminal", { y: 25, opacity: 0, duration: 1.3, ease: "power3.out", clearProps: "all" }, "-=0.5");
      
      // Gorgeous 3D reveal of the Hyderabad CRT Screen element
      tl.from(".crt-screen", { 
        scale: 0.93,
        rotationY: 10,
        rotationX: 4,
        opacity: 0, 
        duration: 1.8, 
        ease: "power3.out" 
      }, "-=0.6");
      
    } else {
      // Standard fallback in case GSAP fails to compile
      arrivalGate.style.transform = 'translateY(-100vh)';
      scrollContainer.classList.add('visible');
      document.body.style.overflow = 'auto';
    }
    
    // Initialize Web Audio API Progressive Club Music Soundscape
    initSoundscape();
  }

  // ==========================================================================
  // 6. Wanderers Online Dashboard Fluctuations
  // ==========================================================================
  let activeWanderers = 1024;
  setInterval(() => {
    if (!isAppEntered) return;
    
    const diff = Math.random() > 0.5 ? 1 : -1;
    activeWanderers = Math.max(1015, activeWanderers + diff);
    
    if (activeNodesMetric) {
      activeNodesMetric.textContent = activeWanderers.toLocaleString();
    }
  }, 4000);

  // ==========================================================================
  // 7. WebGL 2.0 Procedural Dither Wave Background Renderer (User Specs)
  // ==========================================================================
  function initWebGLDitherBg() {
    const canvas = document.getElementById('dither-bg-canvas');
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.warn("WebGL 2.0 not supported by browser.");
      return;
    }
    
    // Vertex Shader
    const vsSource = `#version 300 es
      in vec2 position;
      out vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    
    // Merged Noise Wave & Bayer Matrix Ordered Dithering algorithm
    const fsSource = `#version 300 es
      precision highp float;
      out vec4 outColor;
      in vec2 vUv;

      uniform vec2 resolution;
      uniform float time;
      uniform float waveSpeed;
      uniform float waveFrequency;
      uniform float waveAmplitude;
      uniform vec3 waveColor;
      uniform vec2 mousePos;
      uniform int enableMouseInteraction;
      uniform float mouseRadius;
      uniform float colorNum;
      uniform float pixelSize;

      // 8x8 Bayer Ordered Dither Matrix
      const float bayerMatrix8x8[64] = float[64](
        0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
        32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
        8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
        40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
        2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
        34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
        10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
        42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
      );

      // Noise Helpers
      vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

      float cnoise(vec2 P) {
        vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
        vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
        Pi = mod289(Pi);
        vec4 ix = Pi.xzxz;
        vec4 iy = Pi.yyww;
        vec4 fx = Pf.xzxz;
        vec4 fy = Pf.yyww;
        vec4 i = permute(permute(ix) + iy);
        vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
        vec4 gy = abs(gx) - 0.5;
        vec4 tx = floor(gx + 0.5);
        gx = gx - tx;
        vec2 g00 = vec2(gx.x, gy.x);
        vec2 g10 = vec2(gx.y, gy.y);
        vec2 g01 = vec2(gx.z, gy.z);
        vec2 g11 = vec2(gx.w, gy.w);
        vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
        g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
        float n00 = dot(g00, vec2(fx.x, fy.x));
        float n10 = dot(g10, vec2(fx.y, fy.y));
        float n01 = dot(g01, vec2(fx.z, fy.z));
        float n11 = dot(g11, vec2(fx.w, fy.w));
        vec2 fade_xy = fade(Pf.xy);
        vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
        return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
      }

      const int OCTAVES = 4;
      float fbm(vec2 p) {
        float value = 0.0;
        float amp = 1.0;
        float freq = waveFrequency;
        for (int i = 0; i < OCTAVES; i++) {
          value += amp * abs(cnoise(p));
          p *= freq;
          amp *= waveAmplitude;
        }
        return value;
      }

      float pattern(vec2 p) {
        vec2 p2 = p - time * waveSpeed;
        return fbm(p + fbm(p2)); 
      }

      vec3 dither(vec2 uv, vec3 color) {
        vec2 scaledCoord = floor(uv * resolution / pixelSize);
        int x = int(mod(scaledCoord.x, 8.0));
        int y = int(mod(scaledCoord.y, 8.0));
        float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
        float step = 1.0 / (colorNum - 1.0);
        color += threshold * step;
        
        float bias = 0.22; 
        color = clamp(color - bias, 0.0, 1.0);
        return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        
        vec2 grid = resolution / pixelSize;
        vec2 uvPixel = floor(uv * grid) / grid;
        
        vec2 waveUv = uvPixel;
        waveUv -= 0.5;
        waveUv.x *= resolution.x / resolution.y;
        
        float f = pattern(waveUv);
        
        if (enableMouseInteraction == 1) {
          vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
          mouseNDC.x *= resolution.x / resolution.y;
          float dist = length(waveUv - mouseNDC);
          float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
          f -= 0.6 * effect; 
        }
        
        vec3 col = mix(vec3(0.0, 0.0, 0.0), waveColor, f);
        col = dither(gl_FragCoord.xy / resolution, col);
        
        outColor = vec4(col, 1.0);
      }
    `;
    
    // Shader helper compiler
    function compileShader(source, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compiling error: ", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }
    
    const vertexShader = compileShader(vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fsSource, gl.FRAGMENT_SHADER);
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error: ", gl.getProgramInfoLog(program));
      return;
    }
    
    const positionAttributeLocation = gl.getAttribLocation(program, "position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    
    const resolutionLoc = gl.getUniformLocation(program, "resolution");
    const timeLoc = gl.getUniformLocation(program, "time");
    const waveSpeedLoc = gl.getUniformLocation(program, "waveSpeed");
    const waveFrequencyLoc = gl.getUniformLocation(program, "waveFrequency");
    const waveAmplitudeLoc = gl.getUniformLocation(program, "waveAmplitude");
    const waveColorLoc = gl.getUniformLocation(program, "waveColor");
    const mousePosLoc = gl.getUniformLocation(program, "mousePos");
    const enableMouseInteractionLoc = gl.getUniformLocation(program, "enableMouseInteraction");
    const mouseRadiusLoc = gl.getUniformLocation(program, "mouseRadius");
    const colorNumLoc = gl.getUniformLocation(program, "colorNum");
    const pixelSizeLoc = gl.getUniformLocation(program, "pixelSize");
    
    let glMouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      glMouse.x = e.clientX - rect.left;
      glMouse.y = e.clientY - rect.top;
    });
    
    function resize() {
      const displayWidth  = Math.floor(canvas.clientWidth);
      const displayHeight = Math.floor(canvas.clientHeight);
      
      if (canvas.width  !== displayWidth || canvas.height !== displayHeight) {
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
      }
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
    
    function render(now) {
      resize();
      
      gl.clearColor(0.04, 0.04, 0.06, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      
      gl.uniform2f(resolutionLoc, gl.canvas.width, gl.canvas.height);
      gl.uniform1f(timeLoc, now * 0.001);
      
      gl.uniform1f(waveSpeedLoc, 0.05);
      gl.uniform1f(waveFrequencyLoc, 3.0);
      gl.uniform1f(waveAmplitudeLoc, 0.3);
      gl.uniform3f(waveColorLoc, 0.48, 0.28, 0.72); 
      
      gl.uniform2f(mousePosLoc, glMouse.x, glMouse.y);
      gl.uniform1i(enableMouseInteractionLoc, 1);
      gl.uniform1f(mouseRadiusLoc, 0.095); // Tactical 10x smaller ripple
      
      gl.uniform1f(colorNumLoc, 4.0);
      gl.uniform1f(pixelSizeLoc, 2.0); 
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      
      requestAnimationFrame(render);
    }
    
    requestAnimationFrame(render);
  }
  
  initWebGLDitherBg();

  // ==========================================================================
  // 8. High-Fidelity Progressive Club Music System (With sub-bass filter sweep on entry!)
  // ==========================================================================
  class NightSoundscape {
    constructor() {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      // Master Gain for smooth volume fades
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      
      // Load real progressive electronic party track loop!
      this.audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3");
      this.audio.loop = true;
      this.audio.crossOrigin = "anonymous";
      
      // Establish routing: Audio Element -> Low-pass Filter -> Master Gain -> Output
      this.source = this.ctx.createMediaElementSource(this.audio);
      
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      
      // Initialize with muffled low-frequency subwoofer sweep (sounds like you're standing outside the warehouse!)
      this.filter.frequency.setValueAtTime(140, this.ctx.currentTime); 
      this.filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
      
      this.source.connect(this.filter);
      this.filter.connect(this.masterGain);
      
      // Pre-start audio so it's buffered and ready to play on user gestures!
      this.audio.play().catch(() => {});
    }
    
    openFilterGate() {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      
      const now = this.ctx.currentTime;
      
      // Play loop
      this.audio.play().catch(() => {});
      
      // Cinematic club filter sweep: Ramps muffled frequency up to full-fidelity over 3.5 seconds!
      this.filter.frequency.cancelScheduledValues(now);
      this.filter.frequency.setValueAtTime(this.filter.frequency.value, now);
      this.filter.frequency.exponentialRampToValueAtTime(20000, now + 3.5); 
    }
    
    fadeMaster(target, duration = 1.5) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(target, now + duration);
    }
  }

  function initSoundscape() {
    if (!soundSystem) {
      try {
        soundSystem = new NightSoundscape();
        isSoundPlaying = true;
        
        // Open low-pass gate (smooth entrance) and fade in master volume
        soundSystem.openFilterGate();
        soundSystem.fadeMaster(0.40, 2.5); // Rich volume
        
        soundToggleBtn.classList.add('playing');
        soundText.textContent = "Sound On";
      } catch (err) {
        console.error("Web Audio API progressive player failed to load", err);
      }
    } else {
      resumeSoundscape();
    }
  }
  
  function resumeSoundscape() {
    if (soundSystem) {
      if (soundSystem.ctx.state === 'suspended') {
        soundSystem.ctx.resume();
      }
      soundSystem.audio.play().catch(() => {});
      
      // Ramps filter gate open instantly on manual unmute
      const now = soundSystem.ctx.currentTime;
      soundSystem.filter.frequency.setValueAtTime(20000, now);
      
      isSoundPlaying = true;
      soundSystem.fadeMaster(0.40, 1.0);
      soundToggleBtn.classList.add('playing');
      soundText.textContent = "Sound On";
    }
  }

  function muteSoundscape() {
    if (soundSystem) {
      isSoundPlaying = false;
      soundSystem.fadeMaster(0, 0.8);
      soundToggleBtn.classList.remove('playing');
      soundText.textContent = "Sound Off";
      
      setTimeout(() => {
        if (!isSoundPlaying) {
          soundSystem.audio.pause();
        }
      }, 800);
    }
  }

  soundToggleBtn.addEventListener('click', () => {
    if (!soundSystem) {
      initSoundscape();
      return;
    }
    
    if (isSoundPlaying) {
      muteSoundscape();
    } else {
      resumeSoundscape();
    }
  });

});
