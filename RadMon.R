library(data.table)
library(ggplot2)
library(Hmisc)
library(scales)


## CONSTANTS ##
file_dir <- "/Users/SB/Documents/Waag/OO 226 GammaSense/05 Research/RIVM Veldbezoek 11 Dec 2018/Data/"

exp_START <- as.POSIXct("11/12/2018 14:35:00",format="%d/%m/%Y %H:%M:%S", tz="CET")
exp_END   <- as.POSIXct("11/12/2018 16:30:00",format="%d/%m/%Y %H:%M:%S", tz="CET")
# http://www.cookbook-r.com/Graphs/Colors_(ggplot2)/
cbPalette <- c("#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7","#000000","#999999")

## FUNCTIONS ##

# Print message
putMsg <- function(msg,isEnd=TRUE,doStop=FALSE){
  
  if(!is.null(msg)){
    #browser()
    out <- paste(msg)
    my_stars <- paste(rep("*",nchar(out)+1),collapse="")
    writeLines("\n")
    writeLines(my_stars)
    writeLines(out)
  
    if (isEnd){
      writeLines(my_stars)
#      writeLines("\n")
    }
  }
  if (doStop){
    readline(prompt="Press ENTER to continue")
  }
}

# Divide time interval in equal parts
timeSlots <- function(start,end,intSec){
  #nr_int <- ceiling(difftime(end,start,units="mins")/intSec)
  return(seq(start, end, by=intSec))
}

# creates table with values per minute
valuesPerMin <- function(mysrc_table,mydest_table,my_field,my_time){
  #browser()
  for (i in 1:(exp_minutes_ln-1)){
    mydest_table[get(my_time)==exp_minutes[i],(my_field) := mysrc_table[get(my_time)>=exp_minutes[i] & 
                                                                          get(my_time)<exp_minutes[i+1] &
                                                                          !is.na(get(my_field)),
                                                                          mean(get(my_field))] ]
  }
  #browser()
  mydest_table[get(my_time)==exp_minutes[exp_minutes_ln],(my_field) := NaN]
  
}

# Create linear interpolation of the values
linInterp <- function(my_table,my_field,my_time){
  high_pivot  <- exp_START
  
  while( !is.na(low_pivot <- min(my_table[!is.na(get(my_field)) & get(my_time) >= high_pivot,get(my_time)]))){
    
    
    suppressWarnings(high_pivot <- min(my_table[!is.na(get(my_field)) & get(my_time) > low_pivot, get(my_time)]))
    
    if(is.infinite(high_pivot)){
      #browser()
      break()
    }
    
    time_range <- as.numeric(high_pivot - low_pivot)
    
    if (time_range > 1){
      for ( i in 1:(time_range-1)){
        #browser()
        a <- my_table[get(my_time) == low_pivot,get(my_field)]
        b <- my_table[get(my_time) == high_pivot,get(my_field)]
        my_table[get(my_time) == (low_pivot + (i*60)),(my_field) := a + (b-a)*i/time_range]
      }
    }
  }
}

# function used to see whether with a time shift there is a better correlation between reference and SMB20
findOffset <- function(){
  ll <- length(all_data$nSvh)
  jumps <- ll - max(which((!is.na(all_data$nSvh))))
  
  tmp1 <- vector(mode="numeric",length=ll)
  tmp2 <- vector(mode="numeric",length=ll)
  result <- data.frame(shift=vector(mode="numeric",length=jumps),corr=vector(mode="numeric",length=jumps),
                       abscorr=vector(mode="numeric",length=jumps))
  tmp1 <- all_data$nSvh
  for (i in 1:jumps){
    tmp2[2:ll] <- tmp1[1:ll-1]
    tmp2[1] <- NaN
    result[i,"corr"] <- rcorr(all_data$radmon.1,tmp2,type="pearson")$r[2,1]
    result[i,"abscorr"] <- abs(result[i,"corr"])
    result[i,"shift"] <- i
    tmp1 <- tmp2
  }
  ggplot(data=result,aes(x=shift)) + geom_line(aes(y = corr, colour = "corr")) + geom_line(aes(y = abscorr, colour = "abscorr"))
  return(which(result$corr == max(result$corr)))
}

# Add graphical items to plot
addPlotItems <- function(g,xlb,ylb,tlt,xscl,isTime){
   ggg <- g + xlab(xlb) + ylab(ylb) +
            scale_colour_manual(values=cbPalette) +
            ggtitle(tlt) +  theme(plot.title = element_text(size = 11, face = "bold", hjust=.5))
   
   if (isTime){
     ggg <- ggg + scale_x_datetime(date_breaks = paste(xscl,"min"), labels = date_format("%H:%M")) +
       theme(axis.text.x = element_text(angle = 25, vjust = 1.0, hjust = 1.0))
   }else{
     ggg <- ggg + scale_x_continuous(breaks = seq(from=1, to=xscl, by = 1))
   }
   return(ggg)
}

