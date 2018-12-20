
library(data.table)
library(ggplot2)

# Divide time interval in equal parts
timeSlots <- function(start,end,intSec){
  
  #nr_int <- ceiling(difftime(end,start,units="mins")/intSec)
  return(seq(start, end, by=intSec))
}

file_dir <- "/Users/SB/Downloads/CMOSTesting/"

exp_START <- as.POSIXct("11/12/2018 14:00:00",format="%d/%m/%Y %H:%M:%S", tz="CET")
exp_END   <- as.POSIXct("11/12/2018 17:00:00",format="%d/%m/%Y %H:%M:%S", tz="CET")

# Read Radiation from phone app
RadMonLog <- read.csv(paste(file_dir,"radacts_12_13_2018-16_57_24SM-A510F.csv",sep=""), sep=";", skip=18, stringsAsFactors = FALSE)

# Remove last line
RadMonLog <- head(RadMonLog, -1)
#b[,1] <- as.integer(b[,1])
RadMonLog[,"time"] <- as.POSIXct(paste(RadMonLog[,"date"],RadMonLog[,"time"]),format="%m/%d/%Y %H:%M:%S", tz="CET")
#attributes(RadMonLog$time)$tzone <- "CET"
RadMonLog <-data.table(RadMonLog,key="time")

ggplot(data=RadMonLog,aes(x=time)) + 
  geom_line(aes(y = cpm, colour = "cpm")) + 
  geom_line(aes(y = cpm.n.1, colour = "cpm.n.1")) + 
  geom_line(aes(y = cpm.n.2, colour = "cpm.n.2")) 

# + scale_colour_manual(values=c("black", "orange"))

RefLog <- read.csv(paste(file_dir,"Log Book RIVM 11-11-2018 - Sheet1.csv",sep=""), sep=",", stringsAsFactors = FALSE)


RefLog[,"CorrectedTime"] <- as.POSIXct(paste("11/12/2018",RefLog[,"CorrectedTime"]),format="%d/%m/%Y %H:%M:%S", tz="")

RefLogPlot <- RefLog[!is.na(RefLog$Official.measurement),c("CorrectedTime","Official.measurement")]

RefLogPlot <- data.table(RefLogPlot,key="CorrectedTime" )

ggplot(data=RefLogPlot,aes(x=CorrectedTime)) + 
  geom_line(aes(y = Official.measurement, colour = "Official.measurement"))

all_data <- merge(RadMonLog,RefLogPlot,by.x="time",by.y="CorrectedTime",all=TRUE)

ggplot(data=all_data,aes(x=time)) + 
  geom_line(aes(y = cpm, colour = "cpm")) + 
  geom_line(aes(y = Official.measurement, colour = "Official.measurement"))

changeTimes <- RefLog[RefLog$Status!="","CorrectedTime"]

len <- length(changeTimes)

step_data <- data.table(time=changeTimes, radmon=vector(mode="numeric",length=len), ref=vector(mode="numeric",length=len))

for (i in 1:len){
  step_data[time == changeTimes[i], "radmon"] <- all_data[!is.na(cpm) & changeTimes[i]<=time & time<changeTimes[i+1],mean(cpm), ]
  step_data[time == changeTimes[i],"ref"] <- all_data[!is.na(Official.measurement) & changeTimes[i]<=time & time<changeTimes[i+1],mean(Official.measurement), ]
  
}

plot <- ggplot(data=step_data,aes(x=time)) + 
  geom_line(aes(y = radmon, colour = "radmon")) + 
  geom_line(aes(y = ref, colour = "ref"))


Lode1Log <- read.csv(paste(file_dir,"lodewijk.csv",sep=""), skip=1, stringsAsFactors = FALSE)
Lode1Log[,"Datetime"] <- as.POSIXct(Lode1Log[,"Datetime"],format="%Y-%m-%d %H:%M:%S", tz="GMT")
attributes(Lode1Log$Datetime)$tzone <- "CET"
Lode1Log <- data.table(Lode1Log, key="Datetime")
Lode1Log_exp <- Lode1Log[Datetime > exp_START & Datetime < exp_END,]

Lode2Log <- read.csv(paste(file_dir,"lodewijk2.csv",sep=""), skip=1, stringsAsFactors = FALSE)
Lode2Log[,"Datetime"] <- as.POSIXct(Lode2Log[,"Datetime"],format="%Y-%m-%d %H:%M:%S", tz="GMT")
attributes(Lode2Log$Datetime)$tzone <- "CET"
Lode2Log <- data.table(Lode2Log, key="Datetime")
Lode2Log_exp <- Lode2Log[Datetime > exp_START & Datetime < exp_END,]

Lode3Log <- read.csv(paste(file_dir,"lodewijk3.csv",sep=""), skip=1, stringsAsFactors = FALSE)
Lode3Log[,"Datetime"] <- as.POSIXct(Lode3Log[,"Datetime"],format="%Y-%m-%d %H:%M:%S", tz="GMT")
attributes(Lode3Log$Datetime)$tzone <- "CET"
Lode3Log <- data.table(Lode3Log, key="Datetime")
Lode3Log_exp <- Lode3Log[Datetime > exp_START & Datetime < exp_END,]

