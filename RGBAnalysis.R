#v data files are generated with an additional comma that might be removed with the following script
# (but we take care of this in the code):
#
# for i in frameData*.csv; do cat $i | sed 's/\(.*\),$/\1/g' > filt${i};done
#

# 120 CPM on the meter (for Cs137) is about 1 uSv/hr (microSievert per hour).
# http://modernsurvivalblog.com/nuclear/radiation-geiger-counter-the-radiation-network/
# see also http://4.bp.blogspot.com/-71gJP3qW5M0/T3qhrNSyryI/AAAAAAAAHvI/7dXRfXPFrGU/s1600/Rad+CPM+table.png

library(data.table)
library(ggplot2)
library(scales)
library(stringi)
if(!exists("doDelta", mode="function")) source("delta.R")

###################################################################################################
# GLOBAL VARIABLES
###################################################################################################
dimX <- 640
dimY <- 480
#dataDir <- "/Users/SB/Documents/Waag/OO 171 Making Sense/Uitvoering/GAMMASENSE/Pilot III/ExperimentData/RIVM15-06-17/"
dataDir <- "/Users/SB/Documents/Waag/OO 226 GammaSense/05 Research/RIVM Veldbezoek 11 Dec 2018/Data/"

###################################################################################################
# FUNCTIONS
###################################################################################################

putMsg <- function(msg,isEnd=TRUE,doStop=FALSE){
  if(!is.null(msg)){
    writeLines("\n***************************************************")
    writeLines(paste(msg))
  }
  if (isEnd){
    writeLines("***************************************************\n")
  }
  if (doStop){
    readline(prompt="Press ENTER to continue")
  }
}

# This is used for the scale of values (log or not)
scaleValue <- function(arg,isLog){
  if ( isLog){
    return(log10(arg))  
  }else{
    return(arg) 
  }
}

statsFrame <- function(arg,msg){
  my_quantile <- quantile(arg[,get(colnames(arg)[2])])
  my_msg <- paste(msg,"\nMean:",mean(arg[,get(colnames(arg)[2])]),"SD:",sd(arg[,get(colnames(arg)[2])]),
               "quantile:", paste(paste(names(my_quantile),my_quantile,sep=":"),collapse ="; "))
  putMsg(my_msg)
}

# Read the "frameNR,index,R,G,B" file
readPixels <- function(fileName){
  pixels <- data.table(read.csv(fileName))
  
  # remove last column which is just an error of the dump
  pixels <- pixels[, (colnames(pixels)[ncol(pixels)]):= NULL]
  
  # correct name first column (contains non-ASCII char)
  colnames(pixels) <- c("frameNR",colnames(pixels)[-1])
  
  return(pixels)
}

createPixelsXY <- function(pixels){
  # Transform the sequential index of the pixel data structure in X,Y coordinates from (0,0) to (dimX-1,dimY-1)
  # There are 4 values per pixel, R,G,B and alpha
  # x %% y	is modulus (x mod y), e.g. 5%%2 is 1
  # x %/% y	integer division, e.g. 5%/%2 is 2
  
  coordX <- ( pixels[,"index"] %/%4 ) %% dimX 
  coordY <- ( pixels[,"index"] %/%4 ) %/% dimX
  
  # pixelsXY will have columns frameNR,coordX,coordY,R,G,B
  pixelsXY <- data.table(pixels[,1],coordX=coordX[,index],coordY=coordY[,index],pixels[,3:5])
  
  setkeyv(pixelsXY,cols=c("coordX","coordY"))
  
  return(pixelsXY)
}

