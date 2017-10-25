# RN_NodeJS_AWS_VideoMerge
Video Merge App with React Native as front end, NodeJS as backend hosted on Amazon EC2. 

Goal of this repository:

Primarily, this repo contains code that makes an app which can do in-app video FPS/resolution modification, 
which is something that current available RN packages cannot do, and since most of the video merge tools,
such as: https://github.com/mostwantit/react-native-video-editor, require that the merged videos need to 
be of the same FPS and resolution, this app can be valuable for people who want to merge videos but the available 
videos are of different FPS/resolution. Video merging with RN but only with videos of same FPS and resolution can be 
found at: https://github.com/XBLDev/onMyWayBecomingFullStack/tree/master/ReactNativeRelated/ReactNativeNav

Basic flow and structure of this app, 25/10/2017, 7:43pm:
1. On RN frontend, choose a video the user wants to convert with package: https://www.npmjs.com/package/react-native-image-crop-picker
2. Once a file is chosen, first generate a buffer with react-native-fetch-blob: https://www.npmjs.com/package/react-native-fetch-blob, and once the buffer is created, 
use AWS SDK for React Native to upload the file to S3 bucket: https://github.com/aws/aws-sdk-js 
3. Once uploaded the video, in the callback function, use fetch to send POST reqeust to the NodeJS backend, sample code: https://facebook.github.io/react-native/docs/network.html, send the uploaded video's S3 URL as a parameter.
4. Create an Ubuntu Server instance on Amazon EC2. Because we want to use handbrakejs: https://github.com/75lb/handbrake-js, and handbrakejs only runs on ubuntu/windows. Previous failed attempt of trying to run handbrakejs on other types of server is also on my git.
5. Install handbrakejs on Ubuntu server by following the instructions: https://github.com/75lb/handbrake-js
6. Upon getting POST from RN front end, the server first parses the parameter, uses it to download the video, upon download finish, calls a handbrake async function, which will convert the video to another video based on the specifications such as FPS values, file format etc. The converted video is then uploaded to S3, and upon uploading finish, send the upload URL as a message back to RN front end, which then uses the URL to download the converted video. The previous(05/10/2017) backend code is mostly from: https://github.com/kevinchisholm/handling-POST-requests-with-express-and-node.js.

Previous flow of video merging with RN and Meteor: Front End: https://github.com/XBLDev/onMyWayBecomingFullStack/tree/master/ReactNativeRelated/ReactNativeNav,
Back End: https://github.com/XBLDev/onMyWayBecomingFullStack/tree/master/ReactNativeRelated/BackEnd/RNMeteorDemo
1. On Amazon S3, put the videos recorded by drones in a bucket
2. On mLab, create a collection which contains the URLs of the videos on S3
3. On Meteor backend, make a callable method which upon called returns the list of the videos on S3
4. On RN frontend, subscribe to the collection
5. On RN frontend, render the subscribed collection as a list, make each video URL in the list choosable.
6. On RN frontend, choose a local video which is recorded by the phone with RN image cropper: https://github.com/ivpusic/react-native-image-crop-picker
7. On RN frontend, once a local video and a remote video are selected, click on merge button, which will cause 
the app to first download the remote video and then merge it with the local video into a new one.
The problem is as stated above: different videos of different formats/FPS values/resolutions cannot be merged unless
they are processed to have same properties.

TODO, 25/10/2017, 7:36 pm:

1. Uploading is working now: turns out the "buffer" the S3 upload parameter needed is as simple as a string, and it can be created during reading the file with react-native-fetch-blob, but the uploaded file doesn't seem to work except when the uploaded file is just a simple text file: png files and video files are uploaded but are not readable after downloaded from S3 bucket. The errors say that the file are corrupted, it maybe an issue related to the encoding type during the reading, maybe base64 is no good for image/video.

TODO, 24/10/2017, 9:08 pm:

1. Currently uploading the file is not working, it's certain that RN is making connection with S3 because it can create bucket with keys,
but the filestream which is required by AWS S3 SDK to upload a file may prove difficult to create since no package since to be able to create a filestream.(DONE)
2. There are 2 popular packages that can enable user to upload to S3: the official AWS sdk for javascript: https://github.com/aws/aws-sdk-js, and another one: https://github.com/mybigday/react-native-s3. Although the official one seems to be the way to go, the latter one is worth investigating if the official one is too difficult/technicially impossible to use for some reason.(DONE)

TODO, 05/10/2017, 2:19 pm:

1. Apparently the above work flow is not good enough, at least the phone should send the backend a video first, and then the backend should convert it, and send it back to the RN frontend. This presumably will involve use of uploading/downloading videos to Amazon S3.(ONGOING)
2. Since there's no domain purchased, before sending the POST request, both the nginx setup and frontend URL has to be changed based on the current dynamic IP.
3. The nginx setup is probably not quite complete yet. Future reference: https://serverfault.com/questions/312111/how-do-i-get-nginx-to-forward-http-post-requests-via-rewrite
4. Possible security concerns