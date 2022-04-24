//////  Created by: Chinmay Deval ////// 
//////  Purpose: Extract daily field average NDVI from MODIS  ////// 
///////////////////////////////////////////////////////////////////// 


//////  Load shapefile ////// 
var poly_shp = ee.FeatureCollection("users/chinmaydeval91/HB_shapefile");
// print(poly_shp)

//////  Load image collections of daily MODIS NDVI, filter time and space ////// 

var dataset = ee.ImageCollection('MODIS/MOD09GA_006_NDVI')
                  .select('NDVI')
                  .filter(ee.Filter.date('2006-01-01', '2020-12-31'))
                  .filter(ee.Filter.calendarRange(4,10,'month'))
                  .filterBounds(poly_shp);
// print(dataset)


////// function to clip the entire ImageCollection to the field boundary //////

function clipImgCollect(img) {
  return img.clip(poly_shp);
}

// map the custom function to ImageCollection 

var clippedndvi = dataset.map(clipImgCollect);

// print(clippedndvi)


////// visualization color scale def //////

var colorizedVis = {
  min: 0.0,
  max: 1.0,
  palette: [
    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
    '012E01', '011D01', '011301'
  ],
};

////// plot //////
Map.addLayer(clippedndvi, colorizedVis, 'clipped_ndvi');
Map.addLayer(poly_shp);
Map.centerObject(poly_shp,14);


////// calculate field mean NDVI for each daily image //////

var NDVI_ts = ui.Chart.image.seriesByRegion(
  clippedndvi,                // ImageCollection
  poly_shp,      // FieldBoundary
  ee.Reducer.mean() // Type of reducer to apply (e.g. mean, median, etc)
);

////// Plot timeseries of the daily field mean NDVI //////

var plotNDVI_ts = NDVI_ts                    // Data
    .setChartType('LineChart')            // Type of plot
    .setSeriesNames(['Daily NDVI'])       // series name
    .setOptions({                         // Plot customization options
      interpolateNulls: false,
      lineWidth: 1,
      pointSize: 2,
      title: 'Daily Field mean NDVI',
      hAxis: {title: 'Date'},
      vAxis: {title: 'NDVI'}
});

print(plotNDVI_ts);

