import * as THREE from 'three'
import { GUI } from 'dat.gui'
// 创建一个场景
// create a scene, that will hold all our elements such as objects, cameras and lights.
var scene = new THREE.Scene()

// create a camera, which defines where we're looking at.
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

// create a render and set the size
var renderer = new THREE.WebGLRenderer()
renderer.setClearColor(new THREE.Color(0xeeeeee), 1.0)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

var groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4)
var groundMesh = new THREE.Mesh(
  groundGeom,
  new THREE.MeshBasicMaterial({ color: 0x777777 })
)
groundMesh.rotation.x = -Math.PI / 2
groundMesh.position.y = -20
scene.add(groundMesh)

var sphereGeometry = new THREE.SphereGeometry(14, 20, 20)
var cubeGeometry = new THREE.BoxGeometry(15, 15, 15)
var planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4)

var meshMaterial = new THREE.MeshBasicMaterial({ color: 0x7777ff })

var sphere = new THREE.Mesh(sphereGeometry, meshMaterial)
var cube = new THREE.Mesh(cubeGeometry, meshMaterial)
var plane = new THREE.Mesh(planeGeometry, meshMaterial)

// position the sphere
sphere.position.set(0, 3, 2)

cube.position.set(sphere.position.x, sphere.position.y, sphere.position.z)
plane.position.set(sphere.position.x, sphere.position.y, sphere.position.z)

// add the sphere to the scene
scene.add(cube)

// position and point the camera to the center of the scene
camera.position.set(-20, 50, 40)
camera.lookAt(new THREE.Vector3(10, 0, 0))

// add subtle ambient lighting
var ambientLight = new THREE.AmbientLight(0x0c0c0c)
scene.add(ambientLight)

// add spotlight for the shadows
var spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(-40, 60, -10)
spotLight.castShadow = true
scene.add(spotLight)

// add the output of the renderer to the html element
document.getElementById('app')!.appendChild(renderer.domElement)

// call the render function
var step = 0

var controls = {
  rotationSpeed: 0.02,
  bouncingSpeed: 0.03,

  opacity: meshMaterial.opacity,
  transparent: meshMaterial.transparent,
  visible: meshMaterial.visible,
  side: 'front',

  color: meshMaterial.color.getStyle(),
  wireframe: meshMaterial.wireframe,
  wireframeLinewidth: meshMaterial.wireframeLinewidth,
  wireFrameLineJoin: meshMaterial.wireframeLinejoin,

  selectedMesh: 'cube'
}

var gui = new GUI()

var spGui = gui.addFolder('Mesh')
spGui.add(controls, 'opacity', 0, 1).onChange(function (e) {
  meshMaterial.opacity = e
})
spGui.add(controls, 'transparent').onChange(function (e) {
  meshMaterial.transparent = e
})
spGui.add(controls, 'wireframe').onChange(function (e) {
  meshMaterial.wireframe = e
})
spGui.add(controls, 'wireframeLinewidth', 0, 20).onChange(function (e) {
  meshMaterial.wireframeLinewidth = e
})
spGui.add(controls, 'visible').onChange(function (e) {
  meshMaterial.visible = e
})
spGui.add(controls, 'side', ['front', 'back', 'double']).onChange(function (e) {
  switch (e) {
    case 'front':
      meshMaterial.side = THREE.FrontSide
      break
    case 'back':
      meshMaterial.side = THREE.BackSide
      break
    case 'double':
      meshMaterial.side = THREE.DoubleSide
      break
  }
  meshMaterial.needsUpdate = true
})
spGui.addColor(controls, 'color').onChange(function (e) {
  meshMaterial.color.setStyle(e)
})
spGui
  .add(controls, 'selectedMesh', ['cube', 'sphere', 'plane'])
  .onChange(function (e) {
    scene.remove(plane)
    scene.remove(cube)
    scene.remove(sphere)

    switch (e) {
      case 'cube':
        scene.add(cube)
        break
      case 'sphere':
        scene.add(sphere)
        break
      case 'plane':
        scene.add(plane)
        break
    }

    scene.add(e)
  })
render()

function render() {
  cube.rotation.y = step += 0.01
  plane.rotation.y = step
  sphere.rotation.y = step

  // render using requestAnimationFrame
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}
