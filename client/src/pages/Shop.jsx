import React, {useState, useEffect, useRef, useCallback} from "react";
import {FaPlus} from "react-icons/fa";
import useSaveScore from "../hooks/useSaveScore";
import usePromise from "../hooks/usePromise";
import Promise from "../components/Promise";
import {TiTickOutline} from "react-icons/ti";
import {MdOutlineEdit, MdDeleteOutline} from "react-icons/md";
import {Modal, Button} from "react-daisyui";
import toast from "react-hot-toast";
import {useAuthContext} from "../context/AuthContext";
const ModalInput = ({onChangeP, valueP, valueC, onChangeC, mode, coins}) => {
  return (
    <div>
      <div className="flex flex-row gap-[10px]">
        <input
          className={`${
            mode !== "delete" ? "border-1" : null
          } text-white italic font-[12px] px-[5px] self-center`}
          placeholder="promise"
          value={valueP}
          onChange={onChangeP}
          disabled={mode === "delete" || mode === "update" ? true : false}
        />
        {mode == "update" ? <input value={coins} onChange={onChangeC} /> : null}

        {mode === "new" || mode === "update" ? (
          <input
            className="border-1 text-white italic font-[12px] px-[5px] self-center"
            placeholder="coins"
            value={valueC}
            onChange={onChangeC}
            disabled={mode === "update" ? true : false}
          />
        ) : null}
      </div>
      {mode === "delete" ? (
        <p>Are you sure you want to delete this promise ?</p>
      ) : null}{" "}
    </div>
  );
};

function Shop() {
  //these things should be in authUser because this s
  const [score, setScore] = useState();
  const [promises, setPromises] = useState();
  const [currentProm, setcurrentProm] = useState(); //focused promise, can be changed, if finalised, change made to promises <---
  const [coins, setCoins] = useState(0); //temp coins, check against score
  const [error, setError] = useState();
  const [mode, setMode] = useState();
  const [newTitle, setNewTitle] = useState(); //new promise title
  const [newCoins, setNewCoins] = useState(); //new promise coins

  const [visible, setVisible] = useState(false);
  const {getScore} = useSaveScore();
  const {authUser} = useAuthContext();
  const {
    getPromises,
    newPromise,
    deletePromise,
    updatePromise,
    editPromise,
  } = usePromise();
  useEffect(() => {
    const getScores = async () => {
      // const data = await getScore();
      // if (data.scores) {

        const total = authUser.scores.reduce(
          (partialSum, a) => partialSum + a.score,
          0
        );
        setScore(total);
      // }
    };

    const getPromise = async () => {
      const data = await getPromises();
      if (data) {
        // const total = data.scores.reduce(
        //   (partialSum, a) => partialSum + a.score,
        //   0
        // );
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
          {promise: newTitle, coins: newCoins},
        ];
        return updatedPromises;
      });
    }
    setScore((score) => score - (mode === "new" ? newCoins : coins));

    setNewTitle("");
    setNewCoins(0);
    toggleVisible();
    //check if enough coins
  };

  const onEditPromise = async () => {
    const edit = await editPromise(currentProm._id, currentProm.promise);
    if (edit) {
      setPromises((prevPromises) => {
        const updatedPromises = [...prevPromises];
        updatedPromises.map((promise) => {
          if (promise._id == edit._id) {
            promise.promise = edit.promise;
          }
        });
        return updatedPromises;
      });
    }
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
      toggleVisible();
    } catch (error) {
      console.error("Error deleting promise:", error);
    }
  };

  // const ref = useRef();
  // const handleShow = useCallback(() => {
  //   ref.current?.showModal();
  // }, [ref]);
  console.log(promises);
  const onUpdateCoins = async () => {
    try {
      console.log(coins, currentProm.coins, "ee");
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
          setCoins(0);
        }
      }
      toggleVisible();
    } catch (error) {
      console.error("Error updating coins:", error);
    }
  };

  return (
    <div className="  h-[100vh]  flex p-[20px]  flex-col  gap-[30px] ">
      {/* get score */}
      <div className="border-1 ml-[auto] p-[5px]  rounded-lg ">{score}</div>
      <div className=" ">
        <div className=" flex flex-row justify-between w-[100%] ">
          <h1>Promises</h1>
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
      {/* <div>
        <input
          className="border-1 text-white italic font-[12px] px-[5px] self-center"
          placeholder="promise"
          value={currentProm}
          onChange={(e) => setcurrentProm(e.target.value)}
        />
        <input
          className="border-1 text-white italic font-[12px] px-[5px] self-center"
          placeholder="coins"
          value={coins}
          onChange={(e) => {
            const regex = /^[0-9\b]+$/;
            if (e.target.value === "" || regex.test(e.target.value)) {
              setCoins(e.target.value);
            }
          }}
        />

        <button onClick={onNewPromise}>
          <TiTickOutline size={20} />
        </button>
      </div> */}
      <div className="flex gap-[20px] ">
        {promises?.map((promise) => (
          <div className="flex flex-col">
            <div className="flex flex-row space-between  justify-between border-2 ">
              {promise._id !== authUser.p_id ? (
                <>
                  <MdOutlineEdit
                    onClick={() => {
                      setMode("edit");
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
              ) : null}
            </div>

            <Promise
              promise={promise.promise}
              coins={promise.coins}
              id={promise._id}
              setCurrentProm={setcurrentProm}
              setMode={setMode}
              openModal={toggleVisible}
            />
          </div>
        ))}
      </div>
      {currentProm ? (
        <div className="font-sans">
          <Modal.Legacy open={visible}>
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
              ) : (
                <ModalInput mode={mode} valueP={currentProm.promise} />
              )}
            </Modal.Body>
            <form method="dialog">
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
              >
                <TiTickOutline size={20} />
              </button>
            </form>
            #{" "}
          </Modal.Legacy>
        </div>
      ) : null}
    </div>
  );
}
3;
export default Shop;

//keep consideration of null promises
//when the user first logs in, this promise must be made, id retrieved & saved, then for this id, remove the edit & delete option ?
