timeout 3 nmcli c up Ouster-OS1

OS1ID="os1-122021000143.local"

if ping $OS1ID -c 1 -W 3 | grep -q ' 0% packet loss'; then
    echo "OS1"
else
    timeout 3 nmcli c up Velodyne-VLP16
    echo "VLP16"
fi