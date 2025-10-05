document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

  const form = document.getElementById('surveyForm');
  const thanks = document.getElementById('thanks');
  const formError = document.getElementById('formError');
  if (form && thanks) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Hide previous error messages
      if (formError) { 
        formError.hidden = true; 
        formError.textContent = ''; 
      }
      
      // Get form data
      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        use_case: formData.get('use_case'),
        capacity: formData.get('capacity'),
        email: formData.get('email') || null,
        feedback: formData.get('feedback') || null
      };
      
      try {
        // Submit to backend (Vercel serverless function)
        const response = await fetch('/api/survey.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
          // Success - show thank you message
          form.reset();
          thanks.hidden = false;
          setTimeout(() => { thanks.hidden = true; }, 4000);
          console.log('Survey submitted successfully:', result);
        } else {
          // Error from server
          throw new Error(result.error || 'Failed to submit survey');
        }
      } catch (error) {
        // Network error or server error
        console.error('Survey submission error:', error);
        if (formError) {
          formError.textContent = 'Failed to submit survey. Please try again.';
          formError.hidden = false;
        }
      }
    });
  }

  // Removed i18n/bilingual logic; page is English-only now.

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (ev) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          ev.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach((el) => io.observe(el));

  // Removed cinematic starfield/nebula background logic.

  // Removed parallax layers logic (layers are hidden in CSS).
  const layers = document.querySelectorAll('.hero .layer');
  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    layers.forEach((layer) => {
      const depth = parseFloat(layer.getAttribute('data-depth') || '0.1');
      const tx = dx * depth * 20;
      const ty = dy * depth * 12;
      // layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`; 
    });
  });


  // Magnetic buttons
  document.querySelectorAll('.magnet').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${mx * 0.1}px, ${my * 0.1}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  // Theme toggle (light/dark) with persistence
  const themeToggle = document.getElementById('themeToggle');
  // Set default theme to 'light' for the new theme
  const savedTheme = (() => { try { return localStorage.getItem('pv_theme') || 'light'; } catch { return 'light'; } })();
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('pv_theme', next); } catch {}
    });
  }

  // 3D product hero using Three.js
  const mount = document.getElementById('three-hero');
  if (mount && window.THREE) {
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(1.1, 0.7, 2.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Lights - Softer studio lights for light theme
    const ambient = new THREE.AmbientLight(0xffffff, 0.9); 
    scene.add(ambient);
    const dir1 = new THREE.SpotLight(0xffffff, 0.8, 10, Math.PI/6, 0.4, 1.2); dir1.position.set(3, 4, 3); scene.add(dir1);
    // Accent light switched to calm blue
    const dir2 = new THREE.PointLight(0x3b82f6, 0.5, 6); dir2.position.set(-2, 1.5, -2.5); scene.add(dir2);

    // Single-layer container: outer shell and lid
    const group = new THREE.Group(); scene.add(group);
    const shellGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.2, 64, 1, true);
    // Light, soft container color
    const shellMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, metalness: 0.6, roughness: 0.35, side: THREE.DoubleSide });
    const shell = new THREE.Mesh(shellGeo, shellMat); group.add(shell);

    const lidGeo = new THREE.CylinderGeometry(0.56, 0.56, 0.18, 64);
    // Slightly lighter lid color
    const lidMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, metalness: 0.5, roughness: 0.25 });
    const lid = new THREE.Mesh(lidGeo, lidMat); lid.position.y = 0.69; group.add(lid);

    // Seam ring - using the playful color
    const seamRingGeo = new THREE.TorusGeometry(0.585, 0.03, 24, 64);
    const seamRingMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.2, roughness: 0.5, emissive: 0x3b82f6, emissiveIntensity: 0.25 });
    const seamRing = new THREE.Mesh(seamRingGeo, seamRingMat);
    seamRing.position.y = 0.60;
    seamRing.rotation.x = Math.PI / 2;
    group.add(seamRing);

    // Ground glow plane (Subtler)
    const glowGeo = new THREE.PlaneGeometry(5, 5);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xdddddd, transparent: true, opacity: 0.4 });
    const glow = new THREE.Mesh(glowGeo, glowMat); glow.position.y = -0.8; glow.rotation.x = -Math.PI / 2; scene.add(glow);

    // Subtle halo accent beneath lid - using the playful color
    const haloGeo = new THREE.RingGeometry(0.35, 0.52, 48);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.12, side: THREE.DoubleSide });
    const halo = new THREE.Mesh(haloGeo, haloMat); halo.rotation.x = Math.PI / 2; halo.position.y = 0.6; group.add(halo);

    // Resize handler
    function onResize() {
      const w = mount.clientWidth || mount.offsetWidth; const h = mount.clientHeight || mount.offsetHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);
    onResize();

    // Mouse parallax rotation
    let targetX = 0, targetY = 0;
    mount.addEventListener('mousemove', (e) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * 2 - 1;
      const y = (e.clientY - rect.top) / rect.height * 2 - 1;
      targetX = x * 0.5; targetY = -y * 0.3;
    });

    // Particle disintegration setup
    const sourceMeshes = [shell, lid, seamRing];
    sourceMeshes.forEach((m) => m.updateMatrix());
    const targetPositions = [];
    const directions = [];
    const explodedPositions = [];
    const temp = new THREE.Vector3();
    const dir = new THREE.Vector3();
    const maxParticlesPerMesh = 2500;
    for (const mesh of sourceMeshes) {
      const posAttr = mesh.geometry.getAttribute('position');
      const count = posAttr.count;
      const step = Math.max(1, Math.floor(count / maxParticlesPerMesh));
      for (let i = 0; i < count; i += step) {
        temp.fromBufferAttribute(posAttr, i).applyMatrix4(mesh.matrix);
        targetPositions.push(temp.x, temp.y, temp.z);
        dir.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        const dist = 0.8 + Math.random() * 1.4;
        directions.push(dir.x, dir.y, dir.z, dist);
        explodedPositions.push(temp.x + dir.x * dist, temp.y + dir.y * dist, temp.z + dir.z * dist);
      }
    }
    const particleCount = targetPositions.length / 3;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i*3+0] = (Math.random() - 0.5) * 0.1;
      particlePos[i*3+1] = (Math.random() - 0.5) * 0.1;
      particlePos[i*3+2] = (Math.random() - 0.5) * 0.1;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    // Particle color switched to calm blue
    const particleMat = new THREE.PointsMaterial({ color: 0x3b82f6, size: 0.015, transparent: true, opacity: 0.95, depthWrite: false, sizeAttenuation: true });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    shell.visible = lid.visible = seamRing.visible = halo.visible = false;

    let phase = 'explode'; // explode -> implode -> lidOpen -> lidClose -> explode...
    let tPhase = 0;
    const explodeDuration = 1400; // ms
    const implodeDuration = 1400; // ms
    const lidOpenDuration = 1000; // ms
    const lidCloseDuration = 900; // ms
    let lastTime = performance.now();

    function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
    function easeInOutCubic(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

    function updateParticles() {
      const positions = particles.geometry.getAttribute('position');
      if (phase === 'explode') {
        const k = easeOutCubic(tPhase);
        for (let i = 0; i < particleCount; i++) {
          const tx = targetPositions[i*3+0];
          const ty = targetPositions[i*3+1];
          const tz = targetPositions[i*3+2];
          const dx = directions[i*4+0] * directions[i*4+3];
          const dy = directions[i*4+1] * directions[i*4+3];
          const dz = directions[i*4+2] * directions[i*4+3];
          positions.setXYZ(i, tx + dx * k, ty + dy * k, tz + dz * k);
        }
        positions.needsUpdate = true;
      } else if (phase === 'implode') {
        const k = easeInOutCubic(tPhase);
        for (let i = 0; i < particleCount; i++) {
          const ex = explodedPositions[i*3+0];
          const ey = explodedPositions[i*3+1];
          const ez = explodedPositions[i*3+2];
          const tx = targetPositions[i*3+0];
          const ty = targetPositions[i*3+1];
          const tz = targetPositions[i*3+2];
          positions.setXYZ(i, ex + (tx - ex) * k, ey + (ty - ey) * k, ez + (tz - ez) * k);
        }
        positions.needsUpdate = true;
      }
    }

    function animate(time) {
      const now = time || performance.now();
      const dt = Math.min(64, now - lastTime);
      lastTime = now;

      // idle rotation
      group.rotation.y += 0.004 + (targetX - group.rotation.y) * 0.06;
      group.rotation.x += (targetY - group.rotation.x) * 0.08;

      // pulse halo and warm point light
      const tt = now * 0.001;
      halo.material.opacity = 0.12 + Math.sin(tt * 2.0) * 0.06;
      dir2.intensity = 0.4 + Math.sin(tt * 1.6) * 0.1;

      // advance timeline
      if (phase === 'explode') {
        tPhase += dt / explodeDuration;
        if (tPhase >= 1) { tPhase = 0; phase = 'implode'; }
      } else if (phase === 'implode') {
        tPhase += dt / implodeDuration;
        if (tPhase >= 1) {
          tPhase = 0;
          particles.visible = false;
          shell.visible = lid.visible = seamRing.visible = halo.visible = true;
          phase = 'lidOpen';
        }
      } else if (phase === 'lidOpen') {
        tPhase += dt / lidOpenDuration;
        const k = easeInOutCubic(Math.min(1, tPhase));
        lid.position.y = 0.69 + k * 0.9;
        if (tPhase >= 1) { tPhase = 0; phase = 'lidClose'; }
      } else if (phase === 'lidClose') {
        tPhase += dt / lidCloseDuration;
        const k = easeInOutCubic(Math.min(1, tPhase));
        lid.position.y = 1.59 - k * 0.9;
        if (tPhase >= 1) {
          // reset for next loop
          lid.position.y = 0.69;
          shell.visible = lid.visible = seamRing.visible = halo.visible = false;
          particles.visible = true;
          tPhase = 0; phase = 'explode';
        }
      }

      if (phase === 'explode' || phase === 'implode') updateParticles();

      // subtle motion accents
      seamRing.rotation.z += 0.006;

      camera.lookAt(group.position);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    updateParticles();
    requestAnimationFrame(animate);
  }
});