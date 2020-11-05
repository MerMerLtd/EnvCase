# EnvCase Air Map
## Deploy
```shell
# Install library
sudo apt-get update
sudo apt-get install openssl libtool autoconf automake uuid-dev build-essential gcc g++ software-properties-common unzip make git libcap2-bin -y
bash <(curl https://raw.githubusercontent.com/Luphia/SIMPLE/master/shell/install-env.sh -kL)

# Clone project
git clone https://github.com/MerMerLtd/EnvCase

# Install pm2
sudo npm i -g pm2
sudo ln -s /opt/nodejs/node-v14.13.1-linux-x64/lib/node_modules/pm2/bin/pm2 /usr/local/bin

# Install npm library
cd /etc/production/EnvCase
npm install

# switch permission
sudo chown -R ubuntu /etc/production

```

