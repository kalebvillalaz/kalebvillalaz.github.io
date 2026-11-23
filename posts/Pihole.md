##What I Used
1. Raspberry Pi 4 1Gb Ram
2. Ethernet Cable
3. Micro SD

##Process
1. Download Raspberry Pi Imager:
     - Download the appropriate OS and follow the on-screen instructions
2. Connect Raspberry Pi:
    - I connected the RP to my router and powered it on.
    - This step is where I encountered my first issue, since I use Comcast, finding the IP address was a bit tricky.
      I ended up needing to use the Xfinity app (their website did not offer this feature) to get the connected devices list. Except, the RP did not register automatically,
      I had to disconnect the RP, which would then show in the unconnected devices, open the device information, reconnect the Ethernet, and once connected, it would give me the IP. 
3. SSH into the Raspberry Pi:
     - With the IP address, I was able to send commands to the RP. I updated, then installed the PiHole application.
4. Change IP to a Static Address:
    - I found the range of my DNS network to find an address I could load for the RP.
5. Log into PiHole:
    - Using a browser I logged into PiHole using the static IP from earlier.
    - From here, I can see analytics of what has been blocked and, more importantly, add more block lists.
  
##Limitations

After setting this up, I noticed no difference. Apps, like social media, load ads using the same IP as the rest of the content, 
so blocking that IP would block the entire app from loading.

On top of this, because of my internet provider, I am unable to actually set this up as a network-wide implementation. I would need to manually force each device to go through the 
IP of the RP which would take forever and for the lack of results, its not really worth it. I did try this on my main devices to see how many ads and trackers were blocked passively,
but, It would lead to internet issues outside of my own network since I have to manually put the IP for the RP and stop automatic connects so it's forced through that IP. 

Because of this, this project was shortly dismantled as there are better used for a RP than a barely working ad blocker.
