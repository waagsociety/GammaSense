library(data.table)
library(ggplot2)
library(scales)

fileName="/Users/SB/Downloads/filtframeData2017-05-17T16-17-07.665Z.csv"

dimX <- 640
dimY <- 480

ylabel <- ""

func <- function(arg){
  assign("ylabel", "hits (log10)", envir = .GlobalEnv)
  return(log10(arg))
}

#func <- function(arg){
#  assign("ylabel", "hits", envir = .GlobalEnv)
#  return(arg)
#}

# for i in frameData*.csv; do cat $i | sed 's/\(.*\),$/\1/g' > filt${i};done


pixels <- read.csv(fileName)

coordX <- ((pixels[,"index"]-1)%/%4)%%dimX + 1
coordY <- ((pixels[,"index"]-1)%/%4)%/%dimX + 1

pixels <- data.table(frameNR=pixels[,1],index=pixels[,2],coordX,coordY,pixels[,3:5])

#colnames(pixels) <- c("frameNR",colnames(pixels)[2],"X","Y",colnames(pixels)[3:5])

redPixels <- data.table(pixels[,.N,by=R], key="R")

greenPixels <- data.table(pixels[,.N,by=G], key="G")

bluePixels <- data.table(pixels[,.N,by=B], key="B")

#RGBpixels <- merge(redPixels,greenPixels,all=TRUE,by.x="R",by.y="G")

RGBpixels <- merge(merge(redPixels,greenPixels,all=TRUE,by.x="R",by.y="G"),bluePixels,all=TRUE,by.x="R",by.y="B")

colnames(RGBpixels) <- c("value","nr.R","nr.G","nr.B")

for (j in names(RGBpixels)){
  set(RGBpixels,which( is.na(RGBpixels[[j]]) ),j,0)
}

plot <- ggplot(data = RGBpixels, aes(x=value)) + geom_line(aes(y=func(nr.R)), colour="red") + 
                                         geom_line(aes(y=func(nr.G)),colour="green") +
                                         geom_line(aes(y=func(nr.B)),colour="blue") + 
                                         xlab("Value") 

plot <- plot + ylab(ylabel)


setkeyv(pixels,cols=c("coordX","coordY"))

heatmapProp <- data.table(coordX=rep(1:dimX,dimY), coordY=rep(1:dimY,each=dimX), R=0,G=0,B=0, key=c("coordX,coordY"))
heatmapBin <- data.table(coordX=rep(1:dimX,dimY), coordY=rep(1:dimY,each=dimX), RGB=0, key=c("coordX,coordY"))

indexes <- unique(pixels[,c("coordX","coordY")])
total <- nrow(indexes)

for (i in 1:total){
  
  indexX <- as.integer(indexes[i,1])
  indexY <- as.integer(indexes[i,2])
  
  heatmapProp[coordX==indexX & coordY==indexY,c("R","G","B") := 
                as.list(pixels[coordX==indexX & coordY==indexY,c(sum(R),sum(G),sum(B))])]
  
  heatmapBin[coordX==indexX & coordY==indexY,RGB := 
                pixels[coordX==indexX & coordY==indexY,.N,] ]
  
  if (  i%%1000 == 0 ){
    print(paste("count",i/total*100))
  }
  
}

heatProp <- ggplot(data = heatmapProp, aes(x = coordX, y = coordY))

heatPropR <- heatProp + geom_raster(aes(fill = R)) + scale_fill_gradientn(colours=c("white","red"))

heatPropG <- heatProp + geom_raster(aes(fill = G)) + scale_fill_gradientn(colours=c("white","green"))

heatPropB <- heatProp + geom_raster(aes(fill = B)) + scale_fill_gradientn(colours=c("white","blue"))

heatPropRGB <- heatProp + geom_raster(aes(fill = R+G+B)) + scale_fill_gradientn(colours=c("white","black"))

heatBinRGB <- ggplot(data = heatmapBin, aes(x = coordX, y = coordY)) +
              geom_raster(aes(fill = RGB)) + scale_fill_gradientn(colours=c("white","black"))
