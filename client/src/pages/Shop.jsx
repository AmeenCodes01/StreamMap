import React, {useState, useEffect, useRef, useCallback} from "react";
import {FaPlus} from "react-icons/fa";
import useSaveScore from "../hooks/useSaveScore";
import usePromise from "../hooks/usePromise";
import {TiTickOutline} from "react-icons/ti";
import {MdOutlineEdit, MdDeleteOutline} from "react-icons/md";
import {Modal, Button} from "react-daisyui";
import toast from "react-hot-toast";
import {useAuthContext} from "../context/AuthContext";
import {IoMdArrowRoundBack} from "react-icons/io";
import {Link} from "react-router-dom";
import Promise from "../components/Shop/Promise";
import ModalInput from "../components/Shop/ModalInput";
import {PiCoin} from "react-icons/pi";
import {CiCircleInfo} from "react-icons/ci";

function Shop() {
  //these things should be in authUser because this s

  const [score, setScore] = useState(0);
  const [promises, setPromises] = useState([]);
  const [currentProm, setcurrentProm] = useState([]); //focused promise, can be changed, if finalised, change made to promises <---
  const [coins, setCoins] = useState(0); //temp coins, check against score
  const [error, setError] = useState("");
  const [mode, setMode] = useState("");
  const [newTitle, setNewTitle] = useState(""); //new promise title
  const [newCoins, setNewCoins] = useState(0); //new promise coins

  const [visible, setVisible] = useState(false);
  const {getScore} = useSaveScore();
  const {authUser} = useAuthContext();
  const {
    getPromises,
    newPromise,
    deletePromise,
    updatePromise,
    editPromise,
    loading,
  } = usePromise();

  useEffect(() => {
    const getScores = async () => {
      const data = await getScore();
      console.log(data, "data");
      setScore(data ? data : 0);
    };

    const getPromise = async () => {
      const data = await getPromises();
      if (data) {
        setPromises(data);
      }
    };

    getPromise();
    getScores();
  }, []);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const onChangePromise = (e) => {
    mode !== "new"
      ? setcurrentProm((prevProm) => {
          // Create a new object with the updated promise value
          const updatedProm = {...prevProm, promise: e.target.value};
          return updatedProm;
        })
      : setNewTitle(e.target.value);
  };

  //for text input of coins
  const onChangeCoins = (e) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      if (mode == "new") setNewCoins(e.target.value);
      if (mode == "update") setCoins(e.target.value);
    }
  };

  const onNewPromise = async () => {
    //check if title
    if (newTitle == "") {
      setError("Please fill in title");
      return;
    }
    if (newCoins > score) {
      setError("not enough coins");
      return;
    }

    const newP = await newPromise(newTitle, newCoins);

    if (newP) {
      setPromises((prevPromises) => {
        const updatedPromises = [
          ...prevPromises,
          {promise: newTitle, coins: newCoins, _id: newP},
        ];
        return updatedPromises;
      });
    }
    //  const data = await updatePromise(newP._id, parseInt(coins));
    //  if(data){
    //    setScore((score) => score - (mode === "new" ? newCoins : coins));

    //  }

    cleanUp();
    toggleVisible();
    //check if enough coins
  };

  const onEditPromise = async () => {
    const edit = await editPromise(currentProm._id, currentProm.promise);
    if (edit) {
      console.log(edit, "edit");
      setPromises((prevPromises) => {
        const updatedPromises = prevPromises.map((prom) => {
          if (prom._id === edit) {
            return {...prom, promise: currentProm.promise};
          }
          return prom; // Return the original promise if not updated
        });

        return updatedPromises;
      });
    }
    cleanUp();
    toggleVisible();
  };

  const onDeletePromise = async () => {
    try {
      const del = await deletePromise(currentProm._id);
      if (del) {
        setPromises((prev) => {
          // Use filter to create a new array without the deleted promise
          const updatedProm = prev.filter(
            (prom) => prom._id !== currentProm._id
          );
          return updatedProm;
        });
      }
      cleanUp();
      toggleVisible();
    } catch (error) {
      console.error("Error deleting promise:", error);
    }
  };

  const onUpdateCoins = async () => {
    try {
      if (coins > score) {
        return toast.error("Not enough coins");
      } else {
        const data = await updatePromise(currentProm._id, parseInt(coins));
        if (data) {
          setPromises((prevPromises) => {
            const updatedPromises = prevPromises.map((p) => {
              if (p._id === currentProm._id) {
                return {...p, coins: parseInt(coins) + parseInt(p.coins)};
              }
              return p;
            });
            return updatedPromises;
          });
          setScore((prevScore) => prevScore - coins);
        }
      }
      cleanUp();
      toggleVisible();
    } catch (error) {
      console.error("Error updating coins:", error);
    }
  };

  if (loading) {
    return;
    ("");
  }

  const cleanUp = () => {
    setNewTitle("");
    setNewCoins("");
    setcurrentProm();
    setCoins(0);
    setMode("");
  };

  const PalestineCoins = promises.map((prom) => {
    if (prom.promise === "Donate to Palestine") {
      return prom.coins;
    }
  });

  //because we are not just stu

  return (
    <div
      className="  h-[100vh]  flex p-[20px]  flex-col  gap-[30px] "
      data-theme="luxury"
    >
      <Link to="/">
        <IoMdArrowRoundBack size={25} />
      </Link>

      {/* get score */}
      <div className="flex flex-row gap-4 items-center ">
        <CiCircleInfo
          size={30}
          className="ml-[auto] cursor-pointer"
          onClick={() => {
            setMode("info");
            toggleVisible();
          }}
        />
        <div className="border-2 p-[5px] flex flex-row items-center gap-[5px]   rounded-lg ">
          <PiCoin size={20} />

          {score}
        </div>
      </div>
      <div className="  ">
        <div className=" flex flex-row justify-between w-[100%] items-center ">
          <span className="italic  text-[40px] font-light	tracking-widest	">
            Promises
          </span>

          <FaPlus
            className="hover:cursor-pointer"
            size={20}
            onClick={() => {
              setMode("new");
              toggleVisible();
            }}
          />
        </div>
      </div>
      {/* //add a promise */}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
        {promises?.map((promise) => (
          <>
            <div className="flex flex-col  w-[200px] ">
              <Promise
                promise={promise.promise}
                coins={promise.coins}
                id={promise._id}
                setCurrentProm={setcurrentProm}
                setMode={setMode}
                openModal={toggleVisible}
              />
              {promise._id !== authUser.p_id ? (
                <div className="flex flex-row space-between border-1 py-[5px]  justify-between  ">
                  <>
                    <MdOutlineEdit
                      onClick={() => {
                        setMode("edit");
                        toggleVisible();

                        setcurrentProm(promise);
                      }}
                    />
                    <MdDeleteOutline
                      onClick={() => {
                        setMode("delete");
                        toggleVisible();
                        setcurrentProm(promise);
                      }}
                    />
                  </>
                </div>
              ) : null}
            </div>
          </>
        ))}
      </div>
      {currentProm || mode === "new" || mode === "info" ? (
        <div>
          <Modal.Legacy
            className=" max-w-[90%] sm:max-w-[50%]

             border-2 overflow-hidden"
            open={visible}
            onClickBackdrop={() => {
              cleanUp();
              toggleVisible();
            }}
          >
            {" "}
            <Modal.Body>
              {mode == "new" ? (
                <ModalInput
                  valueP={newTitle}
                  valueC={newCoins}
                  mode={mode}
                  onChangeC={onChangeCoins}
                  onChangeP={onChangePromise}
                />
              ) : mode === "edit" ? (
                <ModalInput
                  valueP={currentProm.promise}
                  mode={mode}
                  onChangeP={onChangePromise}
                />
              ) : mode === "update" ? (
                <ModalInput
                  valueP={currentProm.promise}
                  valueC={currentProm.coins}
                  coins={coins}
                  mode={mode}
                  onChangeC={onChangeCoins}
                />
              ) : mode === "delete" ? (
                <ModalInput mode={mode} valueP={currentProm.promise} />
              ) : (
                <div className="flex flex-col ">
                  <span className="italic pb-[5px]">
                    To add visible worth to the promises,goals in our head
                  </span>
                  <span className="py-2 flex flex-col gap-[5px] italic ">
                    <span>
                      because we don't just study for our grades, our career.{" "}
                      <br />
                    </span>
                    <span>
                      like we promise ourselves to study x hours before watching
                      something. <br /> like we used to put coins in a money box
                      with a single purpose pasted on it.
                    </span>
                  </span>
                  <span>
                    Earn coins by studying & then invest them into your
                    promises. I'll setup a email feature to remind the future
                    you.( & how hard you worked, so you don't just dismiss them.
                    )
                  </span>
                  <span>
                    <h2 className=" py-[5px] font-semibold">
                      Donate to Palestine <br />
                    </h2>
                    as students, we can't do much now but we can promise
                    ourselves to help.We'll all collectively try to donate the
                    total amount so please keep adding points!
                  </span>
                  <span className="pt-[8px]">
                    <span className="font-bold">p.s</span> I won't be taking any
                    money from you, just your word. :)
                  </span>
                </div>
              )}
            </Modal.Body>
            <form
              method="dialog"
              className="  flex items-end justify-items-end"
            >
              <button
                onClick={
                  mode == "new"
                    ? onNewPromise
                    : mode == "edit"
                    ? onEditPromise
                    : mode == "update"
                    ? onUpdateCoins
                    : onDeletePromise
                }
                className=" flex justify-self-end flex-end ml-[auto] "
              >
                <TiTickOutline size={20} color="white" />
              </button>
            </form>
          </Modal.Legacy>
        </div>
      ) : null}

      <div className="flex flex-end  mt-[auto] justify-end italic">
        <p>
          <span className="badge bg-accent text-white">
            {" "}
            ${Math.floor(PalestineCoins[0] / 2)}
          </span>{" "}
          promised donation to 🇵🇸 🤍 (300 points = 1$)
        </p>
      </div>
    </div>
  );
}

export default Shop;

//keep consideration of null promises
//when the user first logs in, this promise must be made, id retrieved & saved, then for this id, remove the edit & delete option ?
