import * as THREE from 'three'
import { GUI } from 'dat.gui'
// 创建一个场景
var stopMovingLight = false

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
renderer.shadowMap.type = THREE.PCFShadowMap

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1)
var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
var plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.receiveShadow = true

// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI
plane.position.x = 15
plane.position.y = 0
plane.position.z = 0

// add the plane to the scene
scene.add(plane)

// create a cube
var cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff3333 })
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.castShadow = true

// position the cube
cube.position.x = -4
cube.position.y = 3
cube.position.z = 0

// add the cube to the scene
scene.add(cube)

var sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff })
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

// position the sphere
sphere.position.x = 20
sphere.position.y = 0
sphere.position.z = 2
sphere.castShadow = true

// add the sphere to the scene
scene.add(sphere)

// position and point the camera to the center of the scene
camera.position.x = -35
camera.position.y = 30
camera.position.z = 25
camera.lookAt(new THREE.Vector3(10, 0, 0))

// add subtle ambient lighting
var ambiColor = '#1c1c1c'
var ambientLight = new THREE.AmbientLight(ambiColor)
scene.add(ambientLight)

// add spotlight for a bit of light
var spotLight0 = new THREE.SpotLight(0xcccccc)
spotLight0.position.set(-40, 30, -10)
spotLight0.lookAt(plane.position)
scene.add(spotLight0)

var target = new THREE.Object3D()
target.position.set(5, 0, 0)

var pointColor = '#ffffff'
var spotLight = new THREE.SpotLight(pointColor)
spotLight.position.set(-40, 60, -10)
spotLight.castShadow = true
spotLight.shadow.camera.near = 2
spotLight.shadow.camera.far = 200
spotLight.shadow.camera.fov = 30
spotLight.target = plane
spotLight.distance = 0
spotLight.angle = 0.4

scene.add(spotLight)

// 辅助查看光源
const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightHelper)

// add a small sphere simulating the pointlight
var sphereLight = new THREE.SphereGeometry(0.2)
var sphereLightMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 })
var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial)
sphereLightMesh.castShadow = true

sphereLightMesh.position.set(3, 20, 3)
scene.add(sphereLightMesh)

// add the output of the renderer to the html element
document.getElementById('app')!.appendChild(renderer.domElement)

// call the render function
var step = 0

// used to determine the switch point for the light animation
var invert = 1
var phase = 0

var controls = {
  rotationSpeed: 0.03,
  bouncingSpeed: 0.03,
  ambientColor: ambiColor,
  pointColor: pointColor,
  intensity: 1,
  distance: 0,
  exponent: 30,
  angle: 0.1,
  debug: false,
  castShadow: true,
  onlyShadow: false,
  target: 'Plane',
  stopMovingLight: false
}

var gui = new GUI()
gui.addColor(controls, 'ambientColor').onChange(function (e) {
  ambientLight.color = new THREE.Color(e)
})

gui.addColor(controls, 'pointColor').onChange(function (e) {
  spotLight.color = new THREE.Color(e)
})

gui.add(controls, 'angle', 0, Math.PI * 2).onChange(function (e) {
  spotLight.angle = e
})

gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
  spotLight.intensity = e
})

gui.add(controls, 'distance', 0, 200).onChange(function (e) {
  spotLight.distance = e
})

gui.add(controls, 'castShadow').onChange(function (e) {
  spotLight.castShadow = e
})

gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
  console.log(e)
  switch (e) {
    case 'Plane':
      spotLight.target = plane
      break
    case 'Sphere':
      spotLight.target = sphere
      break
    case 'Cube':
      spotLight.target = cube
      break
  }
})

gui.add(controls, 'stopMovingLight').onChange(function (e) {
  stopMovingLight = e
})

render()

function render() {
  spotLightHelper.update()
  // rotate the cube around its axes
  cube.rotation.x += controls.rotationSpeed
  cube.rotation.y += controls.rotationSpeed
  cube.rotation.z += controls.rotationSpeed

  // bounce the sphere up and down
  step += controls.bouncingSpeed
  sphere.position.x = 20 + 10 * Math.cos(step)
  sphere.position.y = 2 + 10 * Math.abs(Math.sin(step))

  // move the light simulation
  if (!stopMovingLight) {
    if (phase > 2 * Math.PI) {
      invert = invert * -1
      phase -= 2 * Math.PI
    } else {
      phase += controls.rotationSpeed
    }
    sphereLightMesh.position.z = +(7 * Math.sin(phase))
    sphereLightMesh.position.x = +(14 * Math.cos(phase))
    sphereLightMesh.position.y = 10

    if (invert < 0) {
      var pivot = 14
      sphereLightMesh.position.x =
        invert * (sphereLightMesh.position.x - pivot) + pivot
    }

    spotLight.position.copy(sphereLightMesh.position)
  }

  // render using requestAnimationFrame
  requestAnimationFrame(render)

  renderer.render(scene, camera)
}
