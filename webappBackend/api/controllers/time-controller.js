exports.GetCurrentTime = () => {
    let currentDate = new Date();
	return currentDate.getTime();

}

exports.GetTimeDifference = (startTime) => {
    let endTime = new Date();
    return endTime.getTime() - startTime;
    
}
