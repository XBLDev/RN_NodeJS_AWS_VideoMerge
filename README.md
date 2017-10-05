# RN_NodeJS_AWS_VideoMerge
Video Merge App with React Native as front end, NodeJS as backend hosted on Amazon EC2. 

Goal of this repository:

Primarily, this repo contains code that makes an app which can do in-app video FPS/resolution modification, 
which is something that current available RN packages cannot do, and since most of the video merge tools,
such as: https://github.com/mostwantit/react-native-video-editor, require that the merged videos need to 
be of the same FPS and resolution, this app can be valuable for people who to merge videos but the available 
videos are of different FPS.

Basic flow and structure of this app, 05/10/2017, 2:19:

1. On RN, use fetch to send POST reqeust to the NodeJS backend, sample code: https://facebook.github.io/react-native/docs/network.html
2. Create an Ubuntu Server instance on Amazon EC2. Because we want to use handbrakejs: https://github.com/75lb/handbrake-js, and handbrakejs only runs on ubuntu/windows. Previous failed attempt of trying to run handbrakejs on other types of server is also on my git.
3. Install handbrakejs on Ubuntu server by following the instructions: https://github.com/75lb/handbrake-js
4. Upon getting POST from RN front end, it calls a handbrake async function, which will convert a local video to another video based on the specifications such as FPS values, file format etc. The converted video is saved on the server. The backend code is mostly from: https://github.com/kevinchisholm/handling-POST-requests-with-express-and-node.js

TODO, 05/10/2017, 2:19:

1. Apparently the above work flow is not good enough, at least the phone should send the backend a video first, and then the backend should convert it, and send it back to the RN frontend. This presumably will involve use of uploading/downloading videos to Amazon S3.
2. Since there's no domain purchased, before sending the POST request, both the nginx setup and frontend URL has to be changed based on the current dynamic IP.
3. The nginx setup is probably not quite complete yet. Future reference: https://serverfault.com/questions/312111/how-do-i-get-nginx-to-forward-http-post-requests-via-rewrite
4. Possible security concerns