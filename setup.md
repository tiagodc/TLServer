# Instalação do setup completo - BackPack ForLiDAR

### Hardware **mínimo** recomendado
- CPU: x64, 2 núcleos, 1.5 GHz
- RAM: 4 Gb
- SSD: 100 GB
- Placa de rede *wireless*
- Portas:
  - 3 USBs
  - 1 ethernet

### Software necessário
- OS: Ubuntu 16.04 - Xenial Xerus
- ROS Kinetic Kame
  - sbg drivers
  - velodyne drivers
- Python > 3
- git
- apache

## Instalação

#### OS - Linux

Faça download de imagem do [**Ubuntu 16.04.5 Desktop**](https://launchpad.net/ubuntu/+cdmirrors?_ga=2.103240453.465645254.1548840517-1904336337.1548840517) e instale via USB *bootável*.

#### ROS

Faça a instalação do [**ROS Kinetic**](http://wiki.ros.org/kinetic/Installation/Ubuntu) via terminal.

Atualize lista de fontes:
```
sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
```

Adicione as chaves necessárias
```
sudo apt-key adv --keyserver hkp://ha.pool.sks-keyservers.net:80 --recv-key 421C365BD9FF1F717815A3895523BAEEB01FA116
```

Atualize o índice de pacotes
```
sudo apt-get update
```

Instale a versão completa do ROS
```
sudo apt-get install ros-kinetic-desktop-full
```

Inicie e atualize o `rosdep`
```
sudo rosdep init
rosdep update
```

Configure as fontes de acesso do terminal
```
echo "source /opt/ros/kinetic/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

Instale os drivers do IMU (sbg) e LiDAR (velodyne)
```
sudo apt-get install ros-kinetic-sbg-driver ros-kinetic-velodyne*
```

#### Python, git, apache

As versões 2.x e 3.x mais recentes do Python são instaladas como requisitos do ROS. Para instalação manual da versão mais recente (janeiro/2019), entre no terminal:

```
sudo apt-get install python3.5
```

Instale o *pip3*, *git* e *apache*
```
sudo apt-get install python3-pip git apache2
```

Instale as bibliotecas python necessárias ao software da mochila
```
sudo pip3 install flask flask_cors flask_socketio
```

## Configuração

#### IMU (sbg ellipse A)

[Garanta que o usuário da mochila tem acesso ao grupo `dialout`](https://github.com/ENSTABretagneRobotics/sbg_ros_driver) (substitua `username` pelo nome do usuário da sessão). As alterações surtirão efeito após reinicialização do computador
```
sudo adduser username dialout
```

Configure os parâmetros de streaming no arquivo `/opt/ros/kinetic/share/sbg_driver/config/ellipse_A_default.yaml`:
- ln014: `baudRate: 9600`
- ln226: `log_imu_data: 2`
- ln228: `log_ekf_euler: 2`
- ln230: `log_ekf_quat: 2`
- ln238: `log_mag: 2`
- ln250: `log_odo_vel: 4`

#### LiDAR (velodyne VLP16)

Encontre o nome da conexão ethernet pelo comando `ifconfig`. Procure pelo primeiro descritor que contenha `Link encap:Ethernet` e grave o código da conexão (ex.: `enp3s0`) - necessário para configuração do software do aplicativo

Configure a conexão de rede ethernet com o VLP16. Altere as configurações de IPv4 para método *manual*, *address* **192.168.1.70** e *netmask* 255.255.255.0

Teste a conexão com o VLP-16 no browser, no IP **http://192.168.1.201/**

#### Apache

Reconfigure o caminho default do *localhost* para a página onde ficará o *front-end* do aplicativo no arquivo `/etc/apache2/sites-available/000-default.conf` (ex. `/var/www/lidar`)

Reinicie o `apache`
```
sudo service apache2 restart
```

#### Periféricos exFAT

Instale os pacotes que permitem manipulação de flash drives em formato exFAT
```
sudo apt install exfat-fuse exfat-utils
```

#### Software do aplicativo

Clone o repositório do aplicativo
```
git clone https://github.com/tiagodc/TLServer.git
cd TLServer
```

Compile o pacote ROS do GPS em `TLSback/catkin_gps` usando `catkin_make`:
```
cd ./TLSback/catkin_gps
catkin_make
```

Altere os caminhos necessários no arquivo `run` (ex.: caminho de acesso ao diretório `TLSback`)

Edite o arquivo `./TLSback/main.py`, alterando o comando `cmdMaker.setPass('passwd')`, colocando a senha de acesso do usuário no lugar de `passwd`  

Copie o conteúdo do diretório `./TLSfront/dist` para o diretório do *localhost*, definido na configuração do `apache`, ex.:
```
sudo cp ./TLSfront/dist /var/www/lidar -r
```

Adicione o comando para execução automática do arquivo `./TLSback/run` a cada vez que o computador é ligado, editando o arquivo `/etc/rc.local`, ex.:
```
...
# By default this script does nothing.

sleep 3 && /home/forlidar/Desktop/TLServer/TLSback/run

exit 0
```

#### Rede wireless

Configure a conexão com o roteador portátil (ex. TripMate Nano) e atribua um IP fixo ao computador na rede local