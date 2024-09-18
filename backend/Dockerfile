FROM node:alpine
RUN mkdir -p /home/backend
COPY . /home/backend
WORKDIR /home/backend
RUN npm install
EXPOSE 4343
CMD ["npm", "run", "start"]