# Create the (a,b) linear coefficients for scaling
# ymin = axmin + b
# ymax = axmax + b
createScale <- function(x,y){
  x_max <- max(x,na.rm=TRUE)
  x_min <- min(x,na.rm=TRUE)
  y_max <- max(y,na.rm=TRUE)
  y_min <- min(y,na.rm=TRUE)
    
  a <- (y_max - y_min) / (x_max - x_min)
  b <- (y_min * x_max - y_max * x_min) / (x_max - x_min)
  return(c(a,b))      
}


# START !!!! #
## PROCESS REFERENCE DATA ##

exp_minutes <- timeSlots(exp_START,exp_END,60)
exp_minutes_ln <- length(exp_minutes)

RefLog <- read.csv(paste(file_dir,"Log Book RIVM 11-11-2018 - Sheet1.csv",sep=""), sep=",", stringsAsFactors = FALSE)

RefLog[,"CorrectedTime"] <- as.POSIXct(paste("11/12/2018",RefLog[,"CorrectedTime"]),format="%d/%m/%Y %H:%M:%S", tz="")

RefLogValues <- RefLog[!is.na(RefLog$Official.measurement),c("CorrectedTime","Official.measurement")]

colnames(RefLogValues) <- c("time","nSvh")
#RefLogValues[,"time"] <- RefLogValues[,"time"] + 12*60
RefLogValues <- data.table(RefLogValues,key="time" )

RefLogValues <- RefLogValues[time >= exp_START & time <= exp_END,]

# time where sources change
changeTimes <- RefLog[RefLog$Status!="","CorrectedTime"]

tlt <- "Plot of Reference data"
p <- ggplot(data=RefLogValues,aes(x=time)) + 
  geom_line(aes(y = nSvh, colour = "nSvh"),na.rm=TRUE) + geom_point(aes(y = nSvh, colour = "nSvh"),size=1,na.rm=TRUE) +
  geom_vline(xintercept=changeTimes,linetype="dashed", color = "black",size=.2)

p <- addPlotItems(p,"time","nSv/h",tlt,5,TRUE)

print(p)

putMsg(tlt, doStop=TRUE)

tlt <- "Log Plot of Reference data"
p <- ggplot(data=RefLogValues,aes(x=time)) + 
  geom_line(aes(y = log(nSvh), colour = "nSvh"),na.rm=TRUE) + geom_point(aes(y = log(nSvh), colour = "nSvh"),size=1,na.rm=TRUE) +
  geom_vline(xintercept=changeTimes,linetype="dashed", color = "black",size=.2)

p <- addPlotItems(p,"time","nSv/h",tlt,5,TRUE)

print(p)

putMsg(tlt, doStop=TRUE)



## PROCESS RADIATION COUNTER DATA ##

# Read Radiation from phone app
RadCount <- read.csv(paste(file_dir,"radacts_12_13_2018-16_57_24SM-A510F.csv",sep=""), sep=";", skip=18, stringsAsFactors = FALSE)

# Remove last line
RadCount <- head(RadCount, -1)

# Form a complete date from 2 fields, time is in CET
RadCount[,"time"] <- as.POSIXct(paste(RadCount[,"date"],RadCount[,"time"]),format="%m/%d/%Y %H:%M:%S", tz="CET")

colnames(RadCount)[colnames(RadCount) == "cpm"] <- "radcount.1"
colnames(RadCount)[colnames(RadCount) == "cpm.n.1"] <- "radcount.2"
colnames(RadCount)[colnames(RadCount) == "cpm.n.2"] <- "radcount.3"

RadCount <-data.table(RadCount,key="time")

RadCount <- RadCount[time >= exp_START & time <= exp_END,]

tlt <- "Plot of Radiation Counter data"
p <- ggplot(data=RadCount,aes(x=time)) + 
  geom_line(aes(y = radcount.1, colour = "radcount.1"),na.rm=TRUE) + geom_point(aes(y = radcount.1, colour = "radcount.1"),size=1,na.rm=TRUE) +
  geom_line(aes(y = radcount.2, colour = "radcount.2"),na.rm=TRUE) + geom_point(aes(y = radcount.2, colour = "radcount.2"),size=1,na.rm=TRUE) + 
  geom_line(aes(y = radcount.3, colour = "radcount.3"),na.rm=TRUE) + geom_point(aes(y = radcount.3, colour = "radcount.3"),size=1,na.rm=TRUE)


p <- addPlotItems(p,"time","cpm",tlt,5,TRUE)

print(p)

putMsg(tlt, doStop=TRUE)


## PUT TOGETHER REFERENCE DATA AND RADIATION COUNTER DATA ##

RadCountInterp <- data.table(time=exp_minutes,radcount.1=as.numeric(rep(NA,exp_minutes_ln)),radcount.2=as.numeric(rep(NA,exp_minutes_ln)), 
                             radcount.3=as.numeric(rep(NA,exp_minutes_ln)),key="time")

# interpolate missing values
valuesPerMin(RadCount,RadCountInterp,"radcount.1","time")
linInterp(RadCountInterp,"radcount.1","time")
valuesPerMin(RadCount,RadCountInterp,"radcount.2","time")
linInterp(RadCountInterp,"radcount.2","time")
valuesPerMin(RadCount,RadCountInterp,"radcount.3","time")
linInterp(RadCountInterp,"radcount.3","time")

