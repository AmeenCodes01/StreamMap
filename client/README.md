# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and
some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)
  uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)
  uses [SWC](https://swc.rs/) for Fast Refresh

People will be guests to the owner's map. So a master json will be attached to
Shams, including countries + color + time. The guests json will have their
username + pfp + country + color

As guests will join, they will be assigned an id and then country + color + id
will be attached to master json.

All will see same page everything, only Shams will have start stop option.

I am working on master json right now. So I should make fake json user files & a
master json file.

A new user joining Session start/end

 <div className="border-t-[1px] py-[6px] bg-blue-300 ml-[10px]

      ">
        <div className="  border-[1px]    items-center">
          <div
            className=" flex-row    flex "
            style={{
              display: showJoin ? "flex" : " none",
            }}>
            <input onChange={(e) => setUsername(e.target.value)} className="" />
            <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={null}
              classNames={{
                // container: () =>
                //   "focus:outline-none rounded-[6px] items-center  self-stretch  border-[1px] border-grey-15  ",
                input: () =>
                  `  text-start w-[100px]  text-white z-[1000]
                absolute
                `,
                placeholder: () => `text-start  text-white `,
                singleValue: () => ` text-start  text-white  `,

                container: () => " border-[4px] flex  w-[100%] rounded-[6px] ",
                control: () =>
                  "  flex text-center w-[100%]  relative  rounded-[6px] h-[30px] self-center  ",
                valueContainer: () => " mx-[4px] my-[2px]  ",
                indicatorsContainer: () => "  rounded-r-[6px] mr-[8px]",
                indicatorSeparator: () => "  ",
                menu: () =>
                  "   w-[100%] flex flex-col z-[1000] absolute bg-[#b2d2de]  max-h-[150px] mt-[50px]",
                option: ({isFocused}) =>
                  ` ${
                    isFocused ? "bg-purple-60 " : "bg-blue"
                  }  linear-gradient(to bottom, #CAF0F8, rgb(116, 192, 219))    my-[10px] p-[5px]  text-white `,
              }}
              styles={{
                menuList: (base) => ({
                  ...base,

                  "::-webkit-scrollbar": {
                    width: "4px",
                    height: "0px",
                  },
                  "::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                  },
                  "::-webkit-scrollbar-thumb": {
                    background: "#888",
                  },
                  "::-webkit-scrollbar-thumb:hover": {
                    background: "#555",
                  },
                }),
                input: (baseStyles) => ({}),
                placeholder: (base) => ({}),
                singleValue: (base) => ({}),
                container: (baseStyles, state) => ({
                  ...baseStyles,
                  width: "100%",
                  // backgroundColor: "#262626",
                }),
                control: (baseStyles, state) => ({}),
                indicatorSeparator: (baseStyles, state) => ({}),
                menu: (baseStyles, state) => ({}),
                option: (baseStyles, state) => ({}),
              }}
              placeholder="country name"
              onChange={setMyCountry}
              name="color"
              options={countNames}
            />
            <div className="flex   pl-[10px]   ">
              {/* <p className="text-white self-center">color:</p> */}
              <label
                className=" rounded-[6px] "
                style={{backgroundColor: primColor, borderWidth: "0px"}}>
                <input
                  type="color"
                  value={primColor}
                  className="w-[50px] h-[50px]  border-[0px] self-center  block opacity-0"
                  style={{backgroundColor: primColor, borderWidth: "0px"}}
                  onChange={(e) => setColor(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div
            onClick={() => {
              onJoin();
              // if (!showJoin) {
              //   setJoin(true);
              // } else {
              //   onJoin();
              // }
            }}
            className="border-[1px] rounded-[6px]  flex    bg-[#CAF0F8]  ">
            <span>Join</span>
            {/* <p className={styles.tw}> */}
            {/* {countries.length > 0 ? "Change" : "Join"} */}
            {/* </p> */}
          </div>
        </div>
      </div>
