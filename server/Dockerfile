FROM ubuntu:20.04

RUN apt update && DEBIAN_FRONTEND="noninteractive" apt install -y curl nodejs build-essential

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm install

RUN npm install -g @babel/core @babel/cli

COPY . .

RUN npm run build

EXPOSE 3680

CMD ["npm", "start"]
