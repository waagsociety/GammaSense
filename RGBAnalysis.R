#v data files are generated with an additional comma that might be removed with the following script
# (but we take care of this in the code):
#
# for i in frameData*.csv; do cat $i | sed 's/\(.*\),$/\1/g' > filt${i};done
#

library(data.table)
library(ggplot2)
library(scales)

dataDir <- "/Users/SB/Downloads/Gamma"
dataFile <- "frameData2017-05-23T08-54-15.093Z.csv"
fileName <- paste(dataDir,dataFile,sep = "/")

dimX <- 640
dimY <- 480

ylabel <- ""

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

pixels <- data.table(read.csv(fileName))

# remove last column which is just an error of the dump
pixels <- pixels[, (colnames(pixels)[ncol(pixels)]):= NULL]

colnames(pixels) <- c("frameNR",colnames(pixels)[-1])

redPixels <- data.table(pixels[,.N,by=R], key="R")

greenPixels <- data.table(pixels[,.N,by=G], key="G")

bluePixels <- data.table(pixels[,.N,by=B], key="B")

#RGBpixels <- merge(redPixels,greenPixels,all=TRUE,by.x="R",by.y="G")

RGBpixels <- merge(merge(redPixels,greenPixels,all=TRUE,by.x="R",by.y="G"),bluePixels,all=TRUE,by.x="R",by.y="B")

colnames(RGBpixels) <- c("value","nr.R","nr.G","nr.B")

for (j in names(RGBpixels)){
  set(RGBpixels,which( is.na(RGBpixels[[j]]) ),j,0)
}

bLog <- TRUE
RGBpixelsPlot <- ggplot(data = RGBpixels, aes(x=value)) + geom_line(aes(y=scaleValue(nr.R,bLog)), colour="red") + 
                                         geom_line(aes(y=scaleValue(nr.G,bLog)),colour="green") +
                                         geom_line(aes(y=scaleValue(nr.B,bLog)),colour="blue") + 
                                         xlab("Value") 

RGBpixelsPlot <- RGBpixelsPlot + ylab(ylabel)


coordX <- ((pixels[,"index"]-1)%/%4)%%dimX + 1
coordY <- ((pixels[,"index"]-1)%/%4)%/%dimX + 1

pixelsXY <- data.table(pixels[,1:2],coordX=coordX[,index],coordY=coordY[,index],pixels[,3:5])

#colnames(pixels) <- c("frameNR",colnames(pixels)[2],"X","Y",colnames(pixels)[3:5])

setkeyv(pixelsXY,cols=c("coordX","coordY"))

heatmapProp <- data.table(coordX=rep(1:dimX,dimY), coordY=rep(1:dimY,each=dimX), R=0,G=0,B=0, key=c("coordX,coordY"))
heatmapBin <- data.table(coordX=rep(1:dimX,dimY), coordY=rep(1:dimY,each=dimX), RGB=0, key=c("coordX,coordY"))
heatmapBinAll <- data.table(coordX=rep(1:dimX,dimY), coordY=rep(1:dimY,each=dimX), RGB=0, key=c("coordX,coordY"))

indexes <- unique(pixelsXY[,c("coordX","coordY")])
total <- nrow(indexes)

for (i in 1:total){
  
  indexX <- as.integer(indexes[i,1])
  indexY <- as.integer(indexes[i,2])
  
  subpixels <- pixelsXY[coordX==indexX & coordY==indexY,]
  
  heatmapProp[coordX==indexX & coordY==indexY,c("R","G","B") := 
                as.list(subpixels[,c(sum(R),sum(G),sum(B))])]
  
  heatmapBin[coordX==indexX & coordY==indexY,RGB := 
               subpixels[,.N,] ]
  
  heatmapBinAll[coordX==indexX & coordY==indexY,RGB := 
                  subpixels[R>0 & G>0 & B>0,.N,] ]
  
  
#  if (  i%%1000 == 0 ){
#    print(paste("count",i/total*100))
#  }
  
}

heatPropPlot <- ggplot(data = heatmapProp, aes(x = coordX, y = coordY))

heatPropRPlot <- heatPropPlot + geom_raster(aes(fill = R)) + scale_fill_gradientn(colours=c("white","red"))

heatPropGPlot <- heatPropPlot + geom_raster(aes(fill = G)) + scale_fill_gradientn(colours=c("white","green"))

heatPropBPlot <- heatPropPlot + geom_raster(aes(fill = B)) + scale_fill_gradientn(colours=c("white","blue"))

heatPropRGBPlot <- heatPropPlot + geom_raster(aes(fill = R+G+B)) + scale_fill_gradientn(colours=c("white","black"))

heatBinRGBPlot <- ggplot(data = heatmapBin, aes(x = coordX, y = coordY)) +
              geom_raster(aes(fill = RGB)) + scale_fill_gradientn(colours=c("white","black"))

heatBinAllRGBPlot <- ggplot(data = heatmapBinAll, aes(x = coordX, y = coordY)) +
  geom_raster(aes(fill = RGB)) + scale_fill_gradientn(colours=c("white","black"))

#print(heatBinAllRGBPlot)

for (threshold in 1:10*10){

  for (y in 1:(dimY/2)){
    x <- (y/dimY*dimX)%/%1
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
