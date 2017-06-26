doDelta <- function (pixelsXY,isInteractive){
  
  my_pixelXY <- pixelsXY[,c(3:7)]
  firstValue <- my_pixelXY[,max(R),by=c("coordX","coordY")]
  firstValue <- firstValue[my_pixelXY[,max(G),by=c("coordX","coordY")]]
  firstValue <- firstValue[my_pixelXY[,max(B),by=c("coordX","coordY")]]
  
  names(firstValue) <- c("coordX", "coordY", "R1", "G1", "B1")
  
  auxTable <- firstValue[my_pixelXY]
  
  
  secondValue <- auxTable[R<R1,max(R),by=c("coordX","coordY")]
  secondValue <- merge(secondValue, auxTable[G<G1,max(G),by=c("coordX","coordY")], all=TRUE)
  secondValue <- merge(secondValue, auxTable[B<B1,max(B),by=c("coordX","coordY")], all=TRUE)
  
  names(secondValue) <- c("coordX", "coordY", "R2", "G2", "B2")
  
  auxTable <- secondValue[firstValue]
  
  for (j in seq_len(ncol(auxTable))){
    set(auxTable,which(is.na(auxTable[[j]])),j,0)
  }
  
  
  # Create a data.table from a vector form of the differences and immediately count the occurrences of each difference
  diffOccur <- data.table(value=auxTable[, c(R1-R2,G1-G2,B1-B2)],key="value")[,.N,by=value]
  
  maxDiff <- max(diffOccur$value)
  minDiff <- max(min(diffOccur$value),1)
  
  thresholdMatrix <- data.table(threshold=rep(0,maxDiff-minDiff+1),hits=rep(0,maxDiff-minDiff+1))
  
  for (i in minDiff:maxDiff){
    thresholdMatrix[i, threshold := i]
    thresholdMatrix[i, hits := diffOccur[value>=i,sum(N)] ]
  }
  
  setkey(thresholdMatrix,threshold)

# Rene/frameData2017-06-15T08-47-05.398Z.csv
  if (isInteractive == 'y'){
    my_title <- paste("Thresholds versus hits for file ",dataFile,", filter is ",isFiltered, sep="")
    
    thresholdPlot <- ggplot(data=thresholdMatrix,aes(x=threshold)) + 
      geom_line(aes(y=hits)) + xlab("Threshold") + ylab("Hits") +
      ggtitle(my_title) + coord_cartesian(xlim = c(0, 100), ylim = c(0,100)) 
    
    print(thresholdPlot)
    
    putMsg(my_title,doStop=TRUE)
  }
  
  return(thresholdMatrix)
  
}