RefLogValuesInterp <- data.table(time=exp_minutes,nSvh=as.numeric(rep(NA,exp_minutes_ln)),key="time")

# interpolate missing values
valuesPerMin(RefLogValues,RefLogValuesInterp,"nSvh","time")
linInterp(RefLogValuesInterp,"nSvh","time")

RadCountRefLogInterp <- merge(RadCountInterp,RefLogValuesInterp,all=TRUE)

# scale Ref count

radCountScale <- createScale(RadCountInterp$radcount.1,RefLogValuesInterp$nSvh)

tlt <- "Plot of Reference data and Scaled Radiation Counter data with interpolation"
p <- ggplot(data=RadCountRefLogInterp,aes(x=time)) + 
  geom_line(aes(y = radcount.1 * radCountScale[1] + radCountScale[2], colour = "radcount.1"),na.rm=TRUE) +
  geom_line(aes(y = nSvh, colour = "nSvh"),na.rm=TRUE) +
  geom_vline(xintercept=changeTimes,linetype="dashed", color = "black",size=.2)

p <- addPlotItems(p,"time","scaled(cpm) & nSv/h",tlt,5,TRUE)

print(p)

putMsg(tlt, doStop=TRUE)


## DIVIDE IN SLOTS ACCORDING TO THE CHANGE OF SOURCES IN THE LOG FILE ##


len <- length(changeTimes)

step_data <- data.table(time=changeTimes, radcount=vector(mode="numeric",length=len), ref=vector(mode="numeric",length=len))

for (i in 1:len){
  step_data[time == changeTimes[i], "radcount"] <- RadCountRefLogInterp[!is.na(radcount.1) & changeTimes[i]<=time & time<changeTimes[i+1],mean(radcount.1), ]
  step_data[time == changeTimes[i],"ref"] <- RadCountRefLogInterp[!is.na(nSvh) & changeTimes[i]<=time & time<changeTimes[i+1],mean(nSvh), ]
  
}

radCountAvrScale <- createScale(step_data$radcount,step_data$ref)

tlt <- "Plot of Reference data and Scaled Radiation Counter data WITH slot averaging"
p <- ggplot(data=step_data,aes(x=time)) + 
  geom_line(aes(y = radcount * radCountAvrScale[1] + radCountAvrScale[2], colour = "radcount"),na.rm=TRUE) + geom_point(aes(y = radcount * radCountAvrScale[1] + radCountAvrScale[2], colour = "radcount"),size=1,na.rm=TRUE) + 
  geom_line(aes(y = ref, colour = "ref"),na.rm=TRUE) + geom_point(aes(y = ref, colour = "ref"),size=1,na.rm=TRUE) +
  geom_vline(xintercept=changeTimes,linetype="dashed", color = "black",size=.2)

p <- addPlotItems(p,"time","average scaled(cpm) & nSv/h",tlt,5,TRUE)

print(p)

putMsg(tlt, doStop=TRUE)

## PROCESS RADMON DATA ##

RadMon1 <- read.csv(paste(file_dir,"lodewijk.csv",sep=""), skip=1, stringsAsFactors = FALSE)
RadMon1[,"Datetime"] <- as.POSIXct(RadMon1[,"Datetime"],format="%Y-%m-%d %H:%M:%S", tz="GMT")
attributes(RadMon1$Datetime)$tzone <- "CET"
RadMon1 <- data.table(RadMon1, key="Datetime")
RadMon1 <- RadMon1[Datetime >= exp_START & Datetime <= exp_END,]

RadMon2 <- read.csv(paste(file_dir,"lodewijk2.csv",sep=""), skip=1, stringsAsFactors = FALSE)
RadMon2[,"Datetime"] <- as.POSIXct(RadMon2[,"Datetime"],format="%Y-%m-%d %H:%M:%S", tz="GMT")
attributes(RadMon2$Datetime)$tzone <- "CET"
RadMon2 <- data.table(RadMon2, key="Datetime")
RadMon2 <- RadMon2[Datetime >= exp_START & Datetime <= exp_END,]

RadMon3 <- read.csv(paste(file_dir,"lodewijk3.csv",sep=""), skip=1, stringsAsFactors = FALSE)
RadMon3[,"Datetime"] <- as.POSIXct(RadMon3[,"Datetime"],format="%Y-%m-%d %H:%M:%S", tz="GMT")
attributes(RadMon3$Datetime)$tzone <- "CET"
RadMon3 <- data.table(RadMon3, key="Datetime")
RadMon3 <- RadMon3[Datetime >= exp_START & Datetime <= exp_END,]

# filter based on quantile
filter <- TRUE

if( filter == TRUE ){
  # filtering limit
  quant_level <- 95
  
  limit <- as.numeric(quantile(c(RadMon1$CPM,RadMon2$CPM,RadMon3$CPM), probs=quant_level/100))
  #browser()
  RadMon1 <- RadMon1[CPM <= limit,]
  RadMon2 <- RadMon2[CPM <= limit,]
  RadMon3 <- RadMon3[CPM <= limit,]
}

