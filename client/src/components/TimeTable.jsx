import {useState, useEffect} from "react";
import {Table} from "react-daisyui";
function TimeTable({times}) {
  const [render, setRender] = useState(true);
  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      setRender(!render);
    }, 1000 * 3);

    return () => {
      clearInterval(interval);
    };
  }, [render]);

  function getTime(offSet) {
    const d = new Date();
    const localTime = d.getTime();
    const localOffset = d.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const offset = offSet; // UTC of USA Eastern Time Zone is -05.00
    const time = utc + 3600000 * offset;
    const timeNow = new Date(time);
    const hrs =
      timeNow.getHours() < 10 ? `0${timeNow.getHours()}` : timeNow.getHours();
    const min =
      timeNow.getMinutes() < 10
        ? `0${timeNow.getMinutes()}`
        : timeNow.getMinutes();

    return `${hrs} : ${min}`;
  }

  let singleCountries = times.map((x) => x.country);
  singleCountries = [...new Set(singleCountries)];

  const sameUsers = singleCountries.map((c) => {
    let users = [];
    let offset;
    times.map((x) => {
      if (x.country === c) {
        offset = x.offset;
        users.push({
          name: x.name,
          picture: x.profilePic,
          color: x.color,
        });
      }
    });
    return {users: users, country: c, offset: offset};
  });
  return (
    <div
      className=" overflow-x-auto
      ">
      {/* self-center justify-self-center */}
      <div className="overflow-x-auto">
        <Table {...arguments} className="table-xs table">
          <Table.Head>
            <span />
            <span>Name</span>
            <span>Job</span>
            <span>Company</span>
            <span>Location</span>
            <span>Last Login</span>
            <span>Favorite Color</span>
          </Table.Head>

          <Table.Body>
            <Table.Row>
              <span>1</span>
              <span>Cy Ganderton</span>
              <span>Quality Control Specialist</span>
              <span>Littel, Schaden and Vandervort</span>
              <span>Canada</span>
              <span>12/16/2020</span>
              <span>Blue</span>
            </Table.Row>

            <Table.Row>
              <span>2</span>
              <span>Hart Hagerty</span>
              <span>Desktop Support Technician</span>
              <span>Zemlak, Daniel and Leannon</span>
              <span>United States</span>
              <span>12/5/2020</span>
              <span>Purple</span>
            </Table.Row>

            <Table.Row>
              <span>3</span>
              <span>Brice Swyre</span>
              <span>Tax Accountant</span>
              <span>Carroll Group</span>
              <span>China</span>
              <span>8/15/2020</span>
              <span>Red</span>
            </Table.Row>

            <Table.Row>
              <span>4</span>
              <span>Marjy Ferencz</span>
              <span>Office Assistant I</span>
              <span>Rowe-Schoen</span>
              <span>Russia</span>
              <span>3/25/2021</span>
              <span>Crimson</span>
            </Table.Row>

            <Table.Row>
              <span>5</span>
              <span>Yancy Tear</span>
              <span>Community Outreach Specialist</span>
              <span>Wyman-Ledner</span>
              <span>Brazil</span>
              <span>5/22/2020</span>
              <span>Indigo</span>
            </Table.Row>

            <Table.Row>
              <span>6</span>
              <span>Irma Vasilik</span>
              <span>Editor</span>
              <span>Wiza, Bins and Emard</span>
              <span>Venezuela</span>
              <span>12/8/2020</span>
              <span>Purple</span>
            </Table.Row>

            <Table.Row>
              <span>7</span>
              <span>Meghann Durtnal</span>
              <span>Staff Accountant IV</span>
              <span>Schuster-Schimmel</span>
              <span>Philippines</span>
              <span>2/17/2021</span>
              <span>Yellow</span>
            </Table.Row>

            <Table.Row>
              <span>8</span>
              <span>Sammy Seston</span>
              <span>Accountant I</span>
              <span>O'Hara, Welch and Keebler</span>
              <span>Indonesia</span>
              <span>5/23/2020</span>
              <span>Crimson</span>
            </Table.Row>

            <Table.Row>
              <span>9</span>
              <span>Lesya Tinham</span>
              <span>Safety Technician IV</span>
              <span>Turner-Kuhlman</span>
              <span>Philippines</span>
              <span>2/21/2021</span>
              <span>Maroon</span>
            </Table.Row>

            <Table.Row>
              <span>10</span>
              <span>Zaneta Tewkesbury</span>
              <span>VP Marketing</span>
              <span>Sauer LLC</span>
              <span>Chad</span>
              <span>6/23/2020</span>
              <span>Green</span>
            </Table.Row>

            <Table.Row>
              <span>11</span>
              <span>Andy Tipple</span>
              <span>Librarian</span>
              <span>Hilpert Group</span>
              <span>Poland</span>
              <span>7/9/2020</span>
              <span>Indigo</span>
            </Table.Row>

            <Table.Row>
              <span>12</span>
              <span>Sophi Biles</span>
              <span>Recruiting Manager</span>
              <span>Gutmann Inc</span>
              <span>Indonesia</span>
              <span>2/12/2021</span>
              <span>Maroon</span>
            </Table.Row>

            <Table.Row>
              <span>13</span>
              <span>Florida Garces</span>
              <span>Web Developer IV</span>
              <span>Gaylord, Pacocha and Baumbach</span>
              <span>Poland</span>
              <span>5/31/2020</span>
              <span>Purple</span>
            </Table.Row>

            <Table.Row>
              <span>14</span>
              <span>Maribespan Popping</span>
              <span>Analyst Programmer</span>
              <span>Deckow-Pouros</span>
              <span>Portugal</span>
              <span>4/27/2021</span>
              <span>Aquamarine</span>
            </Table.Row>

            <Table.Row>
              <span>15</span>
              <span>Moritz Dryburgh</span>
              <span>Dental Hygienist</span>
              <span>Schiller, Cole and Hackett</span>
              <span>Sri Lanka</span>
              <span>8/8/2020</span>
              <span>Crimson</span>
            </Table.Row>

            <Table.Row>
              <span>16</span>
              <span>Reid Semiras</span>
              <span>Teacher</span>
              <span>Sporer, Sipes and Rogahn</span>
              <span>Poland</span>
              <span>7/30/2020</span>
              <span>Green</span>
            </Table.Row>

            <Table.Row>
              <span>17</span>
              <span>Alec Lethby</span>
              <span>Teacher</span>
              <span>Reichel, Glover and Hamill</span>
              <span>China</span>
              <span>2/28/2021</span>
              <span>Khaki</span>
            </Table.Row>

            <Table.Row>
              <span>18</span>
              <span>Aland Wilber</span>
              <span>Quality Control Specialist</span>
              <span>Kshlerin, Rogahn and Swaniawski</span>
              <span>Czech Republic</span>
              <span>9/29/2020</span>
              <span>Purple</span>
            </Table.Row>

            <Table.Row>
              <span>19</span>
              <span>Teddie Duerden</span>
              <span>Staff Accountant III</span>
              <span>Pouros, Ullrich and Windler</span>
              <span>France</span>
              <span>10/27/2020</span>
              <span>Aquamarine</span>
            </Table.Row>

            <Table.Row>
              <span>20</span>
              <span>Lorelei Blackstone</span>
              <span>Data Coordiator</span>
              <span>Witting, Kutch and Greenfelder</span>
              <span>Kazakhstan</span>
              <span>6/3/2020</span>
              <span>Red</span>
            </Table.Row>
          </Table.Body>

          <Table.Footer>
            <span />
            <span>Name</span>
            <span>Job</span>
            <span>company</span>
            <span>location</span>
            <span>Last Login</span>
            <span>Favorite Color</span>
          </Table.Footer>
        </Table>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Job</th>
              <th>company</th>
              <th>location</th>
              <th>Last Login</th>
              <th>Favorite Color</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Littel, Schaden and Vandervort</td>
              <td>Canada</td>
              <td>12/16/2020</td>
              <td>Blue</td>
            </tr>
            <tr>
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Zemlak, Daniel and Leannon</td>
              <td>United States</td>
              <td>12/5/2020</td>
              <td>Purple</td>
            </tr>
            <tr>
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Carroll Group</td>
              <td>China</td>
              <td>8/15/2020</td>
              <td>Red</td>
            </tr>
            <tr>
              <th>4</th>
              <td>Marjy Ferencz</td>
              <td>Office Assistant I</td>
              <td>Rowe-Schoen</td>
              <td>Russia</td>
              <td>3/25/2021</td>
              <td>Crimson</td>
            </tr>
            <tr>
              <th>5</th>
              <td>Yancy Tear</td>
              <td>Community Outreach Specialist</td>
              <td>Wyman-Ledner</td>
              <td>Brazil</td>
              <td>5/22/2020</td>
              <td>Indigo</td>
            </tr>
            <tr>
              <th>6</th>
              <td>Irma Vasilik</td>
              <td>Editor</td>
              <td>Wiza, Bins and Emard</td>
              <td>Venezuela</td>
              <td>12/8/2020</td>
              <td>Purple</td>
            </tr>
            <tr>
              <th>7</th>
              <td>Meghann Durtnal</td>
              <td>Staff Accountant IV</td>
              <td>Schuster-Schimmel</td>
              <td>Philippines</td>
              <td>2/17/2021</td>
              <td>Yellow</td>
            </tr>
            <tr>
              <th>8</th>
              <td>Sammy Seston</td>
              <td>Accountant I</td>
              <td>O'Hara, Welch and Keebler</td>
              <td>Indonesia</td>
              <td>5/23/2020</td>
              <td>Crimson</td>
            </tr>
            <tr>
              <th>9</th>
              <td>Lesya Tinham</td>
              <td>Safety Technician IV</td>
              <td>Turner-Kuhlman</td>
              <td>Philippines</td>
              <td>2/21/2021</td>
              <td>Maroon</td>
            </tr>
            <tr>
              <th>10</th>
              <td>Zaneta Tewkesbury</td>
              <td>VP Marketing</td>
              <td>Sauer LLC</td>
              <td>Chad</td>
              <td>6/23/2020</td>
              <td>Green</td>
            </tr>
            <tr>
              <th>11</th>
              <td>Andy Tipple</td>
              <td>Librarian</td>
              <td>Hilpert Group</td>
              <td>Poland</td>
              <td>7/9/2020</td>
              <td>Indigo</td>
            </tr>
            <tr>
              <th>12</th>
              <td>Sophi Biles</td>
              <td>Recruiting Manager</td>
              <td>Gutmann Inc</td>
              <td>Indonesia</td>
              <td>2/12/2021</td>
              <td>Maroon</td>
            </tr>
            <tr>
              <th>13</th>
              <td>Florida Garces</td>
              <td>Web Developer IV</td>
              <td>Gaylord, Pacocha and Baumbach</td>
              <td>Poland</td>
              <td>5/31/2020</td>
              <td>Purple</td>
            </tr>
            <tr>
              <th>14</th>
              <td>Maribeth Popping</td>
              <td>Analyst Programmer</td>
              <td>Deckow-Pouros</td>
              <td>Portugal</td>
              <td>4/27/2021</td>
              <td>Aquamarine</td>
            </tr>
            <tr>
              <th>15</th>
              <td>Moritz Dryburgh</td>
              <td>Dental Hygienist</td>
              <td>Schiller, Cole and Hackett</td>
              <td>Sri Lanka</td>
              <td>8/8/2020</td>
              <td>Crimson</td>
            </tr>
            <tr>
              <th>16</th>
              <td>Reid Semiras</td>
              <td>Teacher</td>
              <td>Sporer, Sipes and Rogahn</td>
              <td>Poland</td>
              <td>7/30/2020</td>
              <td>Green</td>
            </tr>
            <tr>
              <th>17</th>
              <td>Alec Lethby</td>
              <td>Teacher</td>
              <td>Reichel, Glover and Hamill</td>
              <td>China</td>
              <td>2/28/2021</td>
              <td>Khaki</td>
            </tr>
            <tr>
              <th>18</th>
              <td>Aland Wilber</td>
              <td>Quality Control Specialist</td>
              <td>Kshlerin, Rogahn and Swaniawski</td>
              <td>Czech Republic</td>
              <td>9/29/2020</td>
              <td>Purple</td>
            </tr>
            <tr>
              <th>19</th>
              <td>Teddie Duerden</td>
              <td>Staff Accountant III</td>
              <td>Pouros, Ullrich and Windler</td>
              <td>France</td>
              <td>10/27/2020</td>
              <td>Aquamarine</td>
            </tr>
            <tr>
              <th>20</th>
              <td>Lorelei Blackstone</td>
              <td>Data Coordiator</td>
              <td>Witting, Kutch and Greenfelder</td>
              <td>Kazakhstan</td>
              <td>6/3/2020</td>
              <td>Red</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Job</th>
              <th>company</th>
              <th>location</th>
              <th>Last Login</th>
              <th>Favorite Color</th>
            </tr>
          </tfoot>
        </table>
      </div>
      <Table {...sameUsers} className="table-xs table">
        <Table.Body>
          {sameUsers.length > 0
            ? sameUsers.map((c) => {
                return (
                  <Table.Row>
                    {/* <div key={c}> */}
                    <span
                      // className={`border-[1px] p-[10px]  flex `}
                      style={{
                        backgroundColor: c.users[0].color,
                      }}>
                      {c.country}
                    </span>
                    <span
                      className="border-[1px] 
                      ">
                      {getTime(c.offset)}
                    </span>
                    <span className={`border-[1px]  `}>
                      {c.users.length > 0
                        ? c?.users?.map((x) => (
                            <img
                              src={`${x.picture}`}
                              className=" w-[40px] h-[40px] rounded-[100px]"
                            />
                          ))
                        : null}
                    </span>
                    {/* </div> */}
                  </Table.Row>
                );
              })
            : null}
          {/* <div className="border-[1px] p-[10px]">Users</div> */}
        </Table.Body>
      </Table>
    </div>
  );
}

export default TimeTable;
