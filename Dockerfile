# version 0.0.1

# sudo docker run -it --privileged --device=/dev/ttyACM0 n129bz/ublox-reader /bin/bash
FROM ubuntu

RUN ["apt", "update"]
RUN ["apt", "install", "curl", "-y"]
RUN ["apt", "install", "git", "-y"]
RUN ["git", "clone", "https://github.com/n129bz/ublox-reader.git", "--branch", "docker"]
RUN ["apt", "install", "net-tools", "-y"]
RUN ["apt", "install", "nano", "-y"]
ENV NODE_VERSION=18.12.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
WORKDIR /ublox-reader
RUN ["mv", "-f", "settingsdocker.js", "settings.js"]
RUN ["npm", "install"] 

EXPOSE 5000
EXPOSE 6060