RadMon123 <- merge(RadMon1,RadMon2,all=TRUE)
RadMon123 <- merge(RadMon123,RadMon3,all=TRUE)

names(RadMon123) <- c("time", "radmon.1", "radmon.2", "radmon.3")

tlt <- "Plot of all Radiation Monitor data with NO interpolation"
p <- ggplot(data=RadMon123,aes(x=time)) + 
  geom_line(aes(y = radmon.1, colour = "radmon.1"),na.rm=TRUE) + geom_point(aes(y = radmon.1, colour = "radmon.1"),size=1,na.rm=TRUE) +
  geom_line(aes(y = radmon.2, colour = "radmon.2"),na.rm=TRUE) + geom_point(aes(y = radmon.2, colour = "radmon.2"),size=1,na.rm=TRUE) +
  geom_line(aes(y = radmon.3, colour = "radmon.3"),na.rm=TRUE) + geom_point(aes(y = radmon.3, colour = "radmon.3"),size=1,na.rm=TRUE)

p <- addPlotItems(p,"time","cpm",tlt,5,TRUE)

print(p)

putMsg(tlt, doStop=TRUE)

RadMon123Interp <- data.table(time=exp_minutes,radmon.1=as.numeric(rep(NA,exp_minutes_ln)),
                               radmon.2=as.numeric(rep(NA,exp_minutes_ln)),
                               radmon.3=as.numeric(rep(NA,exp_minutes_ln)),key="time")

valuesPerMin(RadMon123,RadMon123Interp,"radmon.1","time")
linInterp(RadMon123Interp,"radmon.1","time")
valuesPerMin(RadMon123,RadMon123Interp,"radmon.2","time")
linInterp(RadMon123Interp,"radmon.2","time")
valuesPerMin(RadMon123,RadMon123Interp,"radmon.3","time")
linInterp(RadMon123Interp,"radmon.3","time")

tlt <- "Plot of all Radiation Monitor data with interpolation"
p <- ggplot(data=RadMon123Interp,aes(x=time)) + 
  geom_line(aes(y = radmon.1, colour = "radmon.1"),na.rm=TRUE) +
  geom_line(aes(y = radmon.2, colour = "radmon.2"),na.rm=TRUE) +
  geom_line(aes(y = radmon.3, colour = "radmon.3"),na.rm=TRUE) +
  geom_vline(xintercept=changeTimes,linetype="dashed", color = "black",size=.2)


p <- addPlotItems(p,"time","interpolated cpm",tlt,5,TRUE)

print(p)

putMsg(tlt, doStop=TRUE)

tlt <- "Log Plot of all Radiation Monitor data with interpolation"
p <- ggplot(data=RadMon123Interp,aes(x=time)) + 
  geom_line(aes(y = log(radmon.1), colour = "radmon.1"),na.rm=TRUE) +
  geom_line(aes(y = log(radmon.2), colour = "radmon.2"),na.rm=TRUE) +
  geom_line(aes(y = log(radmon.3), colour = "radmon.3"),na.rm=TRUE) +
  geom_vline(xintercept=changeTimes,linetype="dashed", color = "black",size=.2)


p <- addPlotItems(p,"time","interpolated log(cpm)",tlt,5,TRUE)

print(p)

putMsg(tlt, doStop=TRUE)

#browser()

## PROCESS NOTES FROM LODEWIJK ##

RadMonLog <- read.csv(paste(file_dir,"lodewijk_notes.csv",sep=""),stringsAsFactors = FALSE)
RadMonLog[,"Datetime"] <- as.POSIXct(paste("11/12/2018",RadMonLog[,"Datetime"]),format="%d/%m/%Y %H:%M", tz="CET")
colnames(RadMonLog)[1] <- "time"
RadMonLog <- data.table(RadMonLog, key="time")

RadMonLogInterp <- data.table(time=exp_minutes,SBM20=as.numeric(rep(NA,exp_minutes_ln)),
                              SI.29BG=as.numeric(rep(NA,exp_minutes_ln)),
                              VOLTCRAFT=as.numeric(rep(NA,exp_minutes_ln)),key="time")

valuesPerMin(RadMonLog,RadMonLogInterp,"SBM20","time")
linInterp(RadMonLogInterp,"SBM20","time")
valuesPerMin(RadMonLog,RadMonLogInterp,"SI.29BG","time")
linInterp(RadMonLogInterp,"SI.29BG","time")
valuesPerMin(RadMonLog,RadMonLogInterp,"VOLTCRAFT","time")
linInterp(RadMonLogInterp,"VOLTCRAFT","time")

all_RadMon <- merge(RadMon123Interp,RadMonLogInterp,all=TRUE)

tlt <- "Plot of all Radiation Monitor data and notes with interpolation"

