import Sleep from "../models/Sleep.model.js";
import { io } from "../socket/socket.js";      

export const saveSleep = async (req, res)=>{
    try {     
        const {hours} = req.body;
        const userId = req.user._id;
        //first check already exist for past 24 hr for this user/ if so,modify
        //another call to get online users sleep right. 
        // const newSleep = new Sleep({
        //   userId,
        //  hours
        // });   
        // await newSleep.save();
        //io.to(room).emit("newSleep", newSleep )


        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
       
        // Execute the aggregation query to find matching documents
        const existingEntries = await Sleep.find({
            userId: userId,
            timestamp: { $gte: yesterday }
        });
        
        if (existingEntries.length > 0) {
            // Update the existing entry
            const existingEntry = existingEntries[0];
            existingEntry.hours = hours; // Update the hours slept
            await existingEntry.save();
            console.log('Existing entry modified:', existingEntry);
            res.status(200).json(existingEntry); // Respond with the modified entry
        } else {
            // Create a new entry  
            const newSleep = new Sleep({
                userId,
                hours
            });
            await newSleep.save();
            console.log('New entry created:', newSleep);
            res.status(201).json(newSleep); // Respond with the new entry
        }
        // Define the aggregation pipeline
//         const pipeline = [
//             {
//                 $match: {
//                     timestamp: { $gte: yesterday } // Filter documents within the past 24 hours
//                 } 
//             },
//             {
//                 $count: 'total' // Count the number of matching documents
//             }
//         ];

//         // Execute the aggregation query
//         const result = await Sleep.find(pipeline);
// console.log(result)
        // Check if there are any entries within the past 24 hours
        // const count = result.length > 0 ? result[0].total : 0;

        // if (count > 0) {
        //     console.log('There are entries within the last 24 hours.');
        // } else {
        //     console.log('No entries within the last 24 hours.');
        // }
        //res.status(201).json(newSleep);
    
    
      } catch (error) {
        console.log("Error in saveSleep controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
      }
}