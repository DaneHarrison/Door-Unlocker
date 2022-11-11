FROM nikolaik/python-nodejs:python3.8-nodejs15
ENV NODE_ENV = production
WORKDIR /unlocker   

COPY ["package.json", "package-lock.json*", "dependsOn.txt", "/unlocker/"]
RUN npm install --production && pip install -r dependsOn.txt

COPY . /unlocker

CMD cd src/Server && node index.js
EXPOSE 4000
