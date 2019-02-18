document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");


    var camera, scene, renderer;
    var geometry, material, mesh;
    var controls;

    var objects = [];

    var raycaster;

    var blocker = document.getElementById('blocker');
    var instructions = document.getElementById('instructions');
    var play = document.getElementById('play');





    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if (havePointerLock) {

        var element = document.body;

        var pointerlockchange = function (event) {

            if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

                controlsEnabled = true;
                controls.enabled = true;
                blocker.style.display = 'none';

            } else {

                controls.enabled = false;

                blocker.style.display = '-webkit-box';
                blocker.style.display = '-moz-box';
                blocker.style.display = 'block';

                instructions.style.display = '';


            }

        };

        var pointerlockerror = function (event) {

            instructions.style.display = '';


        };


        // Hook pointer lock state change events
        document.addEventListener('pointerlockchange', pointerlockchange, false);
        document.addEventListener('mozpointerlockchange', pointerlockchange, false);
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

        document.addEventListener('pointerlockerror', pointerlockerror, false);
        document.addEventListener('mozpointerlockerror', pointerlockerror, false);
        document.addEventListener('webkitpointerlockerror', pointerlockerror, false);





        play.addEventListener('click', function (event) {
            var audio = new Audio('sounds/sound.mp3');
            audio.loop = true;
              audio.play();

            instructions.style.display = 'none';



            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            element.requestPointerLock();

        }, false);

    } else {

        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

    }

    init();
    animate();

    var controlsEnabled = false;

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var canJump = false;

    var prevTime = performance.now();
    var velocity = new THREE.Vector3();

    function init() {

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xD0FCED, 0, 1000);

        var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
        light.position.set(0.5, 1, 0.75);
        scene.add(light);

        controls = new THREE.PointerLockControls(camera);
        scene.add(controls.getObject());

        var onKeyDown = function (event) {

            switch (event.keyCode) {

                case 38: // up
                case 87: // w
                    moveForward = true;
                    break;

                case 37: // left
                case 65: // a
                    moveLeft = true;
                    break;

                case 40: // down
                case 83: // s
                    moveBackward = true;
                    break;

                case 39: // right
                case 68: // d
                    moveRight = true;
                    break;

                case 32: // space
                    if (canJump === true) velocity.y += 350;
                    canJump = false;
                    break;

            }

        };

        var onKeyUp = function (event) {

            switch (event.keyCode) {

                case 38: // up
                case 87: // w
                    moveForward = false;
                    break;

                case 37: // left
                case 65: // a
                    moveLeft = false;
                    break;

                case 40: // down
                case 83: // s
                    moveBackward = false;
                    break;

                case 39: // right
                case 68: // d
                    moveRight = false;
                    break;

            }

        };

        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);

        raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

        // floor



        geometry = new THREE.PlaneGeometry(20000, 20000, 100, 100);
        geometry.rotateX(-Math.PI / 2);
        for (var i = 0, l = geometry.vertices.length; i < l; i++) {
            geometry.vertices[i].y = 35 * Math.sin(i / 2);
        }
        var texture = new THREE.TextureLoader().load("images/grass.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(200, 200);
        material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: texture
        });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);



        // objects

        var onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        };
        var onError = function (xhr) {};
        THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());


        for (i = -1050; i < 5000; i += 100) {
            for (j = -1050; j < 5000; j += 100) {
                var geometry = new THREE.CylinderGeometry(5, 5, 1550, 32);
                var material = new THREE.MeshBasicMaterial({
                    color: 0x3D2B03
                });
                var cylinder = new THREE.Mesh(geometry, material);
                cylinder.position.set(i, 0, j);
                scene.add(cylinder);
            }
        }



        var geometry = new THREE.BoxGeometry(5, 5, 5);
        var material = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(-500, -10, 100)
        scene.add(cube);

        //             var mtlLoadernine = new THREE.MTLLoader();
        //        mtlLoadernine.setPath('obj/');
        //        mtlLoadernine.load('BlueTang1anim2UV3NF.mtl', function (materials) {
        //            materials.preload();
        //            var objLoadernine = new THREE.OBJLoader();
        //            objLoadernine.setMaterials(materials);
        //            objLoadernine.setPath('obj/');
        //            objLoadernine.load('BlueTang.obj', function (object) {
        //                object.position.y = 20;
        //                object.position.x = -50;
        //                object.position.z = -20;     
        //                scene.add(object);
        //            }, onProgress, onError);
        //        });









        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xD0FCED);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);


        window.addEventListener('resize', onWindowResize, false);

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function animate() {

        requestAnimationFrame(animate);

        if (controlsEnabled) {
            raycaster.ray.origin.copy(controls.getObject().position);
            raycaster.ray.origin.y -= 10;

            var intersections = raycaster.intersectObjects(objects);

            var isOnObject = intersections.length > 0;

            var time = performance.now();
            var delta = (time - prevTime) / 1000;

            velocity.x -= velocity.x * 40.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;

            velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

            if (moveForward) velocity.z -= 2000.0 * delta;


            if (moveBackward) velocity.z += 1000.0 * delta;

            if (moveLeft) velocity.x -= 1000.0 * delta;
            if (moveRight) velocity.x += 1000.0 * delta;

            if (isOnObject === true) {
                velocity.y = Math.max(0, velocity.y);

                canJump = true;
            }

            controls.getObject().translateX(velocity.x * delta);
            controls.getObject().translateY(velocity.y * delta);
            controls.getObject().translateZ(velocity.z * delta);

            if (controls.getObject().position.y < 10) {

                velocity.y = 0;
                controls.getObject().position.y = 10;

                canJump = true;

            }

            prevTime = time;

        }

        renderer.render(scene, camera);

    }

});
