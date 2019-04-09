library(data.table)
library(Hmisc)
library(scales)
#library(dplyr)

# 21-12-18_09-01-19_hourly_avg_amstelveen.csv
# 21-12-18_09-01-19_hourly_avg_amsterdam.csv
# 21-12-18_09-01-19_hourly_avg_bilthoven.csv
# 21-12-18_09-01-19_hourly_avg_denhelder.csv
# 21-12-18_09-01-19_hourly_avg_groningen.csv
# 21-12-18_09-01-19_hourly_avg_gulpen.csv
# 21-12-18_09-01-19_hourly_avg_nieuwdorp.csv
# 21-12-18_09-01-19_hourly_avg_pinto.csv

## CONSTANTS ##
file_dir <- "/Users/SB/Documents/Waag/OO 226 GammaSense/05 Research/RIVM Veldbezoek 11 Dec 2018/Data/"

# http://www.cookbook-r.com/Graphs/Colors_(ggplot2)/
cbPalette <- c("#999999", "#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7","#000000")

# Quantile filtering
filtering <- .9999

if(!exists("functionLoaded", mode="logical")) source("~/Software/code/Utils/R/Utils.R")

# function used to see whether with a time shift there is a better correlation between reference and SMB20
findOffset <- function(my_reference, my_signal, max_offset){
  
  data <- merge(my_reference, my_signal,all=TRUE)
  ll <- nrow(data)
  
  tmp2 <- vector(mode="numeric",length=ll)
  result <- data.frame(shift=vector(mode="numeric",length=2*max_offset+1),corr=vector(mode="numeric",length=2*max_offset+1),
                       abscorr=vector(mode="numeric",length=2*max_offset+1))
  
  
  for (i in -max_offset:max_offset){
    tmp2 <- unlist(data[,3],use.names=FALSE)
    if(i < 0 ){
      tmp2 <- c(tmp2[-i:(ll)],rep(NaN,-i-1))  
    }else if (i > 0 ){
      tmp2 <- c(rep(NaN,i),tmp2[1:(ll-i)])  
    }
    
    result[i+max_offset+1,"corr"] <- rcorr(as.matrix(data[,2]),tmp2,type="pearson")$r[2,1]
    result[i+max_offset+1,"abscorr"] <- abs(result[i+max_offset+1,"corr"])
    result[i+max_offset+1,"shift"] <- i
  }
  ggplot(data=result,aes(x=shift)) + geom_line(aes(y = corr, colour = "corr")) + geom_line(aes(y = abscorr, colour = "abscorr"))
  return(result$shift[which(result$corr == max(result$corr,na.rm=TRUE))])
}


## START ##

amstelveen <- read.csv(paste(file_dir,"21-12-18_09-01-19_hourly_avg_amstelveen.csv",sep=""), sep=",", stringsAsFactors = FALSE)
colnames(amstelveen) <- c("time","amstelveen")
amstelveen[,"time"] <- as.POSIXct(amstelveen[,"time"],format="%Y-%m-%d %H:%M:%S", tz="GMT")
amstelveen <-data.table(amstelveen,key="time")

amsterdam <- read.csv(paste(file_dir,"21-12-18_09-01-19_hourly_avg_amsterdam.csv",sep=""), sep=",", stringsAsFactors = FALSE)
colnames(amsterdam) <- c("time","amsterdam")
amsterdam[,"time"] <- as.POSIXct(amsterdam[,"time"],format="%Y-%m-%d %H:%M:%S", tz="GMT")
amsterdam <-data.table(amsterdam,key="time")

bilthoven <- read.csv(paste(file_dir,"21-12-18_09-01-19_hourly_avg_bilthoven.csv",sep=""), sep=",", stringsAsFactors = FALSE)
colnames(bilthoven) <- c("time","bilthoven")
bilthoven[,"time"] <- as.POSIXct(bilthoven[,"time"],format="%Y-%m-%d %H:%M:%S", tz="GMT")
bilthoven <-data.table(bilthoven,key="time")

denhelder <- read.csv(paste(file_dir,"21-12-18_09-01-19_hourly_avg_denhelder.csv",sep=""), sep=",", stringsAsFactors = FALSE)
colnames(denhelder) <- c("time","denhelder")
denhelder[,"time"] <- as.POSIXct(denhelder[,"time"],format="%Y-%m-%d %H:%M:%S", tz="GMT")
denhelder <-data.table(denhelder,key="time")

