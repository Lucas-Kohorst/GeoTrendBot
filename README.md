# GeoTrendBot
View trends on twitter on a map. Mention (@) geotrendbot on Twitter with a hashtag and get a link of a map with hotspot analysis of tweets that contain the hashtag. 

My project is going to be a web app in addition to a twitter bot. The idea is a user will mention the bot (@geotrendbot) with a hashtag for example:

@geotrendbot #hongkongprotest

My application will then leverage the twitter API to aggregate geo-coded tweets that use the given hashtag (in this case #hongkongprotest). Using the aggregated data a map will be generated. Hotspot/Choropleth analysis will also be plotted as a layer on the map. 

A reply with a generated link to the map will be sent back to the original mention

The stack will primarily be javascript based. Using either the ESRI API or leaflet.js to generate and run the analysis on the map. Most likely the webserver will be running on Node.js. The webserver will most likely be hosted on Heroku.

The figure below shows the overall design of the system I will try to build or at a minimum, components that I will attempt to implement within the constraints of deliverables and due dates.
