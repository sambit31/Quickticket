const TimeFormat = (time) => {
    
   const hours = Math.floor(time / 60);
   const minutesRemainder = time % 60;
   const formattedTime = `${hours}h ${minutesRemainder}m`;

   return formattedTime;
}

export default TimeFormat