groningen <- read.csv(paste(file_dir,"21-12-18_09-01-19_hourly_avg_groningen.csv",sep=""), sep=",", stringsAsFactors = FALSE)
colnames(groningen) <- c("time","groningen")
groningen[,"time"] <- as.POSIXct(groningen[,"time"],format="%Y-%m-%d %H:%M:%S", tz="GMT")
groningen <-data.table(groningen,key="time")

gulpen <- read.csv(paste(file_dir,"21-12-18_09-01-19_hourly_avg_gulpen.csv",sep=""), sep=",", stringsAsFactors = FALSE)
colnames(gulpen) <- c("time","gulpen")
gulpen[,"time"] <- as.POSIXct(gulpen[,"time"],format="%Y-%m-%d %H:%M:%S", tz="GMT")
gulpen <-data.table(gulpen,key="time")

nieuwdorp <- read.csv(paste(file_dir,"21-12-18_09-01-19_hourly_avg_nieuwdorp.csv",sep=""), sep=",", stringsAsFactors = FALSE)
colnames(nieuwdorp) <- c("time","nieuwdorp")
nieuwdorp[,"time"] <- as.POSIXct(nieuwdorp[,"time"],format="%Y-%m-%d %H:%M:%S", tz="GMT")
nieuwdorp <-data.table(nieuwdorp,key="time")

pinto <- read.csv(paste(file_dir,"21-12-18_09-01-19_hourly_avg_pinto.csv",sep=""), sep=",", stringsAsFactors = FALSE)
colnames(pinto) <- c("time","pinto")
pinto[,"time"] <- as.POSIXct(pinto[,"time"],format="%Y-%m-%d %H:%M:%S", tz="GMT")
pinto <-data.table(pinto,key="time")


datasets <- list(amstelveen,amsterdam,bilthoven,denhelder,groningen,gulpen,nieuwdorp,pinto)

if ( 
    (Reduce(function(x,y) max(x,last(y$time)), datasets,init=last(amstelveen$time)) != Reduce(function(x,y) min(x,last(y$time)), datasets,init=last(amstelveen$time)) )
    ||
    (Reduce(function(x,y) max(x,first(y$time)), datasets,init=first(amstelveen$time)) != Reduce(function(x,y) min(x,first(y$time)), datasets,init=first(amstelveen$time)) )
    ){
stop("timeframe datasets is not correct")      
}
     

if (Reduce(function(x,y) max(x,length(y$time)), datasets,init=length(amstelveen$time)) != Reduce(function(x,y) min(x,length(y$time)), datasets,init=length(amstelveen$time)) )
{
  warning("lenght datasets is not correct")      
}


start <- first(amstelveen$time)
end <- last(amstelveen$time)

pinto_pm <- read.csv(paste(file_dir,"pinto_every_minute_21-12-18-09-01-19.csv",sep=""), sep=",", stringsAsFactors = FALSE)
colnames(pinto_pm) <- c("time","pinto_pm")
pinto_pm[,"time"] <- as.POSIXct(pinto_pm[,"time"],format="%Y-%m-%d %H:%M:%S", tz="GMT")
pinto_pm <-data.table(pinto_pm,key="time")


pinto_pm$pinto_pm[pinto_pm$pinto_pm > quantile(pinto_pm$pinto_pm,probs=filtering)] <- NA

slots <- hourlyTimeSlots(min(pinto_pm[,time]),max(pinto_pm[,time]))

len <- length(slots)

# allocate table
pinto_pm_avrg <- data.table(time=rep(pinto_pm$time[1],len-1),pinto_pm_avrg=rep(NA,len-1))


# assign averages to intervals
for (i in 1:len-1) {
  pinto_pm_avrg$time[i] <- slots[i]
  
  pinto_pm_avrg$pinto_pm_avrg[i] <- pinto_pm[time >= slots[i] & time < slots[i+1] & !is.na(pinto_pm), mean(pinto_pm),]
  
}

uithoorn_pm <- read.csv(paste(file_dir,"polyphemus.csv",sep=""), sep=",", skip = 1 ,stringsAsFactors = FALSE)
colnames(uithoorn_pm) <- c("time","uithoorn_pm")
uithoorn_pm[,"time"] <- as.POSIXct(uithoorn_pm[,"time"],format="%Y-%m-%d %H:%M:%S", tz="GMT")
uithoorn_pm <-data.table(uithoorn_pm,key="time")

uithoorn_pm$uithoorn_pm[uithoorn_pm$uithoorn_pm > quantile(uithoorn_pm$uithoorn_pm,probs=filtering)] <- NA

slots <- hourlyTimeSlots(min(pinto_pm[,time]),max(pinto_pm[,time]))

len <- length(slots)

