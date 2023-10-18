sleep 30

sudo apt update

sudo apt install nodejs

sudo node -v

sudo apt install npm

sudo apt install curl

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

sudo apt install nodejs

node -v

npm -v

 

#npm ci

 

echo "ManishLog"

 

sudo apt-get install mariadb-server unzip -y

 

sudo systemctl start mysql

sudo systemctl enable mysql

sudo systemctl status mysql

sudo apt-get install expect

 

echo "ManishLog1"

 

sudo pwd

 

echo "ManishLog2"

 

sudo ls -ltrh

 

expect <<EOF

set timeout -1

spawn sudo mysql_secure_installation

 

expect "Enter current password for root (enter for none):"

send "\r"

 

expect "Set root password? [Y/n]"

send "n\r"

 

expect "Remove anonymous users? [Y/n]"

send "n\r"

 

expect "Disallow root login remotely? [Y/n]"

send "n\r"

 

expect "Remove test database and access to it? [Y/n]"

send "n\r"

 

expect "Reload privilege tables now? [Y/n]"

send "Y\r"

 

expect eof

EOF

 

# sudo mysql -u root -e "create user manish identified by 'password'"

# sudo mysql -u root -e "create database aws_database"

# sudo mysql -u root -e "grant all previliges on test.* to 'mohan'@'localhost' identified by 'password'"

 

sudo mysql -u root -e "create user 'manish'@'localhost' identified by 'password'"

sudo mysql -u root -e "create database aws_database"

sudo mysql -u root -e "grant all privileges on test.* to 'manish'@'localhost' identified by 'password'"

#npm install --save

#npm fund

 

echo "Databases:"

 

sudo pwd

 

echo "Repo folders:"

 

sudo ls -ltrh

 

 

 

cd ~/ && unzip webapplication.zip

 

npm ci

npm install --save

npm fund

 

 

# sudo mv /tmp/webapplication.service /etc/systemd/system/webapplication.service

 

# sudo systemctl enable webapplication.service

 

# sudo systemctl start webapplication.service