p <- ggplot(data=all_RadMon,aes(x=time)) + 
  geom_line(aes(y = radmon.1, colour = "radmon.1"),na.rm=TRUE) +
  geom_line(aes(y = radmon.2, colour = "radmon.2"),na.rm=TRUE) +
  geom_line(aes(y = radmon.3, colour = "radmon.3"),na.rm=TRUE) +
  geom_line(aes(y = SBM20, colour = "radmon.1"),linetype = "dashed",na.rm=TRUE) + 
  geom_line(aes(y = SI.29BG, colour = "radmon.2"),linetype = "dashed",na.rm=TRUE) + 
  geom_line(aes(y = VOLTCRAFT, colour = "radmon.3"),linetype = "dashed",na.rm=TRUE) +
  geom_vline(xintercept=changeTimes,linetype="dashed", color = "black",size=.2)

p <- addPlotItems(p,"time","interpolated cpm",tlt,5,TRUE)
print(p)

putMsg(tlt, doStop=TRUE)

## PROCESS SAFECAST DATA ##

SafeCast <- read.csv(paste(file_dir,"safecast-drive1544617249410.csv",sep=""), sep=",", stringsAsFactors = FALSE, skip=1)
SafeCast[,"Timestamp"] <- as.POSIXct(SafeCast[,"Timestamp"],format="%Y-%m-%dT%H:%M:%OSZ", tz="GMT")
attributes(SafeCast$Timestamp)$tzone <- "CET"
colnames(SafeCast)[colnames(SafeCast) == "CPM"] <- "safecast"
colnames(SafeCast)[colnames(SafeCast) == "Timestamp"] <- "time"

SafeCast <- data.table(SafeCast, key="time")
SafeCast <- SafeCast[time >= exp_START & time <= exp_END,]

# filter based on quantile
filter <- FALSE

if( filter == TRUE ){
  # filtering limit
  quant_level <- 95
  
  limit <- as.numeric(quantile(SafeCast$safecast, probs=quant_level/100))
  #browser()
  SafeCast <- SafeCast[safecast <= limit,]
}

# safeCastScale <- createScale(SafeCast$safecast,SafeCast$usv)

tlt <- "Plot of all Safecast data with NO interpolation"
p <- ggplot(data=SafeCast,aes(x=time)) + 
  geom_line(aes(y = safecast, colour = "safecast"),na.rm=TRUE) + geom_point(aes(y = safecast, colour = "safecast"),size=0.1,na.rm=TRUE) +
  geom_vline(xintercept=changeTimes,linetype="dashed", color = "black",size=.2)

p <- addPlotItems(p,"time","cpm",tlt,5,TRUE)

print(p)

putMsg(tlt, doStop=TRUE)

SafeCastInterp <- data.table(time=exp_minutes,safecast=as.numeric(rep(NA,exp_minutes_ln)),key="time")

valuesPerMin(SafeCast,SafeCastInterp,"safecast","time")
linInterp(SafeCastInterp,"safecast","time")

tlt <- "Plot of Safecast data with interpolation"
p <- ggplot(data=SafeCastInterp,aes(x=time)) + 
  geom_line(aes(y = safecast, colour = "safecast"),na.rm=TRUE) +
  geom_vline(xintercept=changeTimes,linetype="dashed", color = "black",size=.2)


p <- addPlotItems(p,"time","interpolated cpm",tlt,5,TRUE)

print(p)

putMsg(tlt, doStop=TRUE)

tlt <- "Log Plot of Safecast data with interpolation"
p <- ggplot(data=SafeCastInterp,aes(x=time)) + 
  geom_line(aes(y = log(safecast), colour = "safecast"),na.rm=TRUE) +
  geom_vline(xintercept=changeTimes,linetype="dashed", color = "black",size=.2)


p <- addPlotItems(p,"time","interpolated log(cpm)",tlt,5,TRUE)

print(p)

putMsg(tlt, doStop=TRUE)



## MERGE REF, RAD COUNTER AND RAD MON DATA ##

all_data <- merge(RadCountRefLogInterp,RadMon123Interp,all=TRUE)

all_data <- merge(all_data,SafeCastInterp,all=TRUE)

radMonScale <- createScale(RadMon123Interp$radmon.1,RefLogValuesInterp$nSvh)

safeCastScale <- createScale(SafeCastInterp$safecast,RefLogValuesInterp$nSvh)

corrFields <- c("radcount.1","radcount.2","radcount.3","radmon.1","radmon.2","radmon.3","safecast","nSvh")

tlt <- "Plot of Reference and scaled(Radiation Monitor, Radiation Counter and SafeCast) with interpolation"

p <- ggplot(data=all_data,aes(x=time)) + 
  geom_line(aes(y = radcount.1 * radCountScale[1] + radCountScale[2], colour = "radcount.1"),na.rm=TRUE) +
  geom_line(aes(y = radmon.1 * radMonScale[1] + radMonScale[2], colour = "radmon.1"),na.rm=TRUE) +
  geom_line(aes(y = safecast * safeCastScale[1] + safeCastScale[2], colour = "safecast"),na.rm=TRUE) +
  geom_line(aes(y = nSvh, colour = "nSvh"),na.rm=TRUE) +
  geom_vline(xintercept=changeTimes,linetype="dashed", color = "black",size=.2)
  
