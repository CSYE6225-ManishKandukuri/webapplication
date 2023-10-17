sleep 30

sudo apt-get update
sudo apt-get install -y mariadb-server unzip curl
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
sudo systemctl start mysql
sudo systemctl enable mysql
sudo systemctl status mysql
sudo apt-get install expect

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

 
sudo mysql -u root -e "CREATE USER 'manish'@'127.0.0.1' IDENTIFIED BY ' '; GRANT CREATE, ALTER, DROP, INDEX, INSERT, SELECT, UPDATE, DELETE, CREATE TEMPORARY TABLES, LOCK TABLES ON *.* TO 'manish'@'127.0.0.1'; GRANT ALL PRIVILEGES ON *.* TO 'manish'@'127.0.0.1'; FLUSH PRIVILEGES;",

sudo mysql -u root -e "CREATE DATABASE aws_database;"

sudo mysql -u root -e "SHOW DATABASES";

unzip /home/admin/webapplication.zip -d /home/admin/webapplication

cd /home/admin/webapplication

 

