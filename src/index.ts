import * as THREE from 'three'
// 性能监控
import Stats from 'stats.js'
// 创建控制面板
import * as dat from 'dat.gui'

const stats = initStats()
const gui = new dat.GUI()

// 定义场景，场景是一容器，用来保存、跟踪所要渲染的物体和使用的光源，如果没有scene，则three.js无法渲染任何物体。
const scene = new THREE.Scene()

// 定义摄像机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

// 定义渲染器对象
const renderer = new THREE.WebGL1Renderer()

// 设置渲染器颜色和透明度
renderer.setClearColor(0x000000, 1.0)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMapEnabled = true

// 添加坐标轴
const axes = new THREE.AxesHelper(20)
scene.add(axes)

// 创建一个平面
// 定义平面的大小
const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1)
// 定义平面的材质
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xcccccc
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// 将平面旋转至水平（弧度）
plane.rotation.x = -0.5 * Math.PI
plane.position.set(15, 0, 0)
scene.add(plane)

// 创建一个立方体
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.castShadow = true
cube.position.set(-4, 3, 0)
scene.add(cube)

// 创建一个球体
const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x7777ff,
  wireframe: true
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.castShadow = true
sphere.position.set(20, 4, 2)
scene.add(sphere)

// 添加材质和光源
const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(-40, 40, -15)
spotLight.castShadow = true
spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
spotLight.shadow.camera.far = 130
spotLight.shadow.camera.near = 40

const ambientLight = new THREE.AmbientLight(0x0c0c0c)
scene.add(ambientLight)

// 设置摄像机的位置
camera.position.set(-30, 40, 30)
// 指定场景的中心
camera.lookAt(scene.position)

// 将渲染的结果添加到div元素中
const container = document.getElementById('app')!
container.appendChild(renderer.domElement)
// renderer.render(scene, camera)

// 创建控制面板的第一种方式
const controls = {
  rotationSpeed: 0.02,
  bouncingSpeed: 0.03
}
gui.add(controls, 'rotationSpeed', 0, 0.5)
gui.add(controls, 'bouncingSpeed', 0, 0.5)

// 创建控制面板的第二种方式
// const cubeFolder = gui.addFolder('Cube')
// cubeFolder.add(cube.rotation, 'x', 0, Math.PI * 2)
// cubeFolder.add(cube.rotation, 'y', 0, Math.PI * 2)
// cubeFolder.add(cube.rotation, 'z', 0, Math.PI * 2)
// cubeFolder.open()
// const cameraFolder = gui.addFolder('Camera')
// cameraFolder.add(camera.position, 'z', 0, 10)
// cameraFolder.open()


let step = 0
renderScene()

function renderScene() {
  stats.update()
  cube.rotation.x += controls.rotationSpeed
  cube.rotation.y += controls.rotationSpeed
  cube.rotation.z += controls.rotationSpeed
  
  step += controls.bouncingSpeed
  sphere.position.x = 20 + (10 * Math.cos(step))
  sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)))

  requestAnimationFrame(renderScene)
  renderer.render(scene, camera)
}

function initStats() {
  const stats = new Stats()
  stats.showPanel(1)
  stats.dom.style.position = 'absolute'
  stats.dom.style.left = '10px'
  stats.dom.style.top = '10px'
  document.body.appendChild(stats.dom)
  return stats
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onResize, false)