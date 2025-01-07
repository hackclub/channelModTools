FROM ubuntu:22.04

ARG DATABASE_URL
# probably not needed here but needed if running prisma commands in this build phase

RUN apt-get update && apt-get install -y curl gnupg zip unzip openssl

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app

COPY package.json .
COPY prisma prisma

RUN npm install

COPY . .

EXPOSE 3000

# Change RUN to CMD to start the application when the container runs
CMD ["npm", "run", "start"]
