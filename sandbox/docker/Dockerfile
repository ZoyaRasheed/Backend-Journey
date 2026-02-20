# Base Image
FROM ubuntu

RUN apt-get update
RUN apt install -y curl

RUN curl -sL https://deb.nodesource.com/setup_25.x -o /tmp/nodesource_setup.sh
RUN bash /tmp/nodesource_setup.sh
RUN apt install -y nodejs

# Set working directory
WORKDIR /home/app

# Copy package files FIRST
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy rest of source code
COPY index.js ./index.js

# Start app
CMD ["node", "index.js"]




#if we are not using ubuntu we can set the command too like CMD ["npm","start"], whenever someone run my image server would run, they cn overwrite it too

# when we add something new in this docker file at the top or mid , above that everyhting is cashed , but below it everything will re-run , so npm i or package.json files we can write on top and chnaging files can be below so that npm i never re rurns and stay cashed ( so reduce the build time copy the static files first and they will one be re validated once changed)

# In writing the docker file you need to take of the Base Image , Order to reduce the build time and Size


#-------------Now Port Mappig : Now wheterver is runjing insdie a container like express server on PORT 8000 would not be accessible on our local machine ( docker run -it -p 8000:8000 my-app)