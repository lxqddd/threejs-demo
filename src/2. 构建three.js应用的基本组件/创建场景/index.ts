import * as THREE from 'three'
import { GUI } from 'dat.gui'
// 创建一个场景
const scene = new THREE.Scene()
// 创建一个相机
/**
 * 透视相机
 * fov： 可视角度
 * aspect：实际窗口的纵横比
 * near：近处的裁面距离
 * far： 远处的裁面距离
 * 只有离相机的距离大于near值，小于far值，且在相机的可视角度之内，才能被相机投影到。
 */
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
scene.add(camera)

// 添加雾化效果
/**
 * 方式一
 * 第一个参数，雾化颜色
 * 第二个参数near，最近距离
 * 第三个参数far，最远距离
 */
// scene.fog = new THREE.Fog(0xffffff, 0.015, 100)

/**
 * 方式二
 * 第一个参数，雾化颜色
 * 第二个参数，雾化浓度
 */
scene.fog = new THREE.FogExp2(0xffffff, 0.02)

// 创建一个渲染器
const renderer = new THREE.WebGLRenderer()

// 设置背景色
renderer.setClearColor(new THREE.Color(0xffffff), 1.0)
// 指定渲染器宽高
renderer.setSize(window.innerWidth, window.innerHeight)
// 启用阴影
renderer.shadowMap.enabled = true

const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1)
const planeMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.receiveShadow = true
plane.rotation.x = -0.5 * Math.PI
plane.position.set(0, 0, 0)
scene.add(plane)

camera.position.set(-30, 40, 30)
camera.lookAt(scene.position)

const ambientLight = new THREE.AmbientLight(0x0c0c0c)
scene.add(ambientLight)

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(-40, 60, -10)
spotLight.castShadow = true
scene.add(spotLight)

const controls = {
  rotationSpeed: 0.02,
  numberOfObjects: scene.children.length,
  removeCube() {
    const allChildren = scene.children
    const lastObject = allChildren[allChildren.length - 1]
    if (lastObject instanceof THREE.Mesh) {
      scene.remove(lastObject)
      this.numberOfObjects = scene.children.length
    }
  },
  addCube() {
    const cubeSize = Math.ceil((Math.random() * 3))
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff
    })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.castShadow = true
    cube.name = 'cube' + scene.children.length

    cube.position.set(-30 + Math.round((Math.random() * planeGeometry.parameters.width)), Math.round((Math.random() * 5)), -20 + Math.round((Math.random() * planeGeometry.parameters.height)))
    scene.add(cube)
    this.numberOfObjects = scene.children.length
  },
  outputObjects() {
    console.log(scene.children)
  }
}


// 选中要渲染场景的容器
const container = document.getElementById('app')!
// 将渲染的内容插入到页面中
container.appendChild(renderer.domElement)

const gui = new GUI()
gui.add(controls, 'rotationSpeed', 0, 0.5)
gui.add(controls, 'addCube')
gui.add(controls, 'removeCube')
gui.add(controls, 'outputObjects')
gui.add(controls, 'numberOfObjects').listen()

function render() {
  // scene.traverse 接收的方法将在每一个子对象上执行
  scene.traverse((e) => {
    if (e instanceof THREE.Mesh && e !== plane) {
      e.rotation.x += controls.rotationSpeed
      e.rotation.y += controls.rotationSpeed
      e.rotation.z += controls.rotationSpeed
    }
  })
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}

render()
