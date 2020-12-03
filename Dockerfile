FROM node:14.15.1

USER node

WORKDIR /home/node/src

COPY --chown=node . .

CMD ["node", "index.js"]