countOccurrences <- function(pixels){
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
  
  # this creates a logartimic scale
  RGBLogpixelsPlot <- ggplot(data = RGBpixels, aes(x=value)) + geom_line(aes(y=scaleValue(nr.R,TRUE)), colour="red") + 
    geom_line(aes(y=scaleValue(nr.G,TRUE)),colour="green") +
    geom_line(aes(y=scaleValue(nr.B,TRUE)),colour="blue") + 
    xlab("Value") +
    ylab("Hits (log10)")
  
  
  # this creates a linear scale
  RGBLinpixelsPlot <- ggplot(data = RGBpixels, aes(x=value)) + geom_line(aes(y=scaleValue(nr.R,FALSE)), colour="red") + 
    geom_line(aes(y=scaleValue(nr.G,FALSE)),colour="green") +
    geom_line(aes(y=scaleValue(nr.B,FALSE)),colour="blue") + 
    xlab("Value") +
    ylab("Hits")
  
  print(RGBLogpixelsPlot)
  putMsg("Logaritmic scale of occurrences of values per channel",doStop=TRUE)
  
  print(RGBLinpixelsPlot)
  putMsg("Liner scale of occurrences of values per channel",doStop=TRUE)
  
  return(RGBpixels)
}

calculateHeatMaps <- function(pixelsXY){
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
  heatPropPlot <- ggplot(data = heatmapProp, aes(x = coordX, y = coordY)) + 
    coord_cartesian(xlim = c(0, dimX), ylim = c(0,dimY)) 
  
  heatPropRPlot <- heatPropPlot + geom_raster(aes(fill = R)) + scale_fill_gradientn(colours=c("white","red"))
  
  heatPropGPlot <- heatPropPlot + geom_raster(aes(fill = G)) + scale_fill_gradientn(colours=c("white","green"))
  
  heatPropBPlot <- heatPropPlot + geom_raster(aes(fill = B)) + scale_fill_gradientn(colours=c("white","blue"))
  
  # Heatmaps summing colours of the real values
  heatPropRGBPlot <- heatPropPlot + geom_raster(aes(fill = R+G+B)) + scale_fill_gradientn(colours=c("white","black"))
  
  # Heatmap of any value > 0
  heatBinRGBPlot <- ggplot(data = heatmapBin, aes(x = coordX, y = coordY)) +
    geom_raster(aes(fill = RGB)) + scale_fill_gradientn(colours=c("white","black")) +
    coord_cartesian(xlim = c(0, dimX), ylim = c(0,dimY)) 
  
  # Heatmap of all values > 0
  heatBinAllRGBPlot <- ggplot(data = heatmapBinAll, aes(x = coordX, y = coordY)) +
    geom_raster(aes(fill = RGB)) + scale_fill_gradientn(colours=c("white","black")) +
    coord_cartesian(xlim = c(0, dimX), ylim = c(0,dimY))
  
  print(heatPropRPlot)
  putMsg("Heatmap of Red channel values",doStop=TRUE)
  
  print(heatPropGPlot)
  putMsg("Heatmap of Green channel values",doStop=TRUE)
  
  print(heatPropBPlot)
  putMsg("Heatmap of Blue channel values",doStop=TRUE)
  
  print(heatPropRGBPlot)
  putMsg("Heatmap of sum of all channel values",doStop=TRUE)
  
  print(heatBinRGBPlot)
  putMsg("Heatmap of hits when at least one channel value is > 0",doStop=TRUE)
  
  print(heatBinAllRGBPlot)
  putMsg("Heatmap of hits when all channel values are > 0",doStop=TRUE)
  
}

calculateNoisyBorders <- function(pixelsXY){
  
  # Only count occurrences of all(R,G,B) > 0
  heatmapBinAll <- pixelsXY[R>0 & G>0 & B>0,.N,by=c("coordX","coordY")]
  colnames(heatmapBinAll) <- c(colnames(heatmapBinAll)[1:2],"RGB")
  
  tot_msg <- "Border calculation for different thresholds, based on hits = all(R,G,B) > 0"
  for (threshold in 1:10*10){
    
    for (y in 1:(dimY/2) - 1){
      # maintain proportions of screen
      x <- (y/dimY*dimX)%/%1
      # Here there could be some function of the values of the pixels, now it is occurrences of all(R,G,B) > 0
      if (heatmapBinAll[coordX>=x & coordX<=dimX-x & coordY>=y & coordY<=dimY-y,sum(RGB)] < threshold){
        break;
      }
    }
    tot_msg <- paste(tot_msg,"\nThreshold:",threshold,"indexes x:",x,"y:",y)
  }
  
  putMsg(tot_msg)
}

