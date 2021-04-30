import * as THREE from "/build/three.module.js";
import Stats from "/js/jsm/libs/stats.module.js";
import {OrbitControls} from "/js/jsm/controls/OrbitControls.js";
import * as dat from "/js/jsm/libs/dat.gui.module.js";

"use strict";

let renderer, scene, camera, pointLight, box, cameraControls, gui, stats;
window.anim = false;

function init(event) {
    // RENDERER ENGINE
    renderer = new THREE.WebGLRenderer({antialias: true});
    //renderer.setClearColor(new THREE.Color(0.2, 0.2, 0.35));
    renderer.setClearColor(new THREE.Color(0,0,0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // SCENE
    scene = new THREE.Scene();

    // CAMERA
    let fovy = 60.0;    // Field ov view
    let aspectRatio = window.innerWidth / window.innerHeight;
    let nearPlane = 0.1;
    let farPlane = 10000.0;
    camera = new THREE.PerspectiveCamera(fovy, aspectRatio, nearPlane, farPlane);
    camera.position.set(2, 2, 5);
    cameraControls = new OrbitControls(camera, renderer.domElement);

    // LIGHT
    // POINTLIGHT
    let pointLightColor = "white";
    let intensity = 1;
    let distance = 0;
    let decay = 1;
    pointLight = new THREE.PointLight(pointLightColor, intensity, distance, decay);
    pointLight.position.set(0, 2, 0);
    let pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1);

    // MODEL
    // BOX
    let geometry = new THREE.SphereGeometry( 1, 32, 32 );
    let meshMaterial = new THREE.MeshPhongMaterial({color: "red"}); 
    box = new THREE.Mesh(geometry, meshMaterial);
    box.position.set(0, 0.5, 0);

    // FLOOR
    let floor = new Floor();
    floor.material = new THREE.MeshPhongMaterial({color: "green"});

    // SCENE HIERARCHY
    scene.add(box);
    scene.add(floor);
    scene.add(pointLight);
    scene.add(pointLightHelper);

    // GUI
    gui = new dat.GUI();
    // SHOW/HIDE FLOOR
    gui.add(floor, "visible").name("Floor").setValue(false).listen().onChange(function(value) {

    });
    gui.add(pointLight.position, "x").min(-3).max(3).step(0.1).setValue(0).name("Point Light X").listen().onChange(function(value) {

    });

    gui.add(pointLight.position, "z").min(-3).max(3).step(0.1).setValue(0).name("Point Light Z").listen().onChange(function(value) {

    });

    scene.background = new THREE.Color("blue");

    let params = {
        emissive: meshMaterial.emissive.getHex(),
        emissiveIntensity: meshMaterial.emissiveIntensity,
        reflectivity: meshMaterial.reflectivity,
        shininess: meshMaterial.shininess
    };
    gui.addColor(params,"emissive").onChange(function(value){
        meshMaterial.emissive = new THREE.Color(value);
    });
    gui.add(params,"emissiveIntensity", 0, 1).onChange(function(value){
        meshMaterial.emissiveIntensity = value;
    });
    gui.add(params,"reflectivity", 0, 1).onChange(function(value){
        meshMaterial.reflectivity = value;
    });
    gui.add(params,"shininess", 0, 100).onChange(function(value){
        meshMaterial.shininess = value;
    });

    let checkBox = {"wireframe":false};

    gui.add(checkBox, "wireframe").name("wireframe:").onChange(function(value){
        meshMaterial.wireframe = value;
    });


    gui.open();

    // SETUP STATS
    stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    // DRAW SCENE IN A RENDER LOOP (ANIMATION)
    renderLoop();
}

function renderLoop() {
    stats.begin();
    renderer.render(scene, camera); // DRAW SCENE
    updateScene();
    stats.end();
    stats.update();
    requestAnimationFrame(renderLoop);
}

function updateScene() {
    box.rotation.x = box.rotation.x + 0.01;
    box.rotation.y = box.rotation.y + 0.01;
}

// EVENT LISTENERS & HANDLERS

document.addEventListener("DOMContentLoaded", init);

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    cameraControls.update();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// MODELS
class Floor extends THREE.Mesh {
    constructor() {
        super();
        this.geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
        this.material = new THREE.MeshBasicMaterial();
        this.rotation.x = -0.5 * Math.PI;
        this.wireframeHelper = new THREE.LineSegments(new THREE.WireframeGeometry(this.geometry));
        this.wireframeHelper.material.color = new THREE.Color(0.2, 0.2, 0.2);
        this.add(this.wireframeHelper);
        this.visible = false;
    }
}