# allocate table
uithoorn_pm_avrg <- data.table(time=rep(uithoorn_pm$time[1],len-1),uithoorn_pm_avrg=rep(NA,len-1))


# assign averages to intervals
for (i in 1:len-1) {
  uithoorn_pm_avrg$time[i] <- slots[i]
  
  uithoorn_pm_avrg$uithoorn_pm_avrg[i] <- uithoorn_pm[time >= slots[i] & time < slots[i+1] & !is.na(uithoorn_pm), mean(uithoorn_pm),]
  
}

#pinto$pinto <- pinto$pinto*5

all_data <- Reduce(function(...) merge(..., all = TRUE), list(amstelveen,amsterdam,bilthoven,denhelder,groningen,gulpen,nieuwdorp,pinto,pinto_pm_avrg,uithoorn_pm_avrg))

tlt <- "Official and Pinto measurements"

p <- ggplot(data=all_data,aes(x=time)) +
  geom_line(aes(y = amstelveen, colour = "amstelveen"),na.rm=TRUE) + 
  geom_line(aes(y = amsterdam, colour = "amsterdam"),na.rm=TRUE) + 
  geom_line(aes(y = bilthoven, colour = "bilthoven"),na.rm=TRUE) + 
  geom_line(aes(y = denhelder, colour = "denhelder"),na.rm=TRUE) + 
  geom_line(aes(y = groningen, colour = "groningen"),na.rm=TRUE) + 
  geom_line(aes(y = gulpen, colour = "gulpen"),na.rm=TRUE) + 
  geom_line(aes(y = nieuwdorp, colour = "nieuwdorp"),na.rm=TRUE) + 
#  geom_line(aes(y = pinto, colour = "pinto"),na.rm=TRUE) +
  geom_line(aes(y = pinto_pm_avrg, colour = "pinto_pm_avrg"),na.rm=TRUE) +
  geom_line(aes(y = uithoorn_pm_avrg, colour = "uithoorn_pm_avrg"),na.rm=TRUE)

p <- addPlotItems(p,"time","hourly mean(cpm & nSv/h)",tlt)

print(p)

putMsg(tlt, doStop=TRUE)

tlt <- "Local Official and Pinto measurements"

p <- ggplot(data=all_data,aes(x=time)) +
  geom_line(aes(y = amstelveen, colour = "amstelveen"),na.rm=TRUE) + 
  geom_line(aes(y = amsterdam, colour = "amsterdam"),na.rm=TRUE) + 
#  geom_line(aes(y = pinto, colour = "pinto"),na.rm=TRUE) +
  geom_line(aes(y = pinto_pm_avrg, colour = "pinto_pm_avrg"),na.rm=TRUE) +
  geom_line(aes(y = uithoorn_pm_avrg, colour = "uithoorn_pm_avrg"),na.rm=TRUE)

p <- addPlotItems(p,"time","hourly mean(cpm & nSv/h)",tlt)

print(p)

putMsg(tlt, doStop=TRUE)

