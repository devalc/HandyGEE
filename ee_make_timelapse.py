# -*- coding: utf-8 -*-
"""
Created on Wed Oct 31 17:01:47 2018

@author: Chinmay Deval


This is a test script to explore making timelapse using google earth engine.

This script makes a timelapse of MCEW using landsat8 iamges
 


"""


import ee
from ee import batch

## Initialize earth engine
ee.Initialize()


## define image collection to be used 
collection = ee.ImageCollection('LANDSAT/LC8_L1T_TOA')

### In case you know the landsat path row switch these two lines on and comment out the lines
###where we pass a center coordinate

##path = collection.filter(ee.Filter.eq('WRS_PATH', 160))
##pathrow = path.filter(ee.Filter.eq('WRS_ROW', 43))

## Here we pass a coordinate
Micapoint = ee.Geometry.Point(-116, 47)
pathrow = collection.filterBounds(Micapoint)
 
##Filter cloudy scenes. This can be changed by changin the percent cloud cover. 
##Here we use 5% as a threshold

clouds = pathrow.filter(ee.Filter.lt('CLOUD_COVER', 5))

## Here we select the bands to be used from our collection defined earlier,
## Here we are going for true colour... but could be any!
bands = clouds.select(['B4', 'B3', 'B2'])

##make the data 8-bit.
def convertBit(image):
    return image.multiply(512).uint8()  

## call the conversion    
outputVideo = bands.map(convertBit)

print ("Composing the video")

#Export to video.

out = batch.Export.video.toDrive(outputVideo, description='Mica_video', dimensions = 720, framesPerSecond = 2, region=([-116.3141,47.1997], [-116.3339, 47.1476],[-116.1981, 47.1826],[-116.2241, 47.1278]), maxFrames=10000)

## process the image
process = batch.Task.start(out)

print ("process sent to the google cloud")