filter <- TRUE

if( filter == TRUE){
  # filtering limit
  quant_level <- 98
  
  limit <- quantile(c(Lode1Log_exp$CPM,Lode2Log_exp$CPM,Lode3Log_exp$CPM), probs=quant_level/100)
  
  Lode1Log_exp <- Lode1Log_exp[CPM <= limit,]
  Lode2Log_exp <- Lode2Log_exp[CPM <= limit,]
  Lode3Log_exp <- Lode3Log_exp[CPM <= limit,]
}

all_Lode_exp <- merge(Lode1Log_exp,Lode2Log_exp,all=TRUE)
all_Lode_exp <- merge(all_Lode_exp,Lode3Log_exp,all=TRUE)

# We are already in CET time zone
#attributes(all_Lode$Datetime)$tzone <- "CET"

names(all_Lode_exp) <- c("Datetime", "CPM.1", "CPM.2", "CPM.3")

# read the notes from Lodewijk
LodeNotes <- read.csv(paste(file_dir,"lodewijk_notes.csv",sep=""),stringsAsFactors = FALSE)
LodeNotes[,"Datetime"] <- as.POSIXct(paste("11/12/2018",LodeNotes[,"Datetime"]),format="%d/%m/%Y %H:%M", tz="CET")
LodeNotes <- data.table(LodeNotes, key="Datetime")

all_Lode_exp <- merge(all_Lode_exp,LodeNotes,all=TRUE)

# calculate average over a certain time

int_min <- 4
slots <- timeSlots(min(all_Lode_exp[,Datetime]),max(all_Lode_exp[,Datetime]),int_min*60)

len <- length(slots)

# if the last interval is not equal to the end, add the end as last interval to be used as upper limit
if (slots[len] != exp_END){
  slots[len+1] <- exp_END
  len <- len + 1
}

# allocate table
all_Lode_exp_avrg <- data.table(Datetime=rep(exp_START,len-1),CPM.1=rep(0,len-1),CPM.2=rep(0,len-1),CPM.3=rep(0,len-1),
                                SBM20=rep(0,len-1),SI.29BG=rep(0,len-1),VOLTCRAFT=rep(0,len-1))


# assign averages to intervals  
for (i in 1:(len-1)) {
  all_Lode_exp_avrg$Datetime[i] <- slots[i]
  all_Lode_exp_avrg$CPM.1[i] <- all_Lode_exp[Datetime >= slots[i] & Datetime < slots[i+1] & !is.na(CPM.1), mean(CPM.1),]
  all_Lode_exp_avrg$CPM.2[i] <- all_Lode_exp[Datetime >= slots[i] & Datetime < slots[i+1] & !is.na(CPM.2), mean(CPM.2),]
  all_Lode_exp_avrg$CPM.3[i] <- all_Lode_exp[Datetime >= slots[i] & Datetime < slots[i+1] & !is.na(CPM.3), mean(CPM.3),]
  all_Lode_exp_avrg$SBM20[i] <- all_Lode_exp[Datetime >= slots[i] & Datetime < slots[i+1] & !is.na(SBM20), mean(SBM20),]
  all_Lode_exp_avrg$SI.29BG[i] <- all_Lode_exp[Datetime >= slots[i] & Datetime < slots[i+1] & !is.na(SI.29BG), mean(SI.29BG),]
  all_Lode_exp_avrg$VOLTCRAFT[i] <- all_Lode_exp[Datetime >= slots[i] & Datetime < slots[i+1] & !is.na(VOLTCRAFT), mean(VOLTCRAFT),]
}


plot <- ggplot(data=all_Lode_exp,aes(x=Datetime)) + 
  geom_line(aes(y = CPM.1, colour = "CPM.1")) +
  geom_line(aes(y = CPM.2, colour = "CPM.2")) +
  geom_line(aes(y = CPM.3, colour = "CPM.3"))

plot <- ggplot(data=all_Lode_exp_avrg,aes(x=Datetime)) + 
  geom_line(aes(y = CPM.1, colour = "CPM.1")) +
  geom_line(aes(y = CPM.2, colour = "CPM.2")) +
  geom_line(aes(y = CPM.3, colour = "CPM.3")) +
  geom_line(aes(y = SBM20, colour = "SBM20")) +
  geom_line(aes(y = SI.29BG, colour = "SI.29BG")) +
  geom_line(aes(y = VOLTCRAFT, colour = "VOLTCRAFT"))

plot <- ggplot(data=all_Lode_exp_avrg,aes(x=Datetime)) + 
  geom_line(aes(y = CPM.1, colour = "CPM.1")) +
  geom_line(aes(y = CPM.2, colour = "CPM.2")) +
  geom_line(aes(y = CPM.3, colour = "CPM.3"))






