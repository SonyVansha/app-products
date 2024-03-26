## APPS Product 


### Install Node.Js & Depedency

```
sudo yum update -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
. ~/.nvm/nvm.sh
sudo yum install -y npm git
sudo npm install bootstrap
sudo npm add axios
sudo npm install react-router-dom
```
Learn NVM use NodejS : [**learn_nvm**](https://www.squash.io/nvm-node-version-manager-guide-cheat-sheet/)

### Clone Repository

```
cd ~
git clone https://github.com/pradanahandi/apps-product.git
cd apps-product
```


### Install & Running React apps

```
cd product-apps
npm install 
npm run build 
npm start 
```


### Setup React Apps running on backend

#### Create systemd

```
sudo nano /lib/systemd/system/product.service
```

Add code bellow :

```
[Unit]
After=network.target
 
[Service]
Type=simple
User=root
WorkingDirectory=/home/ec2-user/product-apps
ExecStart=/usr/bin/npm start 
Restart=on-failure
 
[Install]
WantedBy=multi-user.target

```

#### Restart services

```
sudo systemctl daemon-reload
sudo systemctl start product
sudo systemctl enable product
sudo systemctl status product
```

### Install Nginx
```
sudo yum update -y
sudo yum install -y nginx
```

### Setup nginx for reverse proxy


```
sudo nano /etc/nginx/sites-available/apps-product.conf

server {
    listen 80;
    location / {
        proxy_pass http://localhost:3000;
    }
}

```

```
sudo unlink /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/ apps-product.conf /etc/nginx/sites-enabled/product-apps.conf
sudo systemctl restart nginx
sudo systemctl status nginx
```

## UserData in Instance

```sh
#!/bin/bash
echo "step1 - install package"
yum install https://rpm.nodesource.com/pub_16.x/nodistro/repo/nodesource-release-nodistro-1.noarch.rpm -y
yum install -y nodejs git httpd

echo "step2 - clone code from GitHub"
mkdir /home/ec2-user/apps-product
git clone https://github.com/pradanahandi/apps-product.git /home/ec2-user/apps-product

echo "step3 - installing package nodejs"
npm install --prefix /home/ec2-user/apps-product
npm run build --prefix /home/ec2-user/apps-product

echo "step4 - Create system applications"
touch /lib/systemd/system/product.service
printf "[Unit]\n" >> /lib/systemd/system/product.service
printf "After=network.target\n" >> /lib/systemd/system/product.service
printf "\n" >> /lib/systemd/system/product.service
printf "[Service]\n" >> /lib/systemd/system/product.service
printf "Type=simple\n" >> /lib/systemd/system/product.service
printf "User=root\n" >> /lib/systemd/system/product.service
printf "WorkingDirectory=/home/ec2-user/apps-product\n" >> /lib/systemd/system/product.service
printf "ExecStart=/usr/bin/npm start \n" >> /lib/systemd/system/product.service
printf "Restart=on-failure\n" >> /lib/systemd/system/product.service
printf "\n" >> /lib/systemd/system/product.service
printf "[Install]\n" >> /lib/systemd/system/product.service
printf "WantedBy=multi-user.target\n" >> /lib/systemd/system/product.service
systemctl daemon-reload
systemctl start product
systemctl enable product
systemctl status product

echo "step5 - Create Reverse Proxy to listen port 80"
touch /etc/httpd/conf.d/proxy.conf
printf "<Virtualhost *:80>\n" >> /etc/httpd/conf.d/proxy.conf
printf " ProxyPass / http://localhost:3000/\n" >> /etc/httpd/conf.d/proxy.conf
printf "</Virtualhost>\n" >> /etc/httpd/conf.d/proxy.conf
systemctl start httpd
systemctl enable httpd
systemctl status httpd

echo "step6 - Done"
```
