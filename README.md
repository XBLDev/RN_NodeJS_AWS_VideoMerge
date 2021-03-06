# RN_NodeJS_AWS_VideoMerge
Video Merge App with React Native as front end, NodeJS as backend hosted on Amazon EC2. 

Goal of this repository:

Primarily, this repo contains code that makes an app which can do in-app video FPS/resolution modification, 
which is something that current available RN packages cannot do, and since most of the video merge tools,
such as: https://github.com/mostwantit/react-native-video-editor, require that the merged videos need to 
be of the same FPS and resolution, this app can be valuable for people who want to merge videos but the available 
videos are of different FPS/resolution. Video merging with RN but only with videos of same FPS and resolution can be 
found at: https://github.com/XBLDev/onMyWayBecomingFullStack/tree/master/ReactNativeRelated/ReactNativeNav

Basic flow and structure of this app, 01/12/2017, 2:53pm:
1. On RN frontend, choose a video the user wants to convert with package: https://www.npmjs.com/package/react-native-image-crop-picker (DONE)
2. Once a file is chosen, first use AWS SDK for React Native(https://github.com/aws/aws-sdk-js) s3.getSignedUrl to get an URL, 
and RN fetch blob(https://www.npmjs.com/package/react-native-fetch-blob) use this URL and the file path to upload the video to 
S3. The idea comes from: https://gist.github.com/tomduncalf/17f57adf5a1343d20b3b3eee11cc7893
3. Once uploaded the video, in the callback function, use fetch to send POST reqeust to the NodeJS backend, sample code: https://facebook.github.io/react-native/docs/network.html, send the uploaded video's S3 URL as a parameter. (DONE)
4. Create an Ubuntu Server instance on Amazon EC2. Because we want to use handbrakejs: https://github.com/75lb/handbrake-js, and handbrakejs only runs on ubuntu/windows. Previous failed attempt of trying to run handbrakejs on other types of server is also on my git.(DONE)
5. Install handbrakejs on Ubuntu server by following the instructions: https://github.com/75lb/handbrake-js (DONE)
6. Upon getting POST from RN front end, the server first parses the parameter, uses it to download the video, upon download finish, calls a handbrake async function, which will convert the video to another video based on the specifications such as FPS values, file format etc. The converted video is then uploaded to S3, and upon uploading finish, send the upload URL as a message back to RN front end, which then uses the URL to download the converted video. The previous(05/10/2017) backend code is mostly from: https://github.com/kevinchisholm/handling-POST-requests-with-express-and-node.js. (ONGOING)

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

The problem with this flow is as stated above: different videos of different formats/FPS values/resolutions cannot 
be merged unless they are processed to have same properties.

Comment, 01/12/2017, 2:41 pm:

The approach of using AWS to get an URL for fetch-blob to upload video properly has one drawback: because the callback 
function is for fetch-blob not AWS s3, the returned result doesn't return the upload folder, which is essential for the backend
to download the file and convert it. For now the URL for the uploaded file is hardcoded since the URL which is the combination of 
the bucket URL and the filename is already known, not a good solution but at least it solves the problem.

The 2nd step of app flow is changed to reflect the switch between AWS and fetch-blob.

Now the backend can download the file using the URL properly and convert it using FPS/resolution settings, however the converted
video is rotated 90 degree left, which should be a minor problem to solve.

Comment, 30/11/2017, 6:47 pm:

For mobile approach, a solution for properly uploading to S3 is found here: https://gist.github.com/tomduncalf/17f57adf5a1343d20b3b3eee11cc7893, the original code works in IOS and it works in Android too.

The solution uses react-native-fetch-blob, which previously was used to generate data buffer for AWS to upload the file. It turns
out that fetch-blob can use url returned by s3.getSignedUrl and the file path returned by ImagePicker to upload the file, without
generating any sort of file stream/buffer/blob. This solution by far is the only one that can let RN upload an image or video to S3 and the uploaded files are readable after download.

If later no drawback of this approach is found, the 2nd step of flow of this app can be changed to: AWS get url with s3.getSignedUrl -> fetch-blob uses the file path and the url to upload file to S3

Comment, 16/11/2017, 8:29 pm:

Since previously on RN uploaded files can not be read, the development is shifted to WEB with ReactJS and NodeJS to do experiment with AWS file uploading, which is much faster than doing so on Android.

After following the simple file selection code: https://www.html5rocks.com/en/tutorials/file/dndfiles/, it turns out that at least it can be achieved by web using FileReader.readAsArrayBuffer() to read an image/video, and pass the result ArrayBuffer to S3 as the data buffer for uploading, and no need to specify the encoding in the upload configuration. The CORS configuration has to be configured as specified: https://stackoverflow.com/questions/28568794/amazon-s3-javascript-no-access-control-allow-origin-header-is-present-on-the

Assuming the uploading mechanisms are the same on Android/Web it's reasonable to also assume that if RN can somehow read file also into an ArrayBuffer, then files uploaded to S3 should be readable. One possible solution include: https://www.npmjs.com/package/base64-arraybuffer, or the previous file blob. The other way is to somehow send the image/video data to the backend and let NodeJS convert it to ArrayBuffer, but since some videos can be rather big it may not be a good idea.

Comment, 31/10/2017, 1:30 pm:

Previously the image buffer that is read by rn fetch blob is not readable because the beginning section it attaches to the buffer 
after getting all the data from the image is not correct: https://github.com/wkh237/react-native-fetch-blob#user-content-file-stream,
the correct beginning section example for png is: https://facebook.github.io/react-native/docs/image.html, the first example. The buffer can be passed as URI to Image element to render, However once the buffer is uploaded as a png file the file is still not readable, with
or without the beginning section.

Experiment of converting base64 to png by sending the buffer to the backend and save it as a png file: https://stackoverflow.com/questions/6926016/nodejs-saving-a-base64-encoded-image-to-disk, gives an error about not finding the state variable that contains the base64 string.

Comment, 30/10/2017, 6:47 pm:

The backend now can download the file with the URL provided by the frontend, and use callback to tell frontend the download is 
success. But for now the downloaded files still are not readable when uploaded, so the backend cannot use the downloaded files 
to convert to a specific format. The format when uploading/downloading should be automatically created instead of hardcoded(ONGOING)

Comment, 27/10/2017, 12:43 pm:

Now once the uploading of user video is finished, it sends the upload URL to the Nodejs backend and use callback to get 
any response from server. Some notes for self: for POST the data is in req.body; the parsed JSON response contains the replied
message, and it can be read in pattern of jsonmessage['jsonfield']; don't upload the compiled bundle file in assets, it contains the access/secret key.

The backend should instead of just sending back what the front end POST body contains, use the URL in the POST body to first 
download the file, convert the video to a pre-defined set of FPS/resolution values, upload the video to S3, and eventually send
the upload URL back to front end which can then download the converted file.(ONGOING)

Comment, 25/10/2017, 7:36 pm:

1. Uploading is working now: turns out the "buffer" the S3 upload parameter needed is as simple as a string, and it can be created during reading the file with react-native-fetch-blob, but the uploaded file doesn't seem to work except when the uploaded file is just a simple text file: png files and video files are uploaded but are not readable after downloaded from S3 bucket. The errors say that the file are corrupted, it maybe an issue related to the encoding type during the reading, maybe base64 is no good for image/video.(ONGOING)

Comment, 24/10/2017, 9:08 pm:

1. Currently uploading the file is not working, it's certain that RN is making connection with S3 because it can create bucket with keys,
but the filestream which is required by AWS S3 SDK to upload a file may prove difficult to create since no package since to be able to create a filestream.(DONE)
2. There are 2 popular packages that can enable user to upload to S3: the official AWS sdk for javascript: https://github.com/aws/aws-sdk-js, and another one: https://github.com/mybigday/react-native-s3. Although the official one seems to be the way to go, the latter one is worth investigating if the official one is too difficult/technicially impossible to use for some reason.(DONE)

Comment, 05/10/2017, 2:19 pm:

1. Apparently the above work flow is not good enough, at least the phone should send the backend a video first, and then the backend should convert it, and send it back to the RN frontend. This presumably will involve use of uploading/downloading videos to/from Amazon S3.(ONGOING)
2. Since there's no domain purchased, before sending the POST request, both the nginx setup and frontend URL has to be changed based on the current dynamic IP.
3. The nginx setup is probably not quite complete yet. Future reference: https://serverfault.com/questions/312111/how-do-i-get-nginx-to-forward-http-post-requests-via-rewrite
4. Possible security concerns