if( ! ( exists("avrg_corr_pinto") && exists("avrg_corr_amst") && exists("avrg_corr_uithoorn")) ){
  average_limit <- 24
  avrg_corr_pinto <- data.table(interval=seq(1,average_limit),amstelveen=rep(NaN,average_limit),
                          amsterdam=rep(NaN,average_limit),
                          bilthoven=rep(NaN,average_limit),
                          denhelder=rep(NaN,average_limit),
                          groningen=rep(NaN,average_limit),
                          gulpen=rep(NaN,average_limit),
                          nieuwdorp=rep(NaN,average_limit),
                          # pinto=rep(NaN,average_limit),
                          pinto_pm_avrg=rep(NaN,average_limit),
                          uithoorn_pm_avrg=rep(NaN,average_limit)
                      )
  
  avrg_corr_amst <- data.table(interval=seq(1,average_limit),amstelveen=rep(NaN,average_limit),
                                amsterdam=rep(NaN,average_limit),
                                bilthoven=rep(NaN,average_limit),
                                denhelder=rep(NaN,average_limit),
                                groningen=rep(NaN,average_limit),
                                gulpen=rep(NaN,average_limit),
                                nieuwdorp=rep(NaN,average_limit),
                                # pinto=rep(NaN,average_limit),
                                pinto_pm_avrg=rep(NaN,average_limit),
                                uithoorn_pm_avrg=rep(NaN,average_limit)
  )
  
  avrg_corr_uithoorn <- data.table(interval=seq(1,average_limit),amstelveen=rep(NaN,average_limit),
                               amsterdam=rep(NaN,average_limit),
                               bilthoven=rep(NaN,average_limit),
                               denhelder=rep(NaN,average_limit),
                               groningen=rep(NaN,average_limit),
                               gulpen=rep(NaN,average_limit),
                               nieuwdorp=rep(NaN,average_limit),
                               # pinto=rep(NaN,average_limit),
                               pinto_pm_avrg=rep(NaN,average_limit),
                               uithoorn_pm_avrg=rep(NaN,average_limit)
  )
  
  for( h in 1:average_limit){
    slots <- hourlyTimeSlots(start,end,h)
  
    len <- length(slots)
  
    # allocate table
    all_nh_avrg <- data.table(time=rep(start,len-1),
                                    amstelveen=rep(NaN,len-1),
                                    amsterdam=rep(NaN,len-1),
                                    bilthoven=rep(NaN,len-1),
                                    denhelder=rep(NaN,len-1),
                                    groningen=rep(NaN,len-1),
                                    gulpen=rep(NaN,len-1),
                                    nieuwdorp=rep(NaN,len-1),
                                    # pinto=rep(NaN,len-1),
                                    pinto_pm_avrg=rep(NaN,len-1),
                                    uithoorn_pm_avrg=rep(NaN,len-1)
                                  )
  
  
  # assign averages to intervals
  for (i in 1:len-1) {
    all_nh_avrg$time[i] <- slots[i]
    
    all_nh_avrg$amstelveen[i] <- all_data[time >= slots[i] & time < slots[i+1] & !is.na(amstelveen), mean(amstelveen),]
    all_nh_avrg$amsterdam[i]  <- all_data[time >= slots[i] & time < slots[i+1] & !is.na(amsterdam), mean(amsterdam),]
    all_nh_avrg$bilthoven[i]  <- all_data[time >= slots[i] & time < slots[i+1] & !is.na(bilthoven), mean(bilthoven),]
    all_nh_avrg$denhelder[i]  <- all_data[time >= slots[i] & time < slots[i+1] & !is.na(denhelder), mean(denhelder),]
    all_nh_avrg$groningen[i]  <- all_data[time >= slots[i] & time < slots[i+1] & !is.na(groningen), mean(groningen),]
    all_nh_avrg$gulpen[i]     <- all_data[time >= slots[i] & time < slots[i+1] & !is.na(gulpen), mean(gulpen),]
    all_nh_avrg$nieuwdorp[i]  <- all_data[time >= slots[i] & time < slots[i+1] & !is.na(nieuwdorp), mean(nieuwdorp),]
    # all_nh_avrg$pinto[i]  <- all_data[time >= slots[i] & time < slots[i+1] & !is.na(pinto), mean(pinto),]
    all_nh_avrg$pinto_pm_avrg[i]  <- all_data[time >= slots[i] & time < slots[i+1] & !is.na(pinto_pm_avrg), mean(pinto_pm_avrg),]
    all_nh_avrg$uithoorn_pm_avrg[i]  <- all_data[time >= slots[i] & time < slots[i+1] & !is.na(uithoorn_pm_avrg), mean(uithoorn_pm_avrg),]
    
    
  }
  
  rc <- rcorr(as.matrix(all_nh_avrg[,2:ncol(all_nh_avrg)]),type="pearson")
  #browser()
  avrg_corr_pinto[h, colnames(avrg_corr_pinto[,-1]) := as.list(rc$r["pinto_pm_avrg",])]
  avrg_corr_amst[h, colnames(avrg_corr_pinto[,-1]) := as.list(rc$r["amsterdam",])]
  avrg_corr_uithoorn[h, colnames(avrg_corr_uithoorn[,-1]) := as.list(rc$r["uithoorn_pm_avrg",])]
  }
}


tlt <- "Correlations Pinto vs rest, at 1-24 intervals for average"

p <- ggplot(data=avrg_corr_pinto,aes(x=interval)) +
  geom_line(aes(y = amstelveen, colour = "amstelveen"),na.rm=TRUE) + 
  geom_line(aes(y = amsterdam, colour = "amsterdam"),na.rm=TRUE) + 
  geom_line(aes(y = bilthoven, colour = "bilthoven"),na.rm=TRUE) + 
  geom_line(aes(y = denhelder, colour = "denhelder"),na.rm=TRUE) + 
  geom_line(aes(y = groningen, colour = "groningen"),na.rm=TRUE) + 
  geom_line(aes(y = gulpen, colour = "gulpen"),na.rm=TRUE) + 
  geom_line(aes(y = nieuwdorp, colour = "nieuwdorp"),na.rm=TRUE) + 
  # geom_line(aes(y = pinto, colour = "pinto"),na.rm=TRUE) +
  geom_line(aes(y = pinto_pm_avrg, colour = "pinto_pm_avrg"),na.rm=TRUE) +
  geom_line(aes(y = uithoorn_pm_avrg, colour = "uithoorn_pm_avrg"),na.rm=TRUE)


