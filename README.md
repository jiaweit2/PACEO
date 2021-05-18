# PACEO: People Anywhere Connect Each Other
Our goal is to innovate the way of video chatting. A detailed introduction to PACEO can be found <a href=https://github.com/jiaweit2/PACEO/blob/main/PACEO_%20Innovating%20the%20Video-based%20Virtual%20Gathering%20Experience.pdf>here</a>.

## Prerequisites

1. Install node https://nodejs.org/en/
2. Install yarn https://classic.yarnpkg.com/en/docs/install/#mac-stable
3. Install docker https://docs.docker.com/get-docker/

## How to run

1. Run openvidu server using docker. This will start the server on port 4443

```
docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET openvidu/openvidu-server-kms:2.17.0
```

2. Run project server using IntelliJ. The entry file is App.java

3. Install UI dependencies. Make sure you are in the root of the project and then run the following.

```
cd ui-client && yarn
```

4. Start UI server. This will start the UI in port 3000

```
yarn start
```

5. Navigate to `http://localhost:3000/` to view the app