p <- addPlotItems(p,"time","scaled(cpm) & nSv/h",tlt,5,TRUE)

print(p)

putMsg(tlt, doStop=TRUE)


if(exists("maxThrshdOnTime")){
  maxThrshdOnTimeInterp <- data.table(time=exp_minutes,threshold=as.numeric(rep(NA,exp_minutes_ln)),key="time")
  valuesPerMin(maxThrshdOnTime,maxThrshdOnTimeInterp,"threshold","time")
  linInterp(maxThrshdOnTimeInterp,"threshold","time")
  
  thresholdScale <- createScale(maxThrshdOnTimeInterp$threshold,RefLogValuesInterp$nSvh)
  
  all_data <- merge(all_data,maxThrshdOnTimeInterp)
  corrFields <- c("radcount.1","radcount.2","radcount.3","radmon.1","radmon.2","radmon.3","safecast","nSvh","threshold")
  
  tlt <- "Plot of Reference and scaled(threshold) with interpolation"
  
  p <- ggplot(data=all_data,aes(x=time)) + 
    # geom_line(aes(y = radcount.1 * radCountScale[1] + radCountScale[2], colour = "radcount.1"),na.rm=TRUE) +
    geom_line(aes(y = nSvh, colour = "nSvh"),na.rm=TRUE) +
    # geom_line(aes(y = radmon.1 * radMonScale[1] + radMonScale[2], colour = "radmon.1"),na.rm=TRUE) +
    #    geom_line(aes(y = radmon.2 * radMonScale, colour = "radmon.2"),na.rm=TRUE) +
    #    geom_line(aes(y = radmon.3 * radMonScale, colour = "radmon.3"),na.rm=TRUE) +
    geom_line(aes(y = threshold * thresholdScale[1] + thresholdScale[2], colour = "threshold"),na.rm=TRUE) +
    geom_vline(xintercept=changeTimes,linetype="dashed", color = "black",size=.2)
  
  p <- addPlotItems(p,"time","nSv/h & scaled(threshold)",tlt,5,TRUE)
  
  print(p)
  
  putMsg(tlt, doStop=TRUE)
  
  
}


# correlation between all measures

p <- rcorr(as.matrix(all_data[,corrFields,with=FALSE]),type="pearson")

print(p)

putMsg("Correlation between all measures", doStop=TRUE)