calculateFrameEnergy <- function(pixels){
  
  tmp <-pixels[,sum(R)+sum(G)+sum(B),by=frameNR]
  statsFrame(tmp,"Sum of all pixel values per frame")
  
  SumValuesFramePlot <- ggplot(data=tmp, aes(x=frameNR,y=V1)) + geom_line() + ylab("value")
  
  
  tmp <-pixels[,.N,by=frameNR]
  statsFrame(tmp,"Sum of all pixel > 0 per frame")
  
  SumHitsFramePlot <- ggplot(data=tmp, aes(x=frameNR,y=N)) + geom_line() + ylab("value")
  
  threshold <- 10
  tmp <- pixels[R>0 & G>0 & B>0 & (R+B+G)>threshold,.N,by=frameNR]
  msg <- paste("Sum of all pixel with all channels > 0 and sum(RGB) >", threshold,"per frame")
  statsFrame(tmp,msg)
  
  SumHitsNotZeroThresholdFramePlot <- ggplot(data=tmp, aes(x=frameNR,y=N)) + geom_line() + ylab("value")
  
  print(SumValuesFramePlot)
  putMsg("Plot of sum of all pixel values per frame",doStop=TRUE)
  
  print(SumHitsFramePlot)
  putMsg("Plot of sum of all pixel > 0 per frame",doStop=TRUE)
  
  print(SumHitsNotZeroThresholdFramePlot)
  putMsg(paste("Plot of sum of all pixel with all channels > 0 and sum(RGB) >", threshold,"per frame"),doStop=TRUE)
  
}
###################################################################################################
# START CODE
###################################################################################################


question <- readline(prompt="Scan all files[y/N] ? ")
if ( question == 'y' ){
  files <- list.files(path=dataDir,recursive=TRUE,pattern="^frameData.*csv$")
}else{
  #files <- c("Rene/frameData2017-06-15T08-43-46.495Z.csv","Stefano/frameData2017-06-15T08-57-11.636Z.csv","Nathan/frameData2017-06-15T09-09-26.753Z.csv")

  # files <- c("frameData2018-12-11T14_01_12.247Z.csv", "frameData2018-12-11T14_02_25.057Z.csv", "frameData2018-12-11T14_03_38.171Z.csv",
  #            "frameData2018-12-11T14_04_51.170Z.csv", "frameData2018-12-11T14_06_06.619Z.csv", "frameData2018-12-11T14_07_20.639Z.csv",
  #            "frameData2018-12-11T14_08_34.790Z.csv", "frameData2018-12-11T14_09_48.837Z.csv", "frameData2018-12-11T14_11_02.869Z.csv",
  #            "frameData2018-12-11T14_12_16.965Z.csv", "frameData2018-12-11T14_13_31.198Z.csv", "frameData2018-12-11T14_14_45.204Z.csv",
  #            "frameData2018-12-11T14_15_59.326Z.csv", "frameData2018-12-11T14_17_13.517Z.csv", "frameData2018-12-11T14_18_27.486Z.csv",
  #            "frameData2018-12-11T14_19_41.404Z.csv")
  #            
  # files <- c("frameData2018-12-11T14_20_55.415Z.csv", "frameData2018-12-11T14_22_09.630Z.csv",
  #            "frameData2018-12-11T14_23_23.900Z.csv", "frameData2018-12-11T14_24_38.036Z.csv", "frameData2018-12-11T14_25_52.064Z.csv",
  #            "frameData2018-12-11T14_27_06.095Z.csv", "frameData2018-12-11T14_28_20.050Z.csv", "frameData2018-12-11T14_29_34.093Z.csv",
  #            "frameData2018-12-11T14_30_48.177Z.csv")
  
  # files with no signal
  files <- c("frameData2018-12-11T13_46_27.424Z.csv", "frameData2018-12-11T13_47_40.872Z.csv", "frameData2018-12-11T13_48_54.367Z.csv",
             "frameData2018-12-11T13_50_07.119Z.csv", "frameData2018-12-11T13_51_19.831Z.csv", "frameData2018-12-11T13_52_33.037Z.csv")
}

