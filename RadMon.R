library(data.table)
library(ggplot2)
library(Hmisc)

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
    
    
    high_pivot <- min(my_table[!is.na(get(my_field)) & get(my_time) > low_pivot, get(my_time)])
    
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
    result[i,"corr"] <- rcorr(all_data$CPM.1,tmp2,type="pearson")$r[2,1]
    result[i,"abscorr"] <- abs(result[i,"corr"])
    result[i,"shift"] <- i
    tmp1 <- tmp2
  }
  ggplot(data=result,aes(x=shift)) + geom_line(aes(y = corr, colour = "corr")) + geom_line(aes(y = abscorr, colour = "abscorr"))
  return(which(result$corr == max(result$corr)))
}

## CONSTANTS ##
file_dir <- "/Users/SB/Documents/Waag/OO 226 GammaSense/05 Uitvoering/RIVM Veldbezoek 11 Dec 2018/Data/"

exp_START <- as.POSIXct("11/12/2018 14:35:00",format="%d/%m/%Y %H:%M:%S", tz="CET")
exp_END   <- as.POSIXct("11/12/2018 16:30:00",format="%d/%m/%Y %H:%M:%S", tz="CET")
exp_minutes <- timeSlots(exp_START,exp_END,60)
exp_minutes_ln <- length(exp_minutes)

## PROCESS RADIATION COUNTER DATA ##

# Read Radiation from phone app
RadCount <- read.csv(paste(file_dir,"radacts_12_13_2018-16_57_24SM-A510F.csv",sep=""), sep=";", skip=18, stringsAsFactors = FALSE)

# Remove last line
RadCount <- head(RadCount, -1)

# Form a complete date from 2 fields, time is in CET
RadCount[,"time"] <- as.POSIXct(paste(RadCount[,"date"],RadCount[,"time"]),format="%m/%d/%Y %H:%M:%S", tz="CET")

RadCount <-data.table(RadCount,key="time")

p <- ggplot(data=RadCount,aes(x=time)) + 
  geom_line(aes(y = cpm, colour = "cpm")) + 
  geom_line(aes(y = cpm.n.1, colour = "cpm.n.1")) + 
  geom_line(aes(y = cpm.n.2, colour = "cpm.n.2")) +
  scale_x_datetime(date_breaks = "5 min", labels = date_format("%H:%M")) + theme(axis.text.x = element_text(angle = 25, vjust = 1.0, hjust = 1.0))


# + scale_colour_manual(values=c("black", "orange"))

print(p)

putMsg("Plot of Radiation Counter data", doStop=TRUE)

## PROCESS REFERENCE DATA ##

RefLog <- read.csv(paste(file_dir,"Log Book RIVM 11-11-2018 - Sheet1.csv",sep=""), sep=",", stringsAsFactors = FALSE)

RefLog[,"CorrectedTime"] <- as.POSIXct(paste("11/12/2018",RefLog[,"CorrectedTime"]),format="%d/%m/%Y %H:%M:%S", tz="")

RefLogValues <- RefLog[!is.na(RefLog$Official.measurement),c("CorrectedTime","Official.measurement")]

colnames(RefLogValues) <- c("time","nSvh")
#RefLogValues[,"time"] <- RefLogValues[,"time"] + 12*60
RefLogValues <- data.table(RefLogValues,key="time" )

p <- ggplot(data=RefLogValues,aes(x=time)) + 
  geom_line(aes(y = nSvh, colour = "nSvh")) +
  scale_x_datetime(date_breaks = "5 min", labels = date_format("%H:%M")) + theme(axis.text.x = element_text(angle = 25, vjust = 1.0, hjust = 1.0))


print(p)

putMsg("Plot of Reference data", doStop=TRUE)

## PUT TOGETHER REFERENCE DATA AND RADIATION COUNTER DATA ##

RadCountInterp <- data.table(time=exp_minutes,cpm=as.numeric(rep(NA,exp_minutes_ln)),cpm.n.1=as.numeric(rep(NA,exp_minutes_ln)), 
                             cpm.n.2=as.numeric(rep(NA,exp_minutes_ln)),key="time")

# interpolate missing values
valuesPerMin(RadCount,RadCountInterp,"cpm","time")
linInterp(RadCountInterp,"cpm","time")
valuesPerMin(RadCount,RadCountInterp,"cpm.n.1","time")
linInterp(RadCountInterp,"cpm.n.1","time")
valuesPerMin(RadCount,RadCountInterp,"cpm.n.2","time")
linInterp(RadCountInterp,"cpm.n.2","time")

RefLogValuesInterp <- data.table(time=exp_minutes,nSvh=as.numeric(rep(NA,exp_minutes_ln)),key="time")