if(!exists("avrg_corr_ref")){
  min_limit <- 20
  # calculate average over a certain time
  
  avrg_corr_ref <- data.table(interval=seq(1,min_limit),radcount.1=rep(NaN,min_limit),
                              radcount.2=rep(NaN,min_limit),
                              radcount.3=rep(NaN,min_limit),
                              radmon.1=rep(NaN,min_limit),
                              radmon.2=rep(NaN,min_limit),
                              radmon.3=rep(NaN,min_limit),
                              safecast=rep(NaN,min_limit),
                              nSvh=rep(NaN,min_limit)
  )
  
  if(exists("maxThrshdOnTime")){
    avrg_corr_ref <- data.table(avrg_corr_ref, threshold=rep(0,min_limit))
  }
    
  for (int_min in 1:min_limit){
    
    slots <- timeSlots(exp_START,exp_END,int_min*60)
    
    len <- length(slots)
    
    # if the last interval is not equal to the end, add the end as last interval to be used as upper limit
    if (slots[len] != exp_END){
      slots[len+1] <- exp_END
      len <- len + 1
    }
    
    
    # allocate table
    all_data_avrg <- data.table(time=rep(exp_START,len-1),
                                radcount.1=rep(0,len-1),
                                radcount.2=rep(0,len-1),
                                radcount.3=rep(0,len-1),
                                nSvh=rep(0,len-1),
                                radmon.1=rep(0,len-1),
                                radmon.2=rep(0,len-1),
                                radmon.3=rep(0,len-1),
                                safecast=rep(0,len-1),
                                SBM20=rep(0,len-1),
                                SI.29BG=rep(0,len-1),
                                VOLTCRAFT=rep(0,len-1))
    
    
    # assign averages to intervals
    for (i in 1:(len-1)) {
      all_data_avrg$time[i] <- slots[i]
      all_data_avrg$radcount.1[i] <- RadCount[time >= slots[i] & time < slots[i+1] & !is.na(radcount.1), mean(radcount.1),]
      all_data_avrg$radcount.2[i] <- RadCount[time >= slots[i] & time < slots[i+1] & !is.na(radcount.2), mean(radcount.2),]
      all_data_avrg$radcount.3[i] <- RadCount[time >= slots[i] & time < slots[i+1] & !is.na(radcount.3), mean(radcount.3),]
      all_data_avrg$nSvh[i] <- RefLogValues[time >= slots[i] & time < slots[i+1] & !is.na(nSvh), mean(nSvh),]
      
      all_data_avrg$radmon.1[i] <- all_RadMon[time >= slots[i] & time < slots[i+1] & !is.na(radmon.1), mean(radmon.1),]
      all_data_avrg$radmon.2[i] <- all_RadMon[time >= slots[i] & time < slots[i+1] & !is.na(radmon.2), mean(radmon.2),]
      all_data_avrg$radmon.3[i] <- all_RadMon[time >= slots[i] & time < slots[i+1] & !is.na(radmon.3), mean(radmon.3),]
      all_data_avrg$safecast[i] <- SafeCast[time >= slots[i] & time < slots[i+1] & !is.na(safecast), mean(safecast),]
      all_data_avrg$SBM20[i] <- all_RadMon[time >= slots[i] & time < slots[i+1] & !is.na(SBM20), mean(SBM20),]
      all_data_avrg$SI.29BG[i] <- all_RadMon[time >= slots[i] & time < slots[i+1] & !is.na(SI.29BG), mean(SI.29BG),]
      all_data_avrg$VOLTCRAFT[i] <- all_RadMon[time >= slots[i] & time < slots[i+1] & !is.na(VOLTCRAFT), mean(VOLTCRAFT),]
    }
    
    # tlt <- paste("Plot of all average Radiation Monitor and notes data, slot duration (min):", int_min)
    # 
    # p <- ggplot(data=all_data_avrg,aes(x=time)) + 
    #   geom_line(aes(y = radmon.1, colour = "radmon.1"),na.rm=TRUE) + geom_point(aes(y = radmon.1, colour = "radmon.1"),size=1,na.rm=TRUE) +
    #   geom_line(aes(y = radmon.2, colour = "radmon.2"),na.rm=TRUE) + geom_point(aes(y = radmon.2, colour = "radmon.2"),size=1,na.rm=TRUE) + 
    #   geom_line(aes(y = radmon.3, colour = "radmon.3"),na.rm=TRUE) + geom_point(aes(y = radmon.3, colour = "radmon.3"),size=1,na.rm=TRUE) +
    #   geom_line(aes(y = SBM20, colour = "radmon.1"),linetype = "dashed",na.rm=TRUE) + 
    #   geom_line(aes(y = SI.29BG, colour = "radmon.2"),linetype = "dashed",na.rm=TRUE) + 
    #   geom_line(aes(y = VOLTCRAFT, colour = "radmon.3"),linetype = "dashed",na.rm=TRUE) 
    # 
    # p <- addPlotItems(p,int_min,"time","averaged radcount.1",tlt)
    # 
    # print(p)
    # 
    # putMsg(tlt, doStop=TRUE)
    
    radCountAvrScale <- createScale(all_data_avrg$radcount.1,all_data_avrg$nSvh)
    radMonAvrScale <- createScale(all_data_avrg$radmon.1,all_data_avrg$nSvh)
    safeCastAvrScale <- createScale(all_data_avrg$safecast,all_data_avrg$nSvh)
    
    
    tlt <- paste("Plot of average Reference and scaled(Radiation Counter,Radiation Monitor), slot duration (min):", int_min)
    
    p <- ggplot(data=all_data_avrg,aes(x=time)) + 
      geom_line(aes(y = radcount.1 * radCountAvrScale[1] + radCountAvrScale[2], colour = "radcount.1"),na.rm=TRUE) + geom_point(aes(y = radcount.1 * radCountAvrScale[1] + radCountAvrScale[2], colour = "radcount.1"),size=1,na.rm=TRUE) +
      geom_line(aes(y = nSvh, colour = "nSvh"),na.rm=TRUE) + geom_point(aes(y = nSvh, colour = "nSvh"),size=1,na.rm=TRUE) +
      geom_line(aes(y = radmon.1 * radMonAvrScale[1] + radMonAvrScale[2], colour = "radmon.1"),na.rm=TRUE) + geom_point(aes(y = radmon.1 * radMonAvrScale[1] + radMonAvrScale[2], colour = "radmon.1"),size=1,na.rm=TRUE) +
    # geom_line(aes(y = radmon.2, colour = "radmon.2"),na.rm=TRUE) + geom_point(aes(y = radmon.2, colour = "radmon.2"),size=1,na.rm=TRUE) +
    # geom_line(aes(y = radmon.3, colour = "radmon.3"),na.rm=TRUE) + geom_point(aes(y = radmon.3, colour = "radmon.3"),size=1,na.rm=TRUE)
      geom_line(aes(y = safecast * safeCastAvrScale[1] + safeCastAvrScale[2], colour = "safecast"),na.rm=TRUE) + geom_point(aes(y = safecast * safeCastAvrScale[1] + safeCastAvrScale[2], colour = "safecast"),size=1,na.rm=TRUE) +
      geom_vline(xintercept=changeTimes,linetype="dashed", color = "black",size=.2)
    
    
    p <- addPlotItems(p,"time","average scaled(cpm) & nSv/h",tlt,5,TRUE)
    
#    print(p)
    
#    putMsg(tlt, doStop=TRUE)
    
    if(exists("maxThrshdOnTime")){
      # allocate table
      all_data_avrg <- data.table(all_data_avrg, threshold=rep(0,len-1))
      
      # assign averages to intervals
      for (i in 1:(len-1)) {
        all_data_avrg$threshold[i] <- maxThrshdOnTimeInterp[time >= slots[i] & time < slots[i+1] & !is.na(threshold), mean(threshold),]
      }
      
      thresholdAvrScale <- createScale(all_data_avrg$threshold,all_data_avrg$nSvh)
      
      tlt <- paste("Plot of average Reference, scaled(threshold), slot duration (min):", int_min)
      
      p <- ggplot(data=all_data_avrg,aes(x=time)) + 
        geom_line(aes(y = radcount.1 * radCountAvrScale[1] + radCountAvrScale[2], colour = "radcount.1"),na.rm=TRUE) + geom_point(aes(y = radcount.1 * radCountAvrScale[1] + radCountAvrScale[2], colour = "radcount.1"),size=1,na.rm=TRUE) +
        geom_line(aes(y = nSvh, colour = "nSvh"),na.rm=TRUE) + geom_point(aes(y = nSvh, colour = "nSvh"),size=1,na.rm=TRUE) +
        geom_line(aes(y = radmon.1 * radMonAvrScale[1] + radMonAvrScale[2], colour = "radmon.1"),na.rm=TRUE) + geom_point(aes(y = radmon.1 * radMonAvrScale[1] + radMonAvrScale[2], colour = "radmon.1"),size=1,na.rm=TRUE) +
        # geom_line(aes(y = radmon.2, colour = "radmon.2"),na.rm=TRUE) + geom_point(aes(y = radmon.2, colour = "radmon.2"),size=1,na.rm=TRUE) +
        # geom_line(aes(y = radmon.3, colour = "radmon.3"),na.rm=TRUE) + geom_point(aes(y = radmon.3, colour = "radmon.3"),size=1,na.rm=TRUE) +
        geom_line(aes(y = safecast * safeCastAvrScale[1] + safeCastAvrScale[2], colour = "safecast"),na.rm=TRUE) + geom_point(aes(y = safecast * safeCastAvrScale[1] + safeCastAvrScale[2], colour = "safecast"),size=1,na.rm=TRUE) +
        geom_line(aes(y = threshold * thresholdAvrScale[1] + thresholdAvrScale[2], colour = "threshold"),na.rm=TRUE) + geom_point(aes(y = threshold * thresholdAvrScale[1] + thresholdAvrScale[2], colour = "threshold"),size=1,na.rm=TRUE) +
        geom_vline(xintercept=changeTimes,linetype="dashed", color = "black",size=.2)
      
      p <- addPlotItems(p,"time","average scaled(cpm) & nSv/h",tlt,5,TRUE)
      
      print(p)
      
      putMsg(tlt, doStop=TRUE)
      
      
    }
    
    rc <- rcorr(as.matrix(all_data_avrg[,corrFields,with=FALSE]),type="pearson")
    
    avrg_corr_ref[int_min, colnames(avrg_corr_ref[,-1]) := as.list(rc$r["nSvh",])]
  
  }
}

