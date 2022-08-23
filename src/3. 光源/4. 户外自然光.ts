import * as THREE from 'three'
import { GUI } from 'dat.gui'
// 创建一个场景
// create a scene, that will hold all our elements such as objects, cameras and lights.
var scene = new THREE.Scene()
scene.fog = new THREE.Fog(0xaaaaaa, 0.01, 200)

// create a camera, which defines where we're looking at.
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

// create a render and set the size
var renderer = new THREE.WebGLRenderer()

renderer.setClearColor(new THREE.Color(0xaaaaff), 1.0)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

const textureGrass = new THREE.TextureLoader().load('/textures/ground/grasslight-big.jpg')
textureGrass.wrapS = THREE.RepeatWrapping
textureGrass.wrapT = THREE.RepeatWrapping
textureGrass.repeat.set(4, 4)

var planeGeometry = new THREE.PlaneGeometry(1000, 200, 20, 20)
var planeMaterial = new THREE.MeshLambertMaterial({ map: textureGrass })
var plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.receiveShadow = true

// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI
plane.position.set(15, 0, 0)

// add the plane to the scene
scene.add(plane)

// create a cube
var cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff3333 })
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.castShadow = true

// position the cube
cube.position.set(-4, 3, 0)

// add the cube to the scene
scene.add(cube)

var sphereGeometry = new THREE.SphereGeometry(4, 25, 25)
var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff })
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

// position the sphere
sphere.position.set(10, 5, 10)
sphere.castShadow = true

// add the sphere to the scene
scene.add(sphere)

// position and point the camera to the center of the scene
camera.position.set(-20, 15, 45)
camera.lookAt(new THREE.Vector3(10, 0, 0))

// add spotlight for a bit of light
var spotLight0 = new THREE.SpotLight(0xcccccc)
spotLight0.position.set(-40, 60, -10)
spotLight0.lookAt(plane.position)
scene.add(spotLight0)

var target = new THREE.Object3D()
target.position.set(5, 0, 0)

var hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6)
hemiLight.position.set(0, 500, 0)
scene.add(hemiLight)

var pointColor = '#ffffff'
var dirLight = new THREE.DirectionalLight(pointColor)
dirLight.position.set(30, 10, -50)
dirLight.castShadow = true
dirLight.target = plane
dirLight.shadow.camera.near = 0.1
dirLight.shadow.camera.far = 200
dirLight.shadow.camera.left = -50
dirLight.shadow.camera.right = 50
dirLight.shadow.camera.top = 50
dirLight.shadow.camera.bottom = -50
dirLight.shadow.mapSize.width = 2048
dirLight.shadow.mapSize.height = 2048

scene.add(dirLight)

// add the output of the renderer to the html element
document.getElementById('app')!.appendChild(renderer.domElement)

// call the render function
var step = 0

// used to determine the switch point for the light animation

var controls = {
  rotationSpeed: 0.03,
  bouncingSpeed: 0.03,
  hemisphere: true,
  color: 0x00ff00,
  skyColor: 0x0000ff,
  intensity: 0.6
}

var gui = new GUI()

gui.add(controls, 'hemisphere').onChange(function (e) {
  if (!e) {
    hemiLight.intensity = 0
  } else {
    hemiLight.intensity = controls.intensity
  }
})
gui.addColor(controls, 'color').onChange(function (e) {
  hemiLight.groundColor = new THREE.Color(e)
})
gui.addColor(controls, 'skyColor').onChange(function (e) {
  hemiLight.color = new THREE.Color(e)
})
gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
  hemiLight.intensity = e
})

render()

function render() {
  // rotate the cube around its axes
  cube.rotation.x += controls.rotationSpeed
  cube.rotation.y += controls.rotationSpeed
  cube.rotation.z += controls.rotationSpeed

  // bounce the sphere up and down
  step += controls.bouncingSpeed
  sphere.position.x = 20 + 10 * Math.cos(step)
  sphere.position.y = 2 + 10 * Math.abs(Math.sin(step))

  requestAnimationFrame(render)
  renderer.render(scene, camera)
}
