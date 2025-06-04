let scene, camera, renderer, geometry, material, mesh, particles;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function initThree() {
    const canvas = document.getElementById('three-canvas');
    scene = new THREE.Scene();
    
    // Set up camera
    camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    camera.position.z = 20;

    // Set up renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create main geometric shape
    geometry = new THREE.IcosahedronGeometry(5, 1);
    material = new THREE.MeshPhongMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        wireframeLinewidth: 2,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Add particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xc084fc,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xc084fc, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 0.8, 100);
    pointLight2.position.set(-10, -10, 5);
    scene.add(pointLight2);

    // Add mouse move event listener
    canvas.addEventListener('mousemove', onMouseMove);
}

function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    targetRotationX = mouseY * 0.5;
    targetRotationY = mouseX * 0.5;
}

function animateThree() {
    requestAnimationFrame(animateThree);

    // Smooth rotation based on mouse position
    mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.05;
    mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.05;

    // Continuous rotation for particles
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.002;

    // Pulsing effect
    const time = Date.now() * 0.001;
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1 + Math.sin(time) * 0.1;

    // Color shifting
    material.color.setHSL(0.5 + Math.sin(time * 0.1) * 0.1, 0.7, 0.6);
    
    renderer.render(scene, camera);
}

function handleResize() {
    const canvas = document.getElementById('three-canvas');
    
    windowHalfX = canvas.offsetWidth / 2;
    windowHalfY = canvas.offsetHeight / 2;
    
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
}

window.addEventListener('resize', handleResize);

// Initialize Three.js
initThree();
animateThree(); 