tlt <- paste("Correlations Reference vs rest, at 1-", min_limit, " min intervals for average",sep="")

if(! exists("maxThrshdOnTime")){
  p <- ggplot(data=avrg_corr_ref,aes(x=interval)) +
    geom_line(aes(y = radcount.1, colour = "radcount.1"),na.rm=TRUE) + 
    # geom_line(aes(y = radcount.2, colour = "radcount.2"),na.rm=TRUE) + 
    # geom_line(aes(y = radcount.3, colour = "radcount.3"),na.rm=TRUE) + 
    geom_line(aes(y = radmon.1, colour = "radmon.1"),na.rm=TRUE) + 
    # geom_line(aes(y = radmon.2, colour = "radmon.2"),na.rm=TRUE) + 
    # geom_line(aes(y = radmon.3, colour = "radmon.3"),na.rm=TRUE) +
    geom_line(aes(y = safecast, colour = "safecast"),na.rm=TRUE) +
    geom_line(aes(y = nSvh, colour = "nSvh"),na.rm=TRUE)
}else{
  p <- ggplot(data=avrg_corr_ref,aes(x=interval)) +
    geom_line(aes(y = radcount.1, colour = "radcount.1"),na.rm=TRUE) + 
    # geom_line(aes(y = radcount.2, colour = "radcount.2"),na.rm=TRUE) + 
    # geom_line(aes(y = radcount.3, colour = "radcount.3"),na.rm=TRUE) + 
    geom_line(aes(y = radmon.1, colour = "radmon.1"),na.rm=TRUE) + 
    # geom_line(aes(y = radmon.2, colour = "radmon.2"),na.rm=TRUE) + 
    # geom_line(aes(y = radmon.3, colour = "radmon.3"),na.rm=TRUE) + 
    geom_line(aes(y = safecast, colour = "safecast"),na.rm=TRUE) +
    geom_line(aes(y = threshold, colour = "threshold"),na.rm=TRUE) + 
    geom_line(aes(y = nSvh, colour = "nSvh"),na.rm=TRUE)
  
}

p <- addPlotItems(p,"avrg interval","correlation",tlt,min_limit,FALSE)

print(p)

putMsg(tlt, doStop=TRUE)

putMsg("The (happy) end!!!!", doStop=FALSE)
