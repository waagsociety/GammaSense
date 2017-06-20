#v data files are generated with an additional comma that might be removed with the following script
# (but we take care of this in the code):
#
# for i in frameData*.csv; do cat $i | sed 's/\(.*\),$/\1/g' > filt${i};done
#

library(data.table)
library(ggplot2)
library(scales)

###################################################################################################
# GLOBAL VARIABLES
###################################################################################################

dataDir <- "/Users/SB/Documents/Waag/OO 171 Making Sense/Uitvoering/GAMMASENSE/Pilot III/ExperimentData/RIVM15-06-17/Stefano"
dataFile <- "frameData2017-06-15T08-55-19.583Z.csv"
fileName <- paste(dataDir,dataFile,sep = "/")

dimX <- 640
dimY <- 480

ylabel <- ""

###################################################################################################
# FUNCTIONS
###################################################################################################

# This is used for the scale of values (log or not)
scaleValue <- function(arg,isLog){
  if ( isLog){
    assign("ylabel", "hits (log10)", envir = .GlobalEnv)
    return(log10(arg))  
  }else{
    assign("ylabel", "hits", envir = .GlobalEnv)
    return(arg) 
  }
}

meanFrame <- function(arg){
  
  print(paste("Mean:",mean(arg[,get(colnames(arg)[2])]),"SD:",sd(arg[,get(colnames(arg)[2])]),"quantile:"))
  print(quantile(arg[,get(colnames(arg)[2])]))
  return (ggplot(data=arg, aes(x=frameNR,y=get(colnames(arg)[2]))) + geom_line() + ylab("value"))

}

###################################################################################################
# START CODE
###################################################################################################

# Read the "frameNR,index,R,G,B" file
pixels <- data.table(read.csv(fileName))

# remove last column which is just an error of the dump
pixels <- pixels[, (colnames(pixels)[ncol(pixels)]):= NULL]

# correct name first column (contains non-ASCII char)
colnames(pixels) <- c("frameNR",colnames(pixels)[-1])

# Count occurrences per value of each type of pixel 
redPixels <- data.table(pixels[,.N,by=R], key="R")

greenPixels <- data.table(pixels[,.N,by=G], key="G")

bluePixels <- data.table(pixels[,.N,by=B], key="B")

# Merge all in one structure for plotting
RGBpixels <- merge(merge(redPixels,greenPixels,all=TRUE,by.x="R",by.y="G"),bluePixels,all=TRUE,by.x="R",by.y="B")

colnames(RGBpixels) <- c("value","nr.R","nr.G","nr.B")

# set NA to zero as it means there are no occurrences
for (j in names(RGBpixels)){
  set(RGBpixels,which( is.na(RGBpixels[[j]]) ),j,0)
}

# this creates a logartimic scale if TRUE
bLog <- TRUE
RGBpixelsPlot <- ggplot(data = RGBpixels, aes(x=value)) + geom_line(aes(y=scaleValue(nr.R,bLog)), colour="red") + 
                                         geom_line(aes(y=scaleValue(nr.G,bLog)),colour="green") +
                                         geom_line(aes(y=scaleValue(nr.B,bLog)),colour="blue") + 
                                         xlab("Value") 

RGBpixelsPlot <- RGBpixelsPlot + ylab(ylabel)

# Transform the sequential index of the pixel data structure in X,Y coordinates from (0,0) to (dimX-1,dimY-1)
# x %% y	is modulus (x mod y), e.g. 5%%2 is 1
# x %/% y	integer division, e.g. 5%/%2 is 2

coordX <- ( pixels[,"index"] %/%4 ) %% dimX 
coordY <- ( pixels[,"index"] %/%4 ) %/% dimX

# pixelsXY will have columns frameNR,index,coordX,coordY,R,G,B
pixelsXY <- data.table(pixels[,1:2],coordX=coordX[,index],coordY=coordY[,index],pixels[,3:5])

setkeyv(pixelsXY,cols=c("coordX","coordY"))

# Calculate values across frames (by grouping per indexes)

# Keep each value
heatmapProp <- pixelsXY[,as.list(c(sum(R),sum(G),sum(B))),by=c("coordX","coordY")]
colnames(heatmapProp) <- c(colnames(heatmapProp)[1:2],"R","G","B")

# Only count occurrences of any(R,G,B) > 0
heatmapBin <- pixelsXY[,.N,by=c("coordX","coordY")]
colnames(heatmapBin) <- c(colnames(heatmapBin)[1:2],"RGB")

# Only count occurrences of all(R,G,B) > 0
heatmapBinAll <- pixelsXY[R>0 & G>0 & B>0,.N,by=c("coordX","coordY")]
colnames(heatmapBinAll) <- c(colnames(heatmapBinAll)[1:2],"RGB")

# Do the plotting

# Heatmaps per colour of the real values
heatPropPlot <- ggplot(data = heatmapProp, aes(x = coordX, y = coordY))

heatPropRPlot <- heatPropPlot + geom_raster(aes(fill = R)) + scale_fill_gradientn(colours=c("white","red"))

heatPropGPlot <- heatPropPlot + geom_raster(aes(fill = G)) + scale_fill_gradientn(colours=c("white","green"))

heatPropBPlot <- heatPropPlot + geom_raster(aes(fill = B)) + scale_fill_gradientn(colours=c("white","blue"))

# Heatmaps summing colours of the real values
heatPropRGBPlot <- heatPropPlot + geom_raster(aes(fill = R+G+B)) + scale_fill_gradientn(colours=c("white","black"))

# Heatmap of any value > 0
heatBinRGBPlot <- ggplot(data = heatmapBin, aes(x = coordX, y = coordY)) +
              geom_raster(aes(fill = RGB)) + scale_fill_gradientn(colours=c("white","black"))

# Heatmap of all values > 0
heatBinAllRGBPlot <- ggplot(data = heatmapBinAll, aes(x = coordX, y = coordY)) +
  geom_raster(aes(fill = RGB)) + scale_fill_gradientn(colours=c("white","black"))


# Border calculations
for (threshold in 1:10*10){

  for (y in 1:(dimY/2) - 1){
    # maintain proportions of screen
    x <- (y/dimY*dimX)%/%1
    # Here there could be some function of the values of the pixels, now it is occurrences of all(R,G,B) > 0
    if (heatmapBinAll[coordX>=x & coordX<=dimX-x & coordY>=y & coordY<=dimY-y,sum(RGB)] < threshold){
      break;
    }
  }
  print(paste("Threshold:",threshold,"indexes x:",x,"y:",y))
}

tmp <-pixels[,sum(R)+sum(G)+sum(B),by=frameNR]
SumValuesFramePlot <- meanFrame(tmp)

tmp <-pixels[,.N,by=frameNR]
SumHitsFramePlot <- meanFrame(tmp)

threshold <- 10
tmp <- pixels[R>0 & G>0 & B>0 & (R+B+G)>threshold,.N,by=frameNR]
SumHitsNotZeroThresholdFramePlot <- meanFrame(tmp)