question <- readline(prompt="Threshold value[50]? ")
if ( question == '' ){
  signalThreshold <- 50
}else{
  signalThreshold <- as.integer(question)
}

isInteractive <- readline(prompt="Interactive mode[y/N] ? ")
isFirstTimeSignal <- TRUE
isFirstTimeNoSignal <- TRUE

# create data structure to record max thresholds per hits
lf <- length(files)
maxThrshdOnTime <- data.table(time=rep(as.POSIXct("2000-01-01 00:00:00",format="%Y-%m-%d %H:%M:%S", tz="GMT"),lf),threshold=rep(0,lf))

totalPixelsXY <- data.table(samplenr=integer(),frameNR=integer(),coordX=integer(),coordY=integer(),R=integer(),G=integer(),B=integer())
setkeyv(totalPixelsXY,cols=c("coordX","coordY"))

# start_tube <- RadMon123Interp[!is.na(CPM.2),min(time),]
# end_tube <- RadMon123Interp[!is.na(CPM.2),max(time),]
# 
# total_cpm <- sum(RadMon123Interp$CPM.2,na.rm=TRUE)

min_cmos <- as.POSIXct("2100-01-01 16:42:18", format="%Y-%m-%d %H:%M:%S",tz="CET")
max_cmos <- as.POSIXct("2000-01-01 16:42:18", format="%Y-%m-%d %H:%M:%S",tz="CET")

for (myfileindex in 1:lf){
  dataFile <- files[myfileindex]

  filedate <- stri_match_all(dataFile,
                    regex = ".*frameData(20[0-9]{2}?-[0-9]{2}?-[0-9]{2}?)T([0-9]{2}?)[_|-]([0-9]{2}?)[_|-]([0-9]{2}?).*")
  
  
  tmp_time <- as.POSIXct(
    paste(filedate[[1]][2]," ",filedate[[1]][3],":",filedate[[1]][4],":",filedate[[1]][5], sep=""),
    format="%Y-%m-%d %H:%M:%S", tz="GMT")
  
  if (tmp_time < min_cmos){ 
    min_cmos <- tmp_time
  }
  if (tmp_time > max_cmos){ 
    max_cmos <- tmp_time
  }
  
  maxThrshdOnTime[myfileindex,"time"] <- tmp_time
  
  fileName <- paste(dataDir,dataFile,sep = "")
  
  putMsg(paste("Process file:",dataFile),doStop=isInteractive == 'y')
  
  ############################
  # Read and create pixel
  # structures
  ############################
  
  # Read the "frameNR,index,R,G,B" file
  pixels <- readPixels(fileName)
  
  isFiltered <- FALSE
  
  if (isInteractive == 'y'){
    filterZero <- readline(prompt="Filter out pixels with zero values in at least one of the channel[y/N] ? ")
  }else{
    filterZero <- 'n'
  }
  
  if (filterZero == 'y'){
    isFiltered <- TRUE
    pixels <- pixels[R>0 & B>0 & G>0,]
  }
  
  # Transform the sequential index of the pixel data structure in X,Y coordinates from (0,0) to (dimX-1,dimY-1)
  pixelsXY <- createPixelsXY(pixels)
  
  totalPixelsXY <- rbindlist(list(totalPixelsXY,cbind(samplenr=myfileindex,pixelsXY)))
                         
  # print pearson correlation of the channels
  putMsg("Pearson correlation",FALSE)
  print(cor(pixels[,3:5],use="all.obs",method="pearson" ))
  putMsg(NULL,isEnd=TRUE)
  #browser()
  thresholdMatrix <- doDelta(pixelsXY,isInteractive)
  
  setnames(thresholdMatrix,old = "hits", new = paste("hits",dataFile,sep = "."))
  
  # record max threshold to have hits
  maxThrshdOnTime[myfileindex,"threshold"] <- nrow(pixelsXY[R > 25 | B > 15 | G > 15 ,])
  
  if (nrow(thresholdMatrix) > signalThreshold){
    putMsg(paste("File:",dataFile,"seems to contain signal"),doStop=(isInteractive == 'y'))
    if (isFirstTimeSignal){
      isFirstTimeSignal <- FALSE
      signalThresholdMatrix <- thresholdMatrix
    }else{
      signalThresholdMatrix <- merge(thresholdMatrix,signalThresholdMatrix,all=TRUE)
    }
    
  }else{
    putMsg(paste("File:",dataFile,"does not seem to contain signal"),doStop=isInteractive == 'y')
    if (isFirstTimeNoSignal){
      isFirstTimeNoSignal <- FALSE
      noSignalThresholdMatrix <- thresholdMatrix
    }else{
      noSignalThresholdMatrix <- merge(thresholdMatrix,noSignalThresholdMatrix,all=TRUE)
    }
  }
  
  #stop("ciao")
  ############################
  # Calculate occurrences of 
  # values per channel
  ############################
  
  if (isInteractive == 'y'){
    question <- readline(prompt="Calculate occurrences of RGB values[y/N] ? ")
  }else{
    question <- 'n'
  }
  
  if ( question == 'y' ){
    RGBpixels <- countOccurrences(pixels)
  }

  ############################
  # Calculate heatpmaps of 
  # pixels > 0
  ############################
  
  
  if (isInteractive == 'y'){
    question <- readline(prompt="Calculate heatmaps of RGB values[y/N] ? ")
  }else{
    question <- 'n'
  }
  
  if ( question == 'y' ){
    calculateHeatMaps(pixelsXY)
  }
  
  ############################
  # Calculate noisy borders
  ############################
  
  if (isInteractive == 'y'){
    question <- readline(prompt="Calculate noisy borders[y/N] ? ")
  }else{
    question <- 'n'
  }
  
  if ( question == 'y' ){
    calculateNoisyBorders(pixelsXY)
  }
  
  ############################
  # Calculate values per frame
  ############################
  
  if (isInteractive == 'y'){
    question <- readline(prompt="Calculate frame energy[y/N] ? ")
  }else{
    question <- 'n'
  }
  
  if ( question == 'y' ){
    calculateFrameEnergy(pixels)
  }
}

