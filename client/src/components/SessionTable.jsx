import React from 'react'
import useGetUsers from '../hooks/useGetUsers';
export const SessionTable = ({arr, table}) => {


const {users} = useGetUsers()
if(table=="all" && users.length==0){
    return (
        <span className="loading loading-infinity loading-md"></span>

    )
}
    return (
      <div className="flex flex-col w-[100%] max-h-[500px] rounded-8  ">

<div className="overflow-x-auto ">
  <table className="table table-zebra table-xs rounded-[12px] table-pin-rows">
    {/* head */}
    <thead>
      <tr>
      {table=="all"? <th>User</th>:null}
        <th> #</th>
        <th>goal</th>
        <th>rating</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      {arr ? arr.map((e) => {
              return (
                <tr>
                 {table=="all"?   <td>
{users.filter((u)=>  u._id===e.userId)[0].name}</td> :null}
                <th>{e.sessionNumber}</th>
                <td> {e.goal}</td>
                <td className=' '   >
                  <div className='border-2 flex w-[100%] bg-base-200'>
                    <span className='border-1 h-[10px] flex  bg-base-content ' style={{
                        
  
                        width: `${e.rating}%`,
                        
                        
                      }}>

                    </span>
                    {/* {e.rating} % */}
                    </div> 
                {/* <td> <div
                      style={{
                        transition: "width 2s",
  
                        width: `${e[0].rating}%`,
                        height: "100%",
                        backgroundColor: "white",
                      }}>
                      <p className="text-[14px] left-[4px] bottom-[2px] absolute w-[40px] sm:w-[80px]"> */}
                        {/* <p className=' bg-success' >w</p> */}
                      {/* </p> */}
                    {/* </div> */}
                    </td>
              </tr>
              )}):null }
      
    </tbody>
  </table>
</div>

        {/* <div className="flex flex-row">
          <div className="border-[3px]  border-white pr-[10px] w-[20px] sm:w-[40px] h-[100%] flex pl-[2px] py-[4px]">
            #
          </div>
          <div className="border-[3px]  border-white pr-[10px] w-[60px] sm:w-[80px] h-[100%] flex pl-[2px] py-[4px]">
            User
          </div>
          <div
            className="border-[3px] px-[10px] border-white w-[600px] sm:w-[700px] flex py-[4px]
          
          ">
            goal
          </div>
          <div className="border-[3px] py-[4px] px-[10px] border-white min-w-[60px] sm:w-[80px] flex w-[40px] ">
            rating
          </div>
        </div>
        {arr
          ? arr.map((e) => {
              return (
                <div className="flex flex-row w-[100%] ">
                  <div className="border-[3px]  border-white pr-[10px] sm:w-[40px] w-[20px] h-[auto] flex pl-[2px] ">
                    {e[0].sessNumber}
                  </div>
                  <div className="border-[3px]  border-white pr-[10px] w-[60px] sm:w-[80px] h-[100%] flex pl-[2px] py-[4px]">
                    User
                  </div>
                  <div className="border-[3px] px-[10px] border-white w-[600px] flex sm:w-[700px] ">
                    {e[0].goal}
                  </div>
                  <div className="border-[3px] sm:w-[80px]  border-white min-w-[60px] flex relative  ">
                    <div
                      style={{
                        transition: "width 2s",
  
                        width: `${e[0].rating}%`,
                        height: "100%",
                        backgroundColor: "white",
                      }}>
                      <p className="text-[14px] left-[4px] bottom-[2px] absolute w-[40px] sm:w-[80px]">
                        {e[0].rating} %
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          : null} */}
        {/* A list of sessions of the current day, their goals and if done or not. All will be visible to Shams.   */}
      </div>
    );
  };