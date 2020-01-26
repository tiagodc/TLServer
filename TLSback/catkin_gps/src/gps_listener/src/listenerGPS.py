#!/usr/bin/env python

import socket
import rospy
from std_msgs.msg import String




def coordinates_publisher():

	client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # UDP
	client.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
	rospy.init_node('gps_dump')
	publisher = rospy.Publisher('/gps_dump', String, queue_size=1)
	rate = rospy.Rate(5) # 5 Hz
	client.bind(("", 8308))
	while not rospy.is_shutdown():
	    data, addr = client.recvfrom(512)
	    #print("received message: %s"%data)
	    ba = bytearray(data)
	    gprmc = ba[206:300]
	    parser = gprmc.decode("utf-8").split(",")
	    time = parser[1]
	    latitude = parser[3] + ", "+ parser[4]
	    longitude = parser[5] + ", "+ parser[6]

	    #print("--------------------------------------------------------------")
	    #print(time, latitude, longitude)
	    publisher.publish("timestamp: "+ str(time) +" latitude: " +str(latitude) + " longitude: "+ str(longitude))
    	rate.sleep()


if __name__=='__main__':
    try:
        coordinates_publisher()
    except rospy.ROSInterruptException:
        pass