# set keys again, they seem to disappear
setkeyv(totalPixelsXY,cols=c("coordX","coordY"))

############################
# Show threshold vs hits
############################

if (exists("signalThresholdMatrix")){
  
  for (j in seq_len(ncol(signalThresholdMatrix))){
    set(signalThresholdMatrix,which(is.na(signalThresholdMatrix[[j]])),j,0)
  }
  
  stretchedTable <- melt(signalThresholdMatrix,id.vars="threshold",variable.name="filename",value.name="hits",
                         variable.factor=FALSE)
  print(ggplot(data=stretchedTable,aes(x=threshold,y=hits)) + 
          geom_line(aes(colour=filename)) + 
          coord_cartesian(xlim = c(signalThreshold-15, max(stretchedTable$threshold) + 10), ylim = c(0,100)) +
          geom_vline(xintercept=signalThreshold, linetype="dashed", color = "red")
        )
  
  putMsg("Plot of hits versus signal in case of signal", doStop=TRUE)
}

if (exists("noSignalThresholdMatrix")){
    
  for (j in seq_len(ncol(noSignalThresholdMatrix))){
    set(noSignalThresholdMatrix,which(is.na(noSignalThresholdMatrix[[j]])),j,0)
  }
  
  stretchedTable <- melt(noSignalThresholdMatrix,id.vars="threshold",variable.name="filename",value.name="hits",
                         variable.factor=FALSE)
  print(ggplot(data=stretchedTable,aes(x=threshold,y=hits)) + 
          geom_line(aes(colour=filename)) + 
          coord_cartesian(xlim = c(0, max(stretchedTable$threshold) + 10), ylim = c(0,100)) +
          geom_vline(xintercept=signalThreshold, linetype="dashed", color = "red")
        )
  
  putMsg("Plot of hits versus signal in case of NO signal", doStop=TRUE)
}

attributes(maxThrshdOnTime$time)$tzone <- "CET"
print(ggplot(data=maxThrshdOnTime,aes(x=time,y=threshold)) + geom_line() + geom_hline(yintercept=signalThreshold, linetype="dashed", color = "red"))

putMsg("Plot of max threshold on time", doStop=TRUE)