# interpolate missing values
valuesPerMin(RefLogValues,RefLogValuesInterp,"nSvh","time")
linInterp(RefLogValuesInterp,"nSvh","time")

RadCountRefLogInterp <- merge(RadCountInterp,RefLogValuesInterp,all=TRUE)

p <- ggplot(data=RadCountRefLogInterp,aes(x=time)) + 
  geom_line(aes(y = cpm, colour = "cpm")) + 
  geom_line(aes(y = nSvh, colour = "nSvh")) +
  scale_x_datetime(date_breaks = "5 min", labels = date_format("%H:%M")) + theme(axis.text.x = element_text(angle = 25, vjust = 1.0, hjust = 1.0))


print(p)

putMsg("Plot of Reference data and Radiation Counter data with interpolation", doStop=TRUE)

## DIVIDE IN SLOTS ACCORDING TO THE CHANGE OF SOURCES IN THE LOG FILE ##

changeTimes <- RefLog[RefLog$Status!="","CorrectedTime"]

len <- length(changeTimes)

step_data <- data.table(time=changeTimes, radcount=vector(mode="numeric",length=len), ref=vector(mode="numeric",length=len))

for (i in 1:len){
  step_data[time == changeTimes[i], "radcount"] <- RadCountRefLogInterp[!is.na(cpm) & changeTimes[i]<=time & time<changeTimes[i+1],mean(cpm), ]
  step_data[time == changeTimes[i],"ref"] <- RadCountRefLogInterp[!is.na(nSvh) & changeTimes[i]<=time & time<changeTimes[i+1],mean(nSvh), ]
  
}

p <- ggplot(data=step_data,aes(x=time)) + 
  geom_line(aes(y = radcount, colour = "radcount")) + 
  geom_line(aes(y = ref, colour = "ref")) +
  scale_x_datetime(date_breaks = "5 min", labels = date_format("%H:%M")) + theme(axis.text.x = element_text(angle = 25, vjust = 1.0, hjust = 1.0))

print(p)

putMsg("Plot of Reference data and Radiation Counter data WITH slot averaging", doStop=TRUE)


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

names(RadMon123) <- c("time", "CPM.1", "CPM.2", "CPM.3")

p <- ggplot(data=RadMon123,aes(x=time)) + 
  geom_line(aes(y = CPM.1, colour = "CPM.1")) +
  geom_line(aes(y = CPM.2, colour = "CPM.2")) +
  geom_line(aes(y = CPM.3, colour = "CPM.3")) +
  scale_x_datetime(date_breaks = "5 min", labels = date_format("%H:%M")) + theme(axis.text.x = element_text(angle = 25, vjust = 1.0, hjust = 1.0))


print(p)

putMsg("Plot of all RadMon data with NO interopolation", doStop=TRUE)

RadMon123Interp <- data.table(time=exp_minutes,CPM.1=as.numeric(rep(NA,exp_minutes_ln)),
                               CPM.2=as.numeric(rep(NA,exp_minutes_ln)),
                               CPM.3=as.numeric(rep(NA,exp_minutes_ln)),key="time")

valuesPerMin(RadMon123,RadMon123Interp,"CPM.1","time")
linInterp(RadMon123Interp,"CPM.1","time")
valuesPerMin(RadMon123,RadMon123Interp,"CPM.2","time")
linInterp(RadMon123Interp,"CPM.2","time")
valuesPerMin(RadMon123,RadMon123Interp,"CPM.3","time")
linInterp(RadMon123Interp,"CPM.3","time")

p <- ggplot(data=RadMon123Interp,aes(x=time)) + 
  geom_line(aes(y = CPM.1, colour = "CPM.1")) +
  geom_line(aes(y = CPM.2, colour = "CPM.2")) +
  geom_line(aes(y = CPM.3, colour = "CPM.3")) +
  scale_x_datetime(date_breaks = "5 min", labels = date_format("%H:%M")) + theme(axis.text.x = element_text(angle = 25, vjust = 1.0, hjust = 1.0))


print(p)

putMsg("Plot of all RadMon data with interopolation", doStop=TRUE)
#browser()

# read the notes from Lodewijk
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

p <- ggplot(data=all_RadMon,aes(x=time)) + 
  geom_line(aes(y = CPM.1, colour = "CPM.1")) +
  geom_line(aes(y = CPM.2, colour = "CPM.2")) +
  geom_line(aes(y = CPM.3, colour = "CPM.3")) +
  geom_line(aes(y = SBM20, colour = "SBM20")) +
  geom_line(aes(y = SI.29BG, colour = "SI.29BG")) + 
  geom_line(aes(y = VOLTCRAFT, colour = "VOLTCRAFT")) +
  scale_x_datetime(date_breaks = "5 min", labels = date_format("%H:%M")) + theme(axis.text.x = element_text(angle = 25, vjust = 1.0, hjust = 1.0))