p <- addPlotItems(p,"avrg interval","correlation",tlt)

print(p)

putMsg(tlt, doStop=TRUE)

tlt <- "Correlations Amsterdam vs rest, at 1-24 intervals for average"

p <- ggplot(data=avrg_corr_amst,aes(x=interval)) +
  geom_line(aes(y = amstelveen, colour = "amstelveen"),na.rm=TRUE) + 
  geom_line(aes(y = amsterdam, colour = "amsterdam"),na.rm=TRUE) + 
  geom_line(aes(y = bilthoven, colour = "bilthoven"),na.rm=TRUE) + 
  geom_line(aes(y = denhelder, colour = "denhelder"),na.rm=TRUE) + 
  geom_line(aes(y = groningen, colour = "groningen"),na.rm=TRUE) + 
  geom_line(aes(y = gulpen, colour = "gulpen"),na.rm=TRUE) + 
  geom_line(aes(y = nieuwdorp, colour = "nieuwdorp"),na.rm=TRUE) + 
  # geom_line(aes(y = pinto, colour = "pinto"),na.rm=TRUE) +
  geom_line(aes(y = pinto_pm_avrg, colour = "pinto_pm_avrg"),na.rm=TRUE) +
  geom_line(aes(y = uithoorn_pm_avrg, colour = "uithoorn_pm_avrg"),na.rm=TRUE)


p <- addPlotItems(p,"avrg interval","correlation",tlt)

print(p)

putMsg(tlt, doStop=TRUE)

tlt <- "Correlations Uithoorn vs rest, at 1-24 intervals for average"

p <- ggplot(data=avrg_corr_uithoorn,aes(x=interval)) +
  geom_line(aes(y = amstelveen, colour = "amstelveen"),na.rm=TRUE) + 
  geom_line(aes(y = amsterdam, colour = "amsterdam"),na.rm=TRUE) + 
  geom_line(aes(y = bilthoven, colour = "bilthoven"),na.rm=TRUE) + 
  geom_line(aes(y = denhelder, colour = "denhelder"),na.rm=TRUE) + 
  geom_line(aes(y = groningen, colour = "groningen"),na.rm=TRUE) + 
  geom_line(aes(y = gulpen, colour = "gulpen"),na.rm=TRUE) + 
  geom_line(aes(y = nieuwdorp, colour = "nieuwdorp"),na.rm=TRUE) + 
  # geom_line(aes(y = pinto, colour = "pinto"),na.rm=TRUE) +
  geom_line(aes(y = pinto_pm_avrg, colour = "pinto_pm_avrg"),na.rm=TRUE) +
  geom_line(aes(y = uithoorn_pm_avrg, colour = "uithoorn_pm_avrg"),na.rm=TRUE)


p <- addPlotItems(p,"avrg interval","correlation",tlt)

print(p)

putMsg(tlt, doStop=TRUE)

relation <- lm(formula = all_data$amsterdam ~ all_data$pinto_pm_avrg)
print(summary(relation))

tlt <- "Fitted linear model Amsterdam ~ Pinto"

p <- ggplot(data=all_data,aes(x=time)) +
    geom_line(aes(y = amsterdam, colour = "amsterdam"),na.rm=TRUE) +
    geom_line(aes(y = coefficients(relation)[2] * pinto_pm_avrg + coefficients(relation)[1], colour = "pinto_pm_avrg"),na.rm=TRUE)


p <- addPlotItems(p,"time","cpm & nSv/h",tlt)

print(p)

putMsg(tlt, doStop=TRUE)

relation <- lm(formula = all_data$amstelveen ~ all_data$uithoorn_pm_avrg)
print(summary(relation))

tlt <- "Fitted linear model Amstelveen ~ Uithoorn"

p <- ggplot(data=all_data,aes(x=time)) +
  geom_line(aes(y = amstelveen, colour = "amstelveen"),na.rm=TRUE) +
  geom_line(aes(y = coefficients(relation)[2] * uithoorn_pm_avrg + coefficients(relation)[1], colour = "uithoorn_pm_avrg"),na.rm=TRUE)


p <- addPlotItems(p,"time","cpm & nSv/h",tlt)

print(p)

putMsg(tlt, doStop=TRUE)

