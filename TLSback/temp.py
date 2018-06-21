import rosbag, os, subprocess

a = subprocess.run(['rosnode','list'], stdout=subprocess.PIPE)
a = a.stdout.splitlines()

[print(aa) for aa in a]

cmd = 'rosnode kill ' + a[0].decode("utf-8")
print(cmd)
os.system(cmd)

# os.chdir(r'/home/tiago/Desktop/bag/')
# files = sorted(os.listdir())
# file = files[0] 

# bag = rosbag.Bag(file)

# for topic, msg, t in bag.read_messages():
#     # print(topic)
#     if(topic == '/velodyne_points'):
#         print(msg)

# bag.close()