print(p)

putMsg("Plot of all RadMon data and notes with interpolation", doStop=TRUE)

all_data <- merge(RadCountRefLogInterp,RadMon123Interp,all=TRUE)

p <- ggplot(data=all_data,aes(x=time)) + 
  geom_line(aes(y = cpm, colour = "cpm")) + 
  geom_line(aes(y = nSvh, colour = "nSvh")) +
  geom_line(aes(y = CPM.1, colour = "CPM.1")) +
  geom_line(aes(y = CPM.2, colour = "CPM.2")) +
  geom_line(aes(y = CPM.3, colour = "CPM.3")) +
  scale_x_datetime(date_breaks = "5 min", labels = date_format("%H:%M")) + theme(axis.text.x = element_text(angle = 25, vjust = 1.0, hjust = 1.0))


print(p)

putMsg("Plot of Reference data, Radiation Counter and Radiation Monitor data with interpolation", doStop=TRUE)


p <- rcorr(as.matrix(all_data[,c("cpm","cpm.n.1","cpm.n.2","CPM.1","CPM.2","CPM.3","nSvh")]),type="pearson")

print(p)

putMsg("Correlation between all measures", doStop=TRUE)

# calculate average over a certain time

int_min <- 4
slots <- timeSlots(min(all_RadMon[,time]),max(all_RadMon[,time]),int_min*60)

len <- length(slots)

# if the last interval is not equal to the end, add the end as last interval to be used as upper limit
if (slots[len] != exp_END){
  slots[len+1] <- exp_END
  len <- len + 1
}

# allocate table
all_Lode_exp_avrg <- data.table(time=rep(exp_START,len-1),CPM.1=rep(0,len-1),CPM.2=rep(0,len-1),CPM.3=rep(0,len-1),
                                SBM20=rep(0,len-1),SI.29BG=rep(0,len-1),VOLTCRAFT=rep(0,len-1))


# assign averages to intervals
for (i in 1:(len-1)) {
  all_Lode_exp_avrg$time[i] <- slots[i]
  all_Lode_exp_avrg$CPM.1[i] <- all_RadMon[time >= slots[i] & time < slots[i+1] & !is.na(CPM.1), mean(CPM.1),]
  all_Lode_exp_avrg$CPM.2[i] <- all_RadMon[time >= slots[i] & time < slots[i+1] & !is.na(CPM.2), mean(CPM.2),]
  all_Lode_exp_avrg$CPM.3[i] <- all_RadMon[time >= slots[i] & time < slots[i+1] & !is.na(CPM.3), mean(CPM.3),]
  all_Lode_exp_avrg$SBM20[i] <- all_RadMon[time >= slots[i] & time < slots[i+1] & !is.na(SBM20), mean(SBM20),]
  all_Lode_exp_avrg$SI.29BG[i] <- all_RadMon[time >= slots[i] & time < slots[i+1] & !is.na(SI.29BG), mean(SI.29BG),]
  all_Lode_exp_avrg$VOLTCRAFT[i] <- all_RadMon[time >= slots[i] & time < slots[i+1] & !is.na(VOLTCRAFT), mean(VOLTCRAFT),]
}

p <- ggplot(data=all_Lode_exp_avrg,aes(x=time)) + 
  geom_line(aes(y = CPM.1, colour = "CPM.1")) +
  geom_line(aes(y = CPM.2, colour = "CPM.2")) +
  geom_line(aes(y = CPM.3, colour = "CPM.3")) +
  geom_line(aes(y = SBM20, colour = "SBM20")) +
  geom_line(aes(y = SI.29BG, colour = "SI.29BG")) +
  geom_line(aes(y = VOLTCRAFT, colour = "VOLTCRAFT")) +
  scale_x_datetime(date_breaks = "5 min", labels = date_format("%H:%M")) + theme(axis.text.x = element_text(angle = 25, vjust = 1.0, hjust = 1.0))


print(p)

putMsg("Plot of all average RadMon and notes data from Lodewijk sensors", doStop=TRUE)

p <- ggplot(data=all_Lode_exp_avrg,aes(x=time)) + 
  geom_line(aes(y = CPM.1, colour = "CPM.1")) +
  geom_line(aes(y = CPM.2, colour = "CPM.2")) +
  geom_line(aes(y = CPM.3, colour = "CPM.3")) +
  scale_x_datetime(date_breaks = "5 min", labels = date_format("%H:%M")) + theme(axis.text.x = element_text(angle = 25, vjust = 1.0, hjust = 1.0))


print(p)

putMsg("Plot of all average RadMon data from Lodewijk sensors